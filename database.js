const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const ENV = require('dotenv').config().parsed;
const db= {
      host: ENV.DB_HOST,
      user: ENV.DB_USER,
      password: ENV.DB_PASS,
      database: ENV.DB_NAME,
      connectTimeout: 60000
    };
    const HASH_ROUNDS = 7;

    

    const  authentication = async ({username, password}) => {
        const connection = await mysql.createConnection(db);
        const sql = `SELECT * FROM users WHERE username = ?` ;
        let results  = await connection.execute(sql,[username]);
        results = results[0][0];
        if(results){
          if(bcrypt.compareSync(password,results.password)){
            return results;
          }
        }
        return null;
      }

      const signup = async ({username, password}) => {
        const connection = await mysql.createConnection(db);

        password = bcrypt.hashSync(password,HASH_ROUNDS);

        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        try {
        await connection.execute(sql,[username,password]);
        }
        catch(err){
          return false;
        }
        return true;
        }

module.exports = {
    authenticate: authentication,
    signup: signup
}

