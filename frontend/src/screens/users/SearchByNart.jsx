import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticleByNartQuery } from "../../slices/articleSlice";

const SearchByNart = () => {
  const [nart, setNart] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticleByNartQuery(nart, {
    skip: !nart,
  });

  useEffect(() => {
    if (data && data.GENCOD) {
      navigate(`/user/article/${data.GENCOD}`).then(() => {
        setIsSearching(false);
      });
    } else if (isSearching) {
      setIsSearching(false);
    }
  }, [data, navigate, isSearching]);

  const handleSearch = () => {
    if (nart.trim() && !isSearching && !isLoading) {
      setIsSearching(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-title">Recherche d'article par NART</h2>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Saisissez un NART"
          value={nart}
          onChange={(e) => setNart(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {/* <button
          className="search-button"
          onClick={handleSearch}
          disabled={isSearching || isLoading}
        >
          {isSearching ? "Recherche en cours..." : "Rechercher"}
        </button> */}
      </div>
    </div>
  );
};

export default SearchByNart;
