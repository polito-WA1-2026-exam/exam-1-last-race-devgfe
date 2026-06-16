import sqlite from "sqlite3";

export const db = new sqlite.Database('../data/database.sqlite', (err) => {
    if (err) {
        console.error("Error opening the database: ", err.message);
    } else {
        console.log("Database connected successfully");
    }
});