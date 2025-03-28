import asyncHandler from "../middlewares/async.js";
import Fournisseur from "../models/fournisseurModel.js";

// @desc    Get all fournisseurs with pagination and filters
// @route   GET /api/fournisseurs
// @access  Public
const getFournisseurs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "createdAt",
    order = "desc",
    search,
    filter,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NOM: { $regex: search, $options: "i" } },
      { AD1: { $regex: search, $options: "i" } },
      { AD2: { $regex: search, $options: "i" } },
      { AD3: { $regex: search, $options: "i" } },
      { AD4: { $regex: search, $options: "i" } },
      { TEL: { $regex: search, $options: "i" } },
      { FAX: { $regex: search, $options: "i" } },
      { OBSERV: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  const totalItems = await Fournisseur.countDocuments(queryFilters);

  const fournisseurs = await Fournisseur.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    fournisseurs,
  });
});

// @desc    Get fournisseur by ID
// @route   GET /api/fournisseurs/:id
// @access  Public
const getFournisseurById = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findById(req.params.id);

  if (!fournisseur) {
    res.status(404);
    throw new Error("Fournisseur introuvable.");
  }

  res.status(200).json(fournisseur);
});

// @desc    Get fournisseurs by FOURN
// @route   GET /api/fournisseurs/fourn/:fournId
// @access  Public
const getFournisseursByFourn = asyncHandler(async (req, res) => {
  const fournId = parseInt(req.params.fournId, 10);

  if (isNaN(fournId)) {
    res.status(400);
    throw new Error("L'identifiant du fournisseur doit être un nombre.");
  }

  const fournisseurs = await Fournisseur.find({ FOURN: fournId });

  if (!fournisseurs || fournisseurs.length === 0) {
    res.status(404);
    throw new Error("Aucun fournisseur trouvé pour cet identifiant.");
  }

  res.status(200).json(fournisseurs);
});

// @desc    Get fournisseur by NOM
// @route   GET /api/fournisseurs/nom/:nom
// @access  Public
const getFournisseurByNom = asyncHandler(async (req, res) => {
  const { nom } = req.params;

  const fournisseur = await Fournisseur.findOne({ NOM: nom });

  if (!fournisseur) {
    res.status(404);
    throw new Error("Fournisseur introuvable pour ce nom.");
  }

  res.status(200).json(fournisseur);
});

export {
  getFournisseurs,
  getFournisseurById,
  getFournisseursByFourn,
  getFournisseurByNom,
};
