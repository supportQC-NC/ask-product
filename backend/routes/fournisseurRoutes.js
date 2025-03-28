import express from "express";
import {
  getFournisseurs,
  getFournisseurById,
  getFournisseursByFourn,
  getFournisseurByNom,
} from "../controllers/fournisseurController.js";

const router = express.Router();

router.get("/", getFournisseurs); // Obtenir tous les fournisseurs avec pagination et filtres
router.get("/:id", getFournisseurById); // Obtenir un fournisseur par son ID
router.get("/fourn/:fournId", getFournisseursByFourn); // Obtenir tous les fournisseurs par l'identifiant FOURN
router.get("/nom/:nom", getFournisseurByNom); // Obtenir un fournisseur par son nom

export default router;
