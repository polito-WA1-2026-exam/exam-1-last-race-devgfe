import { db } from "../database/database.js";
import { Segment } from "../models/entities/segment.js";

export const listSegments = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM segment";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const segments = rows.map((segment) => new Segment(segment.from_station_id, segment.to_station_id, segment.line_id));
        resolve(segments);
      }
    });
  });
}