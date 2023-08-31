/** Database setup for BizTime. */
/** Code copied from the "Intro to Postgres with Node" and modified to work with current project*/

const { Client } = require("pg");

let DB_URI = "postgresql://postgres:@localhost:5432/biztime";


let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;
