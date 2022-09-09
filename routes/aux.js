var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

var date = new Date();

/* GET home page. */ 
router.get('/', function(req, res, next) {

  let strHsh = {}
  res.render('aux', strHsh);

});

//--------------------------------
// --- XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
 
  const sql = 'select * from volts_aux order by time desc limit 1;select * from temperature_aux order by time desc limit 1;'
  const rows = await db.querys(sql)

  rtnObj['innerHTML']['volts'] = rows[0][0]
  rtnObj['innerHTML']['temperature'] = rows[1][0]

  res.json(rtnObj)

})

module.exports = router;









