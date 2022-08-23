const mysql = require('mysql2/promise');
const config = require('../config');

async function querys(sql, params) {
  const connection = await mysql.createConnection(config.db)
  try {
    const [results, ] = await connection.query(sql, params)
    connection.end()
    return results;
  } catch(err) {
    console.log('DB Error :', err.sql)
    console.log('DB Error :', err.sqlMessage)
    connection.end()
    return false
  }
}

module.exports = {
  querys
}