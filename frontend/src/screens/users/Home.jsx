import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // <-- Import du fichier CSS

const Home = () => {
  const [gencode, setGencode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (gencode.trim() && !isSearching) {
      setIsSearching(true);
      // Redirection vers la page "Article" en passant le GENCODE
      navigate(`/user/article/${gencode}`).then(() => {
        setIsSearching(false);
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Recherche d'articles </h2>

      <div className="btn-container">
        <button
          className="btn"
          onClick={() => navigate("/user/gencode/search")}
        >
          Recherche par GENCODE
        </button>
        <button className="btn" onClick={() => navigate("/user/nart/search")}>
          Recherche par Nart
        </button>
      </div>
    </div>
  );
};

export default Home;
