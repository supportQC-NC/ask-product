import path from "path";
import fs from "fs";
import { DBFFile } from "dbffile";
import dotenv from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
import cliProgress from "cli-progress";

// ===========================================
// 0. Chargement des variables d'environnement
// ===========================================
dotenv.config({ path: path.resolve("config/config.env") });

// ===========================================
// 0-bis. Import du modèle Article et Fournisseur
// ===========================================
import Article from "../models/articleModel.js";
import Fournisseur from "../models/fournisseurModel.js";

// ===========================================
// 1. Fonctions utilitaires pour renommer les champs en double
// ===========================================
function renameDuplicateFields(buffer) {
  const headerLength = buffer.readUInt16LE(8);

  let offset = 32;
  const fields = [];

  while (true) {
    // 0x0D = fin de la liste de champs
    if (buffer[offset] === 0x0d) break;
    const fieldDescriptor = buffer.slice(offset, offset + 32);

    let fieldName = fieldDescriptor.toString("ascii", 0, 11);
    fieldName = fieldName.replace(/\x00/g, "").trim();

    fields.push({
      fieldName,
      offset,
    });

    offset += 32;
  }

  const seenNames = {};
  for (const field of fields) {
    const originalName = field.fieldName;
    if (!seenNames[originalName]) {
      seenNames[originalName] = 0;
    }
    seenNames[originalName]++;

    // Renommer si on détecte un duplicata
    if (seenNames[originalName] > 1) {
      const newName = `${originalName}_${seenNames[originalName]}`.slice(0, 10);
      const newNameBuf = Buffer.alloc(11, 0x00);
      newNameBuf.write(newName, 0, "ascii");
      newNameBuf.copy(buffer, field.offset, 0, 11);
    }
  }

  return buffer;
}

async function openDbfWithRenamedFields(filePath) {
  const originalBuffer = fs.readFileSync(filePath);
  const patchedBuffer = renameDuplicateFields(originalBuffer);

  const tempFilePath = filePath.replace(/\.dbf$/i, ".temp.dbf");
  fs.writeFileSync(tempFilePath, patchedBuffer);

  return await DBFFile.open(tempFilePath);
}

