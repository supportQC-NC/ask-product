import React from "react";
import { Link } from "react-router-dom";
import "./notFound.css";
// Pour un joli visuel d'erreur, vous pouvez ajouter une image de votre choix.
// import errorImage from "../assets/404.png";

const NotFound = () => {
  return (
    <div className="notfound-container">
      {/* Si vous avez un visuel, décommentez la ligne suivante et importez errorImage */}
      {/* <img src={errorImage} alt="Page introuvable" className="notfound-image" /> */}

      <h1 className="notfound-title">Page introuvable</h1>
      <p className="notfound-text">
        Oups ! La page que vous recherchez est introuvable ou n’existe plus.
      </p>

      <Link to="/" className="notfound-link">
        Retour à l’accueil
      </Link>
    </div>
  );
};

export default NotFound;
