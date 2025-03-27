import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticleByGencodeQuery } from "../../slices/articleSlice"; // Assurez-vous que cette fonction existe et est correctement configurée
import { FaSyncAlt } from "react-icons/fa"; // Importez l'icône de rechargement
import "./searchByGencode.css"; // Importez le fichier CSS

const SearchByGencode = () => {
  const [gencode, setGencode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticleByGencodeQuery(gencode, {
    skip: gencode.length !== 13,
  });

  useEffect(() => {
    if (gencode.length === 13) {
      setIsSearching(true);
      setSearchStatus("Recherche en cours...");
    }
  }, [gencode]);

  useEffect(() => {
    if (data && data.GENCOD && isSearching) {
      navigate(`/user/article/${data.GENCOD}`).then(() => {
        setIsSearching(false);
        setSearchStatus("");
      });
    } else if (error && isSearching) {
      setIsSearching(false);
      setSearchStatus("AUCUN ARTICLE TROUVÉ");
    }
  }, [data, error, navigate, isSearching]);

  const handleReload = () => {
    setGencode("");
    setSearchStatus("");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && searchStatus === "AUCUN ARTICLE TROUVÉ") {
        handleReload();
      } else if (event.key === "Enter") {
        navigate("/user/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchStatus, navigate]);

  const handleFocus = (event) => {
    event.target.readOnly = true;
    setTimeout(() => {
      event.target.readOnly = false;
    }, 100);
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
          autoFocus
          maxLength={13}
          onFocus={handleFocus}
        />
      </div>

      {isSearching && <p>{searchStatus}</p>}
      {!isSearching && searchStatus && (
        <div className="search-status-container">
          <p className="search-status">{searchStatus}</p>
          {searchStatus === "AUCUN ARTICLE TROUVÉ" && (
            <button className="reload-button" onClick={handleReload}>
              <FaSyncAlt className="reload-icon" />
              Recharger (esc)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchByGencode;
