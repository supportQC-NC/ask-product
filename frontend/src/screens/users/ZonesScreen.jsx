import React, { useState, useEffect } from "react";
import axios from "axios";
import "./zone.css";

const ZonesScreen = () => {
  const [zones, setZones] = useState([]);
  const [lieux, setLieux] = useState("");
  const [filteredZones, setFilteredZones] = useState([]);

  useEffect(() => {
    axios
      .get("/api/zones")
      .then((response) => {
        const cleanedZones = response.data.map((zone) => {
          return {
            ...zone,
            zone: zone.zone.replace(/[^a-zA-Z0-9\s]/g, " "),
            libelle: zone.libelle.replace(/[^a-zA-Z0-9\s]/g, " "),
            lieux: zone.lieux.replace(/[^a-zA-Z0-9\s]/g, " "),
          };
        });
        setZones(cleanedZones);
        setFilteredZones(cleanedZones);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleFilter = (e) => {
    const lieux = e.target.value;
    setLieux(lieux);
    if (lieux === "") {
      setFilteredZones(zones);
    } else {
      const filteredZones = zones.filter((zone) => zone.lieux === lieux);
      setFilteredZones(filteredZones);
    }
  };

  return (
    <div className="zones-screen container">
      <h1 className="title">Zones</h1>
      <select className="select" value={lieux} onChange={handleFilter}>
        <option value="">Tous les lieux</option>
        <option value="Ajout">Ajout</option>
        <option value="BUREAU">BUREAU</option>
        <option value="DOCK">DOCK</option>
        <option value="MAGASIN">MAGASIN</option>
        <option value="ANNEXE">ANNEXE</option>
        <option value="MECALAC">MECALAC</option>
        <option value="SCEB">SCEB</option>
      </select>
      <ul className="zones-list">
        {filteredZones.map((zone, index) => (
          <li key={index} className={`zone ${zone.lieux.toLowerCase()}`}>
            <span className="zone-name">{zone.zone}</span>
            <span className="zone-libelle">{zone.libelle}</span>
            <span className="zone-lieux">{zone.lieux}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZonesScreen;
