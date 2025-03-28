import express from "express";

import multer from "multer";
import upload from "../middlewares/multer.js";
import {
  createZone,
  getZoneById,
  getZones,
  importZonesFromCSV,
} from "../controllers/zoneController.js";

const router = express.Router();

router.get("/", getZones); // Obtenir toutes les zones avec pagination et filtres
router.get("/:id", getZoneById); // Obtenir une zone par son ID
router.post("/", createZone); // Créer une nouvelle zone
router.post("/import", upload.single("file"), importZonesFromCSV); // Importer des zones à partir d'un fichier CSV

export default router;
