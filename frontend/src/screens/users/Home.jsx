import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // <-- Import du fichier CSS

const Home = () => {
  const [gencode, setGencode] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (gencode.trim()) {
      // Redirection vers la page "Article" en passant le GENCODE
      navigate(`/user/article/${gencode}`);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Recherche d'article par GENCODE</h2>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Scannez ou saisissez un GENCODE"
          value={gencode}
          onChange={(e) => setGencode(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Rechercher
        </button>
      </div>
    </div>
  );
};

export default Home;
