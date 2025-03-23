import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Barcode from "react-barcode";
import "./articlePage.css"; // <-- Import de votre fichier CSS
import StockCard from "../../components/articlePage/StockCard";

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

  const handleRescan = () => {
    navigate("/");
  };

  return (
    <div className="article-page">
      {/* Vérifiez d'abord si article existe avant de tenter d'accéder à ses propriétés */}
      {article ? (
        <>
          {article.DEPREC !== 0 && (
            <p className="deprec-warning">Produit déprécié</p>
          )}
          <h2 className="title">{article.DESIGN ?? "-"}</h2>
          <div className="stock-info-container">
            <div className="stock-card-info">
              <h3>Stock :</h3>
              <span
                className={
                  article.STOCK === 0 ? "stock-rupture" : "stock-available"
                }
              >
                {article.STOCK === 0 ? "RUPTURE" : `${article.STOCK}`}
              </span>
            </div>
            <div className="stock-card-info">
              <h3>En commande :</h3>
              <span
                className={
                  article.ENCDE === 0 ? "stock-rupture" : "stock-available"
                }
              >
                {article.ENCDE === 0 ? "0" : `${article.ENCDE}`}
              </span>
            </div>
          </div>

          <div className="article-info">
            <div className="article-header">
              <div className="barcode-container">
                <Barcode value={article.GENCOD ?? ""} format="CODE128" />
              </div>
              <div className="nart-container">
                <span className="nart-label">NART :</span>
                <span className="nart">{article.NART ?? "-"}</span>
              </div>
            </div>

            <div className="field-row">
              <span className="field-label">Gissement :</span>
              <span className="field-value">{article.GISM1 ?? "-"}</span>
            </div>

            <div className="stock-container">
              <StockCard item={{ gissement: "Magasin", stock: article.S1 }} />
              <StockCard item={{ gissement: "Dock", stock: article.S2 }} />
              <StockCard item={{ gissement: "Bureau", stock: article.S3 }} />
              <StockCard item={{ gissement: "SCEB", stock: article.S4 }} />
              <StockCard item={{ gissement: "Mecalac", stock: article.S5 }} />
            </div>

            <div className="field-row">
              <span className="field-label">Taux TGC :</span>
              <span className="field-value">{article.ATVA ?? "-"}%</span>
            </div>

            <div className="field-row">
              <span className="field-label">Prix TTC :</span>
              <span className="field-value">{article.PVTETTC ?? "-"} XPF</span>
            </div>
          </div>
        </>
      ) : (
        <p>Chargement des données de l'article ou article non trouvé...</p>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={handleRescan} className="rescan-button">
        Re-scanner un article
      </button>
    </div>
  );
};

export default ArticlePage;
