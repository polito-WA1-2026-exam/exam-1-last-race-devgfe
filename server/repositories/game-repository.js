import db from "../database/database.js";
import GameDAO from "../models/DAO/game-dao.js";

export const listBestGames = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM game WHERE (user_id, score) IN (SELECT user_id, MAX(score) AS best_score FROM game GROUP BY user_id)";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const games = rows.map((game) => new GameDAO(game.id, game.user_id, game.departure_station_id, game.arrival_station_id, game.timestamp, game.score));
        resolve(games);
      }
    });
  });
}

export const addGame = (user_id, departure_station_id, arrival_station_id, timestamp, score) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO game(user_id, departure_station_id, arrival_station_id, timestamp, score) VALUES (?,?,?,?,?)";
    db.run(sql, [user_id, departure_station_id, arrival_station_id, timestamp, score], function(err) {
      if(err){
        reject(err);
      }else{
        const game = new GameDAO(this.lastID, user_id, departure_station_id, arrival_station_id, timestamp, score);
        resolve(game);
      }
    });
  });
}