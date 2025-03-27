import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./articleCommandeDetails.css";

const ArticleCommandeDetails = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        navigate(-1); // Revenir à la page précédente
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [navigate]);

  return (
    <div className="commande-container">
      <h2>Detail de la commande pour l'article</h2>
      <div className="commande-item">
        <p className="commande-label">Etat:</p>
        <p className="commande-value">G bateau</p>
      </div>
      <div className="commande-item">
        <p className="commande-label">Num commande:</p>
        <p className="commande-value">329387</p>
      </div>
      <div className="commande-item">
        <p className="commande-label">QTE commande:</p>
        <p className="commande-value">20</p>
      </div>
      <div className="commande-item">
        <p className="commande-label">QTE arrivée:</p>
        <p className="commande-value">0</p>
      </div>
      <div className="commande-item">
        <p className="commande-label">Transport:</p>
        <p className="commande-value">NORDPACIFIC</p>
      </div>
    </div>
  );
};

export default ArticleCommandeDetails;
