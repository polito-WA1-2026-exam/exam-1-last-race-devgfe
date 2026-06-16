import db from "../database/database.js";
import LineDAO from "../models/DAO/line-dao.js";

export const listLines = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM line";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const lines = rows.map((line) => new LineDAO(line.id, line.name, line.color));
        resolve(lines);
      }
    });
  });
}