import sqlite from "sqlite3";
import { DB_FILE_PATH } from "../config/config.js";

export const db = new sqlite.Database(DB_FILE_PATH, (err) => {
    if (err) {
        console.error("Error opening the database: ", err.message);
    } else {
        console.log("Database connected successfully");
    }
});