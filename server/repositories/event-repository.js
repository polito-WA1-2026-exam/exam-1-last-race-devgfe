import db from "../database/database.js";
import EventDAO from "../models/DAO/event-dao.js";

export const listEvents = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM event";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const events = rows.map((event) => new EventDAO(event.id, event.name, event.description, event.effect));
        resolve(events);
      }
    });
  });
}