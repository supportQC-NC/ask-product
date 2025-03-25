import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader-spinner">
        <div className="loader-circle-1"></div>
        <div className="loader-circle-2"></div>
        <div className="loader-circle-3"></div>
      </div>
    </div>
  );
};

export default Loader;
