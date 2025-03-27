import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./notFound.css";
// Pour un joli visuel d'erreur, vous pouvez ajouter une image de votre choix.
// import errorImage from "../assets/404.png";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/user/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <div className="notfound-container">
      {/* Si vous avez un visuel, décommentez la ligne suivante et importez errorImage */}
      {/* <img src={errorImage} alt="Page introuvable" className="notfound-image" /> */}

      <h1 className="notfound-title">!!</h1>
      <p className="notfound-text">AUCUNE FICHE TECHNIQUE POUR CE PRODUIT</p>

      <Link to="/" className="notfound-link">
        Retour (ESC)
      </Link>
    </div>
  );
};

export default NotFound;
