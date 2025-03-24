import asyncHandler from "../middlewares/async.js";
import Article from "../models/articleModel.js";

// @desc    Get all articles with pagination and filters
// @route   GET /api/articles
// @access  Public
const getArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NART: { $regex: search, $options: "i" } },
      { DESIGN: { $regex: search, $options: "i" } },
      { DESIGN2: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  const totalItems = await Article.countDocuments(queryFilters);

  const articles = await Article.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    articles,
  });
});

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    res.status(404);
    throw new Error("Article introuvable.");
  }

  res.status(200).json(article);
});

// @desc    Get all articles by a specific fournisseur
// @route   GET /api/articles/fournisseur/:fournisseurId
// @access  Public
const getArticlesByFournisseur = asyncHandler(async (req, res) => {
  const fournisseurId = parseInt(req.params.fournisseurId, 10);

  if (isNaN(fournisseurId)) {
    res.status(400);
    throw new Error("L'identifiant du fournisseur doit être un nombre.");
  }

  const articles = await Article.find({ FOURN: fournisseurId });

  if (!articles || articles.length === 0) {
    res.status(404);
    throw new Error("Aucun article trouvé pour ce fournisseur.");
  }

  res.status(200).json(articles);
});


// @desc    Get article by GENCODE
// @route   GET /api/articles/gencode/:gencode
// @access  Public
const getArticleByGencode = asyncHandler(async (req, res) => {
    const { gencode } = req.params;
  
    // Recherche d'un seul article avec le champ GENCODE
    const article = await Article.findOne({ GENCOD: gencode });
  
    if (!article) {
      res.status(404);
      throw new Error("Article introuvable pour ce gencode.");
    }
  
    res.status(200).json(article);
  });
// @desc    Get article by NART
// @route   GET /api/articles/gencode/:gencode
// @access  Public
const getArticleByNart = asyncHandler(async (req, res) => {
    const { nart } = req.params;
  
    // Recherche d'un seul article avec le champ GENCODE
    const article = await Article.findOne({ NART: nart });
  
    if (!article) {
      res.status(404);
      throw new Error("Article introuvable pour ce nart.");
    }
  
    res.status(200).json(article);
  });

export { getArticles, getArticleById, getArticlesByFournisseur , getArticleByGencode , getArticleByNart}; 