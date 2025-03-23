import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./articlePage.css"; // <-- Import de votre fichier CSS

const ArticlePage = () => {
  const { gencode } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gencode) {
      fetch(`/api/articles/gencode/${gencode}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Article introuvable ou erreur serveur");
          }
          return response.json();
        })
        .then((data) => setArticle(data))
        .catch((err) => setError(err.message));
    }
  }, [gencode]);

  // Fonction pour revenir à la page d'accueil (rescan)
  const handleRescan = () => {
    navigate("/");
  };

  // Liste de champs à afficher
  const fields = [
    { key: "NART", label: "NART" },
    { key: "DESIGN", label: "Désignation" },
    { key: "GISM1", label: "Gissement" },
    { key: "GENCOD", label: "Gencode" },
    { key: "FOURN", label: "Fourn." },
    { key: "STOCK", label: "Stock" },
    { key: "S1", label: "Stock Magasin" },
    { key: "S2", label: "Stock Dock" },
    { key: "S3", label: "Stock 3" },
    { key: "S4", label: "Stock 4" },
    { key: "S5", label: "Stock 5" },
    { key: "ENCDE", label: "En commande" },
    { key: "ATVA", label: "Taux TGC" },
    { key: "PVTETTC", label: "Prix TTC" },
    { key: "DEPREC", label: "Dépréciation" },
    // Ajoutez d'autres champs si nécessaire
  ];

  return (
    <div className="article-page">
      <h2 className="title">Fiche Article</h2>

      {error && <p className="error">{error}</p>}

      {article && (
        <div className="article-info">
          {/* 
            Vérifie si DEPREC n'est pas 0. 
            Si c'est différent de 0, on affiche le message rouge en haut.
          */}
          {article.DEPREC !== 0 && (
            <p className="deprec-warning">Produit déprécié</p>
          )}

          {/* Affiche la liste de champs */}
          {fields.map((f) => (
            <div key={f.key} className="field-row">
              <span className="field-label">{f.label} :</span>
              <span className="field-value">{article[f.key] ?? "-"}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleRescan} className="rescan-button">
        Re-scanner un article
      </button>
    </div>
  );
};

export default ArticlePage;
