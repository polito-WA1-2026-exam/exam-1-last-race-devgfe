import { db } from "../database/database.js";
import { Station } from "../models/entities/station.js";

export const listStations = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM station";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const stations = rows.map((station) => new Station(station.id, station.name, station.latitude, station.longitude));
        resolve(stations);
      }
    });
  });
}