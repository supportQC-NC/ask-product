import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
//  ============= MODELS =============
import User from "./models/userModel.js";

//  ============= DATA =============
import users from "./_data/users.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Suppression des données existantes
    await User.deleteMany();

    // Insertion des utilisateurs
    await User.insertMany(users);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
