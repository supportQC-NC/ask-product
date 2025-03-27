import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticleByNartQuery } from "../../slices/articleSlice";
import { FaSyncAlt } from "react-icons/fa"; // Importez l'icône de rechargement
import "./searchByGencode.css"; // Importez le fichier CSS

const SearchByNart = () => {
  const [nart, setNart] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticleByNartQuery(nart, {
    skip: nart.length !== 6,
  });

  useEffect(() => {
    if (nart.length === 6) {
      setIsSearching(true);
      setSearchStatus("Recherche en cours...");
    }
  }, [nart]);

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
    setNart("");
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

  const inputRef = useRef(null);

  const handleFocus = (event) => {
    event.target.blur(); // Empêche l'ouverture du clavier virtuel
    setTimeout(() => {
      inputRef.current.focus(); // Remet le focus sur le champ de saisie caché
    }, 100);
  };

  const handleHiddenInputChange = (event) => {
    setNart(event.target.value);
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
          onChange={() => {}} // Empêche la modification directe
          autoFocus
          maxLength={6}
          onFocus={handleFocus}
          readOnly // Empêche l'ouverture du clavier virtuel
        />
        <input
          type="text"
          ref={inputRef}
          className="search-input-hidden"
          style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
          value={nart}
          onChange={handleHiddenInputChange}
          maxLength={6}
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

export default SearchByNart;
