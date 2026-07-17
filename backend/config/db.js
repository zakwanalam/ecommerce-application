import * as mysql from "mysql";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "./dotenv.js";

export const db = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD || "rootpassword",
  database: DB_NAME,
  port: DB_PORT || 3306,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("error connecting to mysql pool: " + err.stack);
    return;
  }
  console.log("my sql connected (pool)");
  connection.release();
});
