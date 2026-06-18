import { db } from "../database/database.js";
import { Game } from "../models/entities/game.js";

export const listBestGames = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT game.*, user.name AS user_name FROM game JOIN user ON game.user_id = user.id WHERE (game.user_id, game.id) IN (SELECT user_id, MAX(id) FROM game WHERE (user_id, score) IN (SELECT user_id, MAX(score) FROM game GROUP BY user_id) GROUP BY user_id) ORDER BY game.score";
    db.all(sql, [], (err, rows) => {
      if(err){
        reject(err);
      }else{
        const games = rows.map((game) => new Game(game.id, game.user_id, game.user_name, game.score));
        resolve(games);
      }
    });
  });
}

export const getBestGame = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT game.*, user.name AS user_name FROM game JOIN user ON game.user_id = user.id WHERE user_id = ? ORDER BY game.score DESC, game.id DESC";
    db.get(sql, [user_id], (err, row) => {
      if(err){
        reject(err);
      }else if (row !== undefined){
        resolve(new Game(row.id, row.user_id, row.user_name, row.score))
      }else{
        resolve(null);
      }
    });
  });
};

export const addGame = (user_id, score) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO game(user_id, score) VALUES (?,?)";
    db.run(sql, [user_id, score], function(err) {
      if(err){
        reject(err);
      }else{
        const game = new Game(this.lastID, user_id, null, score);
        resolve(game);
      }
    });
  });
}