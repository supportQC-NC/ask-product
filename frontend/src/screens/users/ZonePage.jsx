// ZonePage.js
import React, { useState } from "react";
import { useImportZonesFromCSVMutation } from "../../slices/zoneSlice";

const ZonePage = () => {
  const [file, setFile] = useState(null);
  const [importError, setImportError] = useState(null);

  const [importZones, { isLoading, isError, isSuccess }] =
    useImportZonesFromCSVMutation();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImportClick = async () => {
    if (!file) {
      setImportError("Veuillez sélectionner un fichier CSV.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await importZones(formData);
    } catch (error) {
      setImportError(error.message);
    }
  };

  return (
    <div>
      <h1>ZonePage</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImportClick} disabled={isLoading}>
        {isLoading ? "Importation en cours..." : "Importer les zones"}
      </button>
      {isError && <div style={{ color: "red" }}>{importError}</div>}
      {isSuccess && (
        <div style={{ color: "green" }}>Zones importées avec succès !</div>
      )}
    </div>
  );
};

export default ZonePage;