// ===========================================
// 2. Logique de connexion à MongoDB
//    inspirée de votre exemple
// ===========================================
async function connectDB() {
  try {
    // Choisir l'URI MongoDB en fonction de l'environnement
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? "mongodb://127.0.0.1:27017/ask-product"
        : "mongodb://127.0.0.1:27017/ask-product";

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined");
    }

    // Connexion à MongoDB
    const conn = await mongoose.connect(mongoURI, {
      // Vous pouvez ajouter vos options Mongoose ici
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
}

// ===========================================
// 3. Fonctions utilitaires générales
// ===========================================
function logError(message) {
  fs.appendFileSync(
    "./error.log",
    `${new Date().toISOString()} - ${message}\n`
  );
}

function sanitizeRecord(record) {
  const sanitized = {};
  for (const [key, value] of Object.entries(record)) {
    if (!Object.hasOwn(sanitized, key)) {
      sanitized[key] = typeof value === "number" && isNaN(value) ? 0 : value;
    } else {
      logError(`Duplicate field '${key}' detected in record. Champ ignoré.`);
    }
  }
  return sanitized;
}

const startTime = Date.now();
function formatElapsedTime() {
  const elapsedMs = Date.now() - startTime;
  const seconds = Math.floor((elapsedMs / 1000) % 60);
  const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
  const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
  return `${hours}h ${minutes}m ${seconds}s`;
}

function createProgressBar(fileName, total) {
  return new cliProgress.SingleBar(
    {
      format: `${colors.yellow.bold(fileName)} |${colors.blue(
        "{bar}"
      )}| ${colors.green("{value}")}${colors.blue(
        "/{total}"
      )} Enregistrements || {percentage}% || ETA: {eta_formatted}`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      etaBuffer: 50,
    },
    cliProgress.Presets.rect
  );
}

// ===========================================
// 4. Importer les articles depuis article.dbf
// ===========================================
async function processArticles() {
  // Vérifier le chemin du fichier
  const dbfFolder = path.resolve("./backend/_dbf"); // Ajustez si nécessaire
  const dbfFilePath = path.join(dbfFolder, "article.dbf");

  if (!fs.existsSync(dbfFilePath)) {
    const errorMsg = `⚠️ Fichier article.dbf introuvable dans ${dbfFolder}`;
    console.warn(colors.yellow(errorMsg));
    logError(errorMsg);
    return;
  }

  let dbf;
  try {
    dbf = await openDbfWithRenamedFields(dbfFilePath);
  } catch (error) {
    const errorMsg = `❌ Erreur lors de l'ouverture de article.dbf : ${error.message}`;
    console.error(colors.red(errorMsg));
    logError(errorMsg);
    return;
  }

  console.log(
    colors.cyan.bold(
      `\n📄 Lecture de article.dbf. ${dbf.recordCount} enregistrements.`
    )
  );

  // On supprime tous les articles déjà présents en DB
  console.log(
    colors.yellow(`🗑️ Suppression des anciennes données (articles) ...`)
  );
  await Article.deleteMany();

  // Barre de progression
  const progressBar = createProgressBar("article.dbf", dbf.recordCount);
  progressBar.start(dbf.recordCount, 0);

  const records = await dbf.readRecords();
  let insertedCount = 0;

  for (const record of records) {
    const sanitizedRecord = sanitizeRecord(record);
    try {
      await Article.create(sanitizedRecord);
      insertedCount++;
      progressBar.update(insertedCount);
    } catch (err) {
      if (err.message.includes("Duplicate field name")) {
        logError(`Duplicate field error in article.dbf: ${err.message}`);
        console.warn(
          colors.yellow(
            `⚠️ Duplicate field detected and skipped in article.dbf.`
          )
        );
      } else {
        const errorMsg = `❌ Erreur d'insertion pour article.dbf: ${err.message}`;
        console.error(colors.red(errorMsg));
        logError(errorMsg);
      }
    }
  }

  progressBar.stop();
  console.log(
    colors.green.bold(
      `✅ Importation réussie : ${insertedCount}/${dbf.recordCount} enregistrements insérés.`
    )
  );
}

// ===========================================
// 5. Importer les fournisseurs depuis fournisseur.dbf
// ===========================================
async function processFournisseurs() {
  // Vérifier le chemin du fichier
  const dbfFolder = path.resolve("./backend/_dbf"); // Ajustez si nécessaire
  const dbfFilePath = path.join(dbfFolder, "fourniss.dbf");

  if (!fs.existsSync(dbfFilePath)) {
    const errorMsg = `⚠️ Fichier fournisseur.dbf introuvable dans ${dbfFolder}`;
    console.warn(colors.yellow(errorMsg));
    logError(errorMsg);
    return;
  }

  let dbf;
  try {
    dbf = await openDbfWithRenamedFields(dbfFilePath);
  } catch (error) {
    const errorMsg = `❌ Erreur lors de l'ouverture de fournisseur.dbf : ${error.message}`;
    console.error(colors.red(errorMsg));
    logError(errorMsg);
    return;
  }

  console.log(
    colors.cyan.bold(
      `\n📄 Lecture de fournisseur.dbf. ${dbf.recordCount} enregistrements.`
    )
  );

  // On supprime tous les fournisseurs déjà présents en DB
  console.log(
    colors.yellow(`🗑️ Suppression des anciennes données (fournisseurs) ...`)
  );
  await Fournisseur.deleteMany();

  // Barre de progression
  const progressBar = createProgressBar("fournisseur.dbf", dbf.recordCount);
  progressBar.start(dbf.recordCount, 0);

  const records = await dbf.readRecords();
  let insertedCount = 0;

  for (const record of records) {
    const sanitizedRecord = sanitizeRecord(record);
    try {
      await Fournisseur.create(sanitizedRecord);
      insertedCount++;
      progressBar.update(insertedCount);
    } catch (err) {
      if (err.message.includes("Duplicate field name")) {
        logError(`Duplicate field error in fournisseur.dbf: ${err.message}`);
        console.warn(
          colors.yellow(
            `⚠️ Duplicate field detected and skipped in fournisseur.dbf.`
          )
        );
      } else {
        const errorMsg = `❌ Erreur d'insertion pour fournisseur.dbf: ${err.message}`;
        console.error(colors.red(errorMsg));
        logError(errorMsg);
      }
    }
  }

  progressBar.stop();
  console.log(
    colors.green.bold(
      `✅ Importation réussie : ${insertedCount}/${dbf.recordCount} enregistrements insérés.`
    )
  );
}

// ===========================================
// 6. Lancement principal
// ===========================================
(async function importData() {
  console.time("⏱️ Temps total d'exécution");

  try {
    // 1) Connexion à la base MongoDB
    await connectDB();

    // 2) Importation des articles
    await processArticles();

    // 3) Importation des fournisseurs
    await processFournisseurs();

    // 4) Confirmation et temps total
    console.log(
      colors.green.inverse(
        "🎉 Importation complète pour article.dbf et fournisseur.dbf"
      )
    );
    console.log(colors.cyan(`⏱️ Temps total écoulé : ${formatElapsedTime()}`));
    console.timeEnd("⏱️ Temps total d'exécution");
  } catch (error) {
    console.error(colors.red.bold(`❌ Erreur critique : ${error.message}`));
    logError(`Erreur critique : ${error.message}`);
  } finally {
    // Fermer la connexion Mongo si nécessaire
    mongoose.connection.close();
    process.exit();
  }
})();
