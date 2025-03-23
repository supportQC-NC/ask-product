import React from "react";
import "./stockCard.css"; // Import du fichier CSS

const StockCard = ({ item }) => {
  const className =
    item.stock === 0 ? "stock-card negative" : "stock-card positive";

  return (
    <div className={className}>
      <h2>{item.gissement}</h2>
      <p>{item.stock}</p>
    </div>
  );
};

export default StockCard;
