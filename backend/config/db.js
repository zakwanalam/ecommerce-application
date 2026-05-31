import * as mysql from "mysql";
import { DB_HOST, DB_USER, DB_NAME } from "./dotenv.js";

export const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("my sql connected");
});
