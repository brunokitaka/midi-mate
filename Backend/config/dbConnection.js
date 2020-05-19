/**
 * MODULES
 */
const mysql = require('mysql'); /* MySQL module.*/


/**
 * VARS
 */
let connection = null; /* Connection instance. */

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;


/**
 * CONFIG
 */
var connMySQL = function () {
    if (conn_singleton !== null) {
      return conn_singleton;
    } else {
      conn_singleton = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
        multipleStatements: true
      });
      return conn_singleton;
    }
  };
  

module.exports = function () {
  return connMySQL;
};
/*============================================================================*/
