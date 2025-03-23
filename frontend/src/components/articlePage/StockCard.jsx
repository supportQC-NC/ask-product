import React from "react";
import "./stockCard.css"; // Import du fichier CSS

const StockCard = ({ item }) => {
  return (
    <div className="stock-card">
      <h2>{item.gissement}</h2>
      <p>{item.stock}</p>
    </div>
  );
};

export default StockCard;
