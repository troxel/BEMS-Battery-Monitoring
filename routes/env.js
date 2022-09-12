var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

var date = new Date();

var numTrays = 270

/* GET home page. */ 
router.get('/', function(req, res, next) {

  let rtnObj = {}
  res.render('env', rtnObj);

})

//--------------------------------
// --- XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
 
  const sql = 'select * from env order by time desc limit 1;'
  const rows = await db.querys(sql)

  rtnObj['innerHTML'] = rows[0]
  res.json(rtnObj)
})

module.exports = router;









