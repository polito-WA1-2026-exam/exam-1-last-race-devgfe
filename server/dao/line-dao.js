import { db } from "../database/database.js";
import { Line } from "../models/entities/line.js";

export const listLines = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM line ORDER BY id";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const lines = rows.map((line) => new Line(line.id, line.name, line.color));
        resolve(lines);
      }
    });
  });
}