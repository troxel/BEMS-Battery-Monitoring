const mysql = require('mysql2/promise');
const config = require('../config');

async function querys(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.query(sql, params);

  return results;
}

module.exports = {
  querys
}