// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SearchByGencode = () => {
//   const [gencode, setGencode] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     if (gencode.trim() && !isSearching) {
//       setIsSearching(true);
//       // Redirection vers la page "Article" en passant le GENCODE
//       navigate(`/user/article/${gencode}`).then(() => {
//         setIsSearching(false);
//       });
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="home-container">
//       <h2 className="home-title">Recherche d'article par GENCODE</h2>

//       <div className="search-box">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Scannez ou saisissez un GENCODE"
//           value={gencode}
//           onChange={(e) => setGencode(e.target.value)}
//           onKeyDown={handleKeyDown}
//           autoFocus
//         />
//         <button
//           className="search-button"
//           onClick={handleSearch}
//           disabled={isSearching}
//         >
//           {isSearching ? "Recherche en cours..." : "Rechercher"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SearchByGencode;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticleByGencodeQuery } from "../../slices/articleSlice"; // Assurez-vous que cette fonction existe et est correctement configurée

const SearchByGencode = () => {
  const [gencode, setGencode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticleByGencodeQuery(gencode, {
    skip: !gencode,
  });

  useEffect(() => {
    if (data && data.GENCOD && !isSearching) {
      setIsSearching(true);
      navigate(`/user/article/${data.GENCOD}`).then(() => {
        setIsSearching(false);
      });
    } else if (isSearching) {
      setIsSearching(false);
    }
  }, [data, navigate, isSearching, gencode]);

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
        />
      </div>
    </div>
  );
};

export default SearchByGencode;
