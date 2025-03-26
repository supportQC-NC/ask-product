import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./articlePage.css";
import StockCard from "../../components/articlePage/StockCard";
import Loader from "../../components/loader/Loader";

const ArticlePage = () => {
  const { gencode } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [pdfFile, setPdfFile] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (gencode) {
      fetch(`/api/articles/gencode/${gencode}`)
        .then((response) => {
          if (!response.ok)
            throw new Error("Article introuvable ou erreur serveur");
          return response.json();
        })
        .then((data) => {
          setArticle(data);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [gencode]);

  useEffect(() => {
    if (article) {
      const handleImageLoad = async (imageSrc) => {
        try {
          const response = await fetch(imageSrc);
          if (response.ok) {
            setImageSrc(imageSrc);
          } else {
            setImageSrc("/photos/default.png");
          }
        } catch (error) {
          setImageSrc("/photos/default.png");
        }
      };

      handleImageLoad(`/photos/${article.NART ?? "default"}.png`);

      const pdfFileUrl = `/photos/${article.NART}.pdf`;
      fetch(pdfFileUrl)
        .then((response) => {
          if (response.ok) {
            setPdfFile(true);
          } else {
            setPdfFile(false);
          }
        })
        .catch((error) => {
          setPdfFile(false);
        });
    }
  }, [article]);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="article-page">
      {loader ? (
        <Loader />
      ) : (
        <>
          {article && imageSrc ? (
            <img
              className="article-image"
              src={imageSrc}
              alt={article.DESIGN ?? "-"}
              onError={(e) => {
                e.target.src = "/photos/default.png";
              }}
            />
          ) : (
            <img
              className="article-image"
              src="/photos/default.png"
              alt=""
              onError={(e) => {
                e.target.src = "/photos/default.png";
              }}
            />
          )}
          {article ? (
            <>
              {article.DEPREC !== 0 && (
                <p className="deprec-warning">Article déprécié</p>
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
                        article.STOCK === 0
                          ? "stock-rupture"
                          : "stock-available"
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
                          article.ENCDE === 0
                            ? "stock-rupture"
                            : "stock-available"
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
                  <span className="field-value gis">
                    {article.GISM1 ?? "-"}
                  </span>
                </div>

                <div className="stock-container">
                  <StockCard
                    item={{ gissement: "Magasin", stock: article.S1 }}
                  />
                  <StockCard item={{ gissement: "Dock", stock: article.S2 }} />
                  <StockCard
                    item={{ gissement: "Bureau", stock: article.S3 }}
                  />
                  <StockCard item={{ gissement: "SCEB", stock: article.S4 }} />
                  <StockCard
                    item={{ gissement: "Mecalac", stock: article.S5 }}
                  />
                </div>

                <div className="field-row">
                  <span className="field-label">Prix TTC :</span>
                  <span className="field-value">
                    {isPromotionActive(article.DPROMOD, article.DPROMOF)
                      ? `${formatPrice(
                          Math.round(
                            calculPrixPromoTTC(article.PVPROMO, article.ATVA)
                          )
                        )} XPF`
                      : `${formatPrice(article.PVTETTC ?? 0)} XPF`}
                  </span>
                </div>

                {isPromotionActive(article.DPROMOD, article.DPROMOF) && (
                  <div className="field-row">
                    <span className="field-label ancien-prix">
                      hors promotion :
                    </span>
                    <span className="field-value ancien-prix">
                      {article.PVTETTC
                        ? `${formatPrice(article.PVTETTC)} XPF`
                        : "-"}
                    </span>
                  </div>
                )}
                <div className="field-row">
                  <span className="field-label">Taux TGC :</span>
                  <span className="field-value">{article.ATVA ?? "-"}%</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Prix HT :</span>
                  <span className="field-value">{article.PVTE ?? "-"} XPF</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Ref Fournisseur:</span>
                  <span className="field-value">{article.REFER ?? "-"}</span>
                </div>
              </div>
              <div className="observation">
                <h3 className="observation-title">Observation</h3>
                <p
                  className={`observation-txt ${
                    article.OBSERV === "" || article.OBSERV === null
                      ? "empty-observation"
                      : ""
                  }`}
                >
                  {article.OBSERV ?? "Aucune observation"}
                </p>
              </div>
              {pdfFile && (
                <div className="fiche-technique">
                  <h3 className="fiche-technique-title">Fiche technique</h3>
                  <a
                    href={`/photos/${article.NART}.pdf`}
                    download={`${article.NART}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-button"
                  >
                    Télécharger la fiche technique
                  </a>
                </div>
              )}
            </>
          ) : (
            <Loader />
          )}
        </>
      )}
      {error && <p className="error">{error}</p>}
      <button onClick={handleRescan} className="rescan-button">
        Re-scanner un article
      </button>
    </div>
  );
};

export default ArticlePage;
