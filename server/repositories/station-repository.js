import db from "../database/database.js";
import StationDAO from "../models/DAO/station-dao.js";

export const listStations = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM station";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const stations = rows.map((station) => new StationDAO(station.id, station.name, station.description, station.effect));
        resolve(stations);
      }
    });
  });
}