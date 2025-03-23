import express from "express";
import {
  getArticles,
  getArticleById,
  getArticlesByFournisseur,
  getArticleByGencode,
} from "../controllers/articleController.js";

const router = express.Router();

router.get("/", getArticles); // Obtenir tous les articles avec pagination et filtres
router.get("/:id", getArticleById); // Obtenir un article par son ID
router.get("/fournisseur/:fournisseurId", getArticlesByFournisseur); // Obtenir tous les articles d'un fournisseur
router.get("/gencode/:gencode", getArticleByGencode);
export default router;