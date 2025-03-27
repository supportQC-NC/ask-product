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

  const commandes = [
    {
      etat: "G bateau",
      numCommande: "329387",
      qteCommande: 20,
      qteArrivee: 0,
      transport: "NORDPACIFIC",
    },
    {
      etat: "En attente",
      numCommande: "329388",
      qteCommande: 15,
      qteArrivee: 5,
      transport: "SUDPACIFIC",
    },
    {
      etat: "En transit",
      numCommande: "329389",
      qteCommande: 30,
      qteArrivee: 10,
      transport: "ESTPACIFIC",
    },
  ];

  return (
    <div className="commande-container">
      <h2>Detail de la commande pour l'article</h2>
      {commandes.map((commande, index) => (
        <table className="commande-table" key={index}>
          <thead>
            <tr>
              <th>Etat</th>
              <th>Num commande</th>
              <th>QTE commande</th>
              <th>QTE arrivée</th>
              <th>Transport</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{commande.etat}</td>
              <td>{commande.numCommande}</td>
              <td>{commande.qteCommande}</td>
              <td>{commande.qteArrivee}</td>
              <td>{commande.transport}</td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default ArticleCommandeDetails;
