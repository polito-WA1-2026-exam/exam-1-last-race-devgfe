import db from "../database/database.js";
import UserDAO from "../models/DAO/user-dao.js";
import crypto from "crypto";

export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if(err){ 
        reject(err); 
      }else if(row === undefined) { 
        resolve(false); 
      }else{
        const user = new UserDAO(row.id, row.name, row.email, row.password, row.salt);
        
        crypto.scrypt(password, user.salt, 16, function(err, hashedPassword) {
          if(err){
            reject(err);
          }
          if(!crypto.timingSafeEqual(Buffer.from(user.password, "hex"), hashedPassword)){
            resolve(false);
          }else{
            resolve(user);
          }
        });
      }
    });
  });
};