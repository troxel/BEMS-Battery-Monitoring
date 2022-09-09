var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

var date = new Date();

/* Render the HTML . */ 
router.get('/', function(req, res, next) {
  let strHsh = {}
  res.render('chg', strHsh);
});

//--------------------------------
// --- XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
 
  const sql = 'select * from volts order by time desc limit 1;select * from balance order by time desc limit 1;'
  const rows = await db.querys(sql)

  rtnObj['innerHTML'] = rows[0][0]
  rtnObj['innerHTML']['balance'] = rows[1][0]

  res.json(rtnObj)

})

module.exports = router;









