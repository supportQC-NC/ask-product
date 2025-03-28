import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt

const ZoneSchema = new mongoose.Schema(
  {
    zone: {
      type: String,
      required: [true, "Veuillez entrer le nom d'une zone"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    libelle: {
      type: String,
      required: [true, "Veuillez entrer le nom d'une zone"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    lieux: {
      type: String,
      enum: ["Ajout", "BUREAU", "DOCK", "MAGASIN", "ANNEXE", "MECALAC", "SCEB"],
      default: "Dock",
      required: [true, "Veuillez fournir un lieu"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Zone", ZoneSchema);
