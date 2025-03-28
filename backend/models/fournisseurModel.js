import mongoose from "mongoose";

// Définition du schéma pour le fichier DBF
const fournisseurSchema = new mongoose.Schema(
  {
    NOM: { type: String, maxlength: 30 }, // Nom
    AD1: { type: String, maxlength: 30 }, // Adresse 1
    AD2: { type: String, maxlength: 30 }, // Adresse 2
    AD3: { type: String, maxlength: 30 }, // Adresse 3
    AD4: { type: String, maxlength: 30 }, // Adresse 4
    TEL: { type: String, maxlength: 14 }, // Téléphone
    TLX: { type: String, maxlength: 50 }, // Télécopieur
    FOURN: { type: Number, default: 0 }, // Fournisseur
    FAX: { type: String, maxlength: 15 }, // Fax
    OBSERV: { type: String, maxlength: 40 }, // Observations
    DELAPRO: { type: Number, default: 0 }, // Délai de livraison
    COEFSMINI: { type: Number, default: 0 }, // Coefficient stock minimum
    TEXTE: { type: String, maxlength: 1 }, // Texte
    ENT1: { type: String, maxlength: 78 }, // Entrée 1
    ENT2: { type: String, maxlength: 78 }, // Entrée 2
    ENT3: { type: String, maxlength: 78 }, // Entrée 3
    NOT1: { type: String, maxlength: 78 }, // Note 1
    NOT2: { type: String, maxlength: 78 }, // Note 2
    NOT3: { type: String, maxlength: 78 }, // Note 3
    NOT4: { type: String, maxlength: 78 }, // Note 4
    NOT5: { type: String, maxlength: 78 }, // Note 5
    NOT6: { type: String, maxlength: 78 }, // Note 6
    NOT7: { type: String, maxlength: 78 }, // Note 7
    NOT8: { type: String, maxlength: 78 }, // Note 8
    NOT9: { type: String, maxlength: 78 }, // Note 9
    NOT10: { type: String, maxlength: 78 }, // Note 10
    FRANCO: { type: Number, default: 0 }, // Franco
    AD5: { type: String, maxlength: 30 }, // Adresse 5
    LOCAL: { type: String, maxlength: 1 }, // Local
  },
  { timestamps: true } // Ajoute les champs `createdAt` et `updatedAt`
);

export default mongoose.model("Fournisseur", fournisseurSchema);
