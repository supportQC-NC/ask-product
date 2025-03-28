import asyncHandler from "../middlewares/async.js";
import Zone from "../models/zoneModel.js";
import csv from "csv-parser";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import multer from "multer";
const upload = multer({ dest: "./uploads/" });

// @desc    Get all zones with pagination and filters
// @route   GET /api/zones
// @access  Public
// const getZones = asyncHandler(async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       sort = "createdAt",
//       order = "desc",
//       search,
//       filter,
//     } = req.query;

//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);

//     const queryFilters = {};

//     if (search) {
//       queryFilters.$or = [
//         { zone: { $regex: search, $options: "i" } },
//         { libelle: { $regex: search, $options: "i" } },
//         { lieux: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (filter) {
//       const parsedFilter = JSON.parse(filter);
//       Object.entries(parsedFilter).forEach(([key, value]) => {
//         queryFilters[key] = value;
//       });
//     }

//     const totalItems = await Zone.countDocuments(queryFilters);

//     const zones = await Zone.find(queryFilters)
//       .sort({ [sort]: order === "desc" ? -1 : 1 })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize);

//     res.status(200).json({
//       page: pageNumber,
//       limit: pageSize,
//       totalItems,
//       totalPages: Math.ceil(totalItems / pageSize),
//       zones,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la récupération des zones." });
//   }
// });
const getZones = asyncHandler(async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des zones." });
  }
});

// @desc    Get zone by ID
// @route   GET /api/zones/:id
// @access  Public
const getZoneById = asyncHandler(async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      res.status(404).json({ message: "Zone introuvable." });
    } else {
      res.status(200).json(zone);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la zone." });
  }
});

// @desc    Create new zone
// @route   POST /api/zones
// @access  Private
const createZone = asyncHandler(async (req, res) => {
  try {
    const { zone, libelle, lieux } = req.body;

    const newZone = await Zone.create({
      zone,
      libelle,
      lieux,
    });

    res.status(201).json(newZone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de la zone." });
  }
});

// @desc    Import zones from CSV file
// @route   POST /api/zones/import
// @access  Private
const importZonesFromCSV = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Veuillez fournir un fichier CSV." });
    } else {
      const csvFile = req.file;
      const zones = [];

      fs.createReadStream(csvFile.path)
        .pipe(csv({ separator: ";" }))
        .on("data", (row) => {
          zones.push({
            zone: row.zone,
            libelle: row.libelle,
            lieux: row.lieux,
          });
        })
        .on("end", async () => {
          try {
            await Zone.insertMany(zones);
            res.status(201).json({ message: "Zones importées avec succès." });
          } catch (error) {
            console.error(error);
            res
              .status(500)
              .json({ message: "Erreur lors de l'importation des zones." });
          }
        })
        .on("error", (error) => {
          console.error(error);
          res
            .status(500)
            .json({ message: "Erreur lors de l'importation des zones." });
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'importation des zones." });
  }
});

export { getZones, getZoneById, createZone, importZonesFromCSV };
