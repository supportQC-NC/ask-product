import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./articlePage.css";
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
          if (!response.ok)
            throw new Error("Article introuvable ou erreur serveur");
          return response.json();
        })
        .then((data) => setArticle(data))
        .catch((err) => setError(err.message));
    }
  }, [gencode]);

  const handleRescan = () => navigate("/");

  const isPromotionActive = (start, end) => {
    if (!start || !end) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    const promoStart = new Date(start).setHours(0, 0, 0, 0);
    const promoEnd = new Date(end).setHours(23, 59, 59, 999);
    return today >= promoStart && today <= promoEnd;
  };

  const formatDateFr = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  const calculPrixPromoTTC = (prixHT, atva) => {
    const taux = atva / 100;
    return (prixHT * (1 + taux)).toFixed(2);
  };

  return (
    <div className="article-page">
      {/* Image de l'article, basée sur NART ou une image par défaut */}

      {article ? (
        <>
          {article.DEPREC !== 0 && (
            <p className="deprec-warning">Produit déprécié</p>
          )}

          {isPromotionActive(article.DPROMOD, article.DPROMOF) && (
            <p className="promo-active">
              EN PROMOTION jusqu'au {formatDateFr(article.DPROMOF)}
            </p>
          )}

          <h2 className="title">{article.DESIGN ?? "-"}</h2>
          <div className="article-header">
            <div className="nart-container">
              <p>Nart</p>
              <span className="nart">{article.NART ?? "-"}</span>
            </div>
          </div>

          <div className="stock-info-container">
            <div className="stock-card-info">
              <div className="info">
                <h3>Stock</h3>
                <span
                  className={
                    article.STOCK === 0 ? "stock-rupture" : "stock-available"
                  }
                >
                  {article.STOCK === 0 ? "RUPTURE" : article.STOCK}
                </span>
              </div>
              <div className="stock-card-info">
                <div className="info">
                  <h3>En commande</h3>
                  <span
                    className={
                      article.ENCDE === 0 ? "stock-rupture" : "stock-available"
                    }
                  >
                    {article.ENCDE}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="article-info">
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
              <span className="field-label">Prix TTC :</span>
              <span className="field-value">
                {isPromotionActive(article.DPROMOD, article.DPROMOF)
                  ? `${Math.round(
                      calculPrixPromoTTC(article.PVPROMO, article.ATVA)
                    )} XPF`
                  : `${article.PVTETTC ?? "-"} XPF`}
              </span>
            </div>

            {isPromotionActive(article.DPROMOD, article.DPROMOF) && (
              <div className="field-row">
                <span className="field-label ancien-prix">
                  hors promotion :
                </span>
                <span className="field-value ancien-prix">
                  {article.PVTETTC ? Math.round(article.PVTETTC) : "-"} XPF
                </span>
              </div>
            )}
            <div className="field-row">
              <span className="field-label">Taux TGC :</span>
              <span className="field-value">{article.ATVA ?? "-"}%</span>
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
