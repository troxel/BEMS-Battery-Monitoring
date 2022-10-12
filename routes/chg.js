var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const _ = require('lodash');

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

  rtnObj['innerHTML']['volts'] = rows[0][0]
  rtnObj['innerHTML']['balance'] = rows[1][0]

  // --- Calc voltage sum for each charger-string group of 10 trays ---
  let vlts = rows[0][0]
  delete vlts.time
  let vChunked = _.chunk(Object.values(vlts),10)  // very cool utility.

  for (let i = 0; i<vChunked.length; i++) {   
    let sum = _.sum(vChunked[i])
    let str = Math.floor(i/7) + 1  
    let chg = (i%7) + 1
    let id = 'Chg'+chg+'Str'+str
    rtnObj['innerHTML'][id] = sum.toFixed(1)
  } 

  res.json(rtnObj)

})

module.exports = router;









