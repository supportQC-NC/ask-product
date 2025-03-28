import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import colors from "colors";
import errorHandler from "./middlewares/error.js";
import articleRoutes from "./routes/articleRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import multer from "multer";

// Configuration des variables d'environnement
dotenv.config();

// Définition des constantes
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://krysto.io",
  "https://api.krysto.io",
];

// Obtenir le chemin absolu actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Définition des variables
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5000;

// Connexion à la base de données MongoDB
connectDB();

// Middleware pour parsing des requêtes JSON, URL-encoded, et cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration des logs pour le mode développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configuration des fichiers statiques
app.use("/doc", express.static(path.join(__dirname, "doc")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Configuration CORS
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      console.log("Origine de la requête:", origin);
      if (!origin) return callback(null, true);
      if (!ALLOWED_ORIGINS.includes(origin)) {
        const msg = "CORS bloqué : origine non autorisée.";
        console.error(msg, origin);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
  })
);

// Middleware pour gérer les requêtes OPTIONS
app.options("*", cors());

// Route principale pour servir la documentation de l'API
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "doc", "api-doc.html"));
});

// Configuration du middleware pour gérer les fichiers uploadés
const upload = multer({ dest: UPLOAD_DIR });

// Montage des routes
app.use("/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/zones", zoneRoutes);

// Route pour gérer les fichiers uploadés
const handleUpload = (req, res) => {
  try {
    const file = req.file;
    console.log("Fichier uploadé:", file);
    // Traitement du fichier uploadé
    res.status(201).json({ message: "Fichier uploadé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    res.status(500).json({ message: "Erreur lors de l'upload du fichier" });
  }
};

app.post("/api/zones/import", upload.single("file"), handleUpload);

// Middleware pour vérifier l'autorisation et déboguer
app.use((req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  console.log("Cookies:", req.cookies);
  next();
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable: ${req.originalUrl}`,
  });
});

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur :", err);
  res.status(500).json({ message: "Erreur interne" });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(
    `Serveur en cours d'exécution sur le port ${port} en mode ${
      isProduction ? "Production".red : "Développement".cyan
    }`.green.bold
  );
});
