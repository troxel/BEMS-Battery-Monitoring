var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const _ = require('lodash');

const util = require('../services/cmn-util')

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

  let spHighVolt = req.cookies.spHighVolt
  let spLowVolt  = req.cookies.spLowVolt
  let spHighBalance  = req.cookies.spHighBalance

  const sql = 'select * from volts order by time desc limit 1;select * from balance order by time desc limit 1;'
  const rows = await db.querys(sql)

  let innerHTML = {...rows[0][0], ...rows[1][0] }
  
  // Need to convert nulls to empty string and fix float
  for ( [k,v] of Object.entries(innerHTML)){ 
    if (v==null){innerHTML[k]='&nbsp;'}
    else { innerHTML[k]  = parseFloat(innerHTML[k]).toFixed(2) } 
  }

  let rtnObj = {}
  rtnObj.innerHTML = innerHTML
  rtnObj.style = {}
  rtnObj.time = rows[0][0].time
 
  var [a,b] = util.tblProc('v',rows[0][0],spHighVolt,spLowVolt)
  rtnObj['style']['voltColor'] = b

  var [a,b] = util.tblProc('b',rows[1][0],spHighBalance,0)
  rtnObj['style']['BalanceColor'] = b

  // --- Calc voltage sum for each charger-string group of 10 trays ---
  let vlts = rows[0][0]
  delete vlts.time
  let vChunked = _.chunk(Object.values(vlts),10)  // very cool utility.

  for (let i = 0; i<vChunked.length; i++) {   
    let sum = _.sum(vChunked[i])
    let str = Math.floor(i/7) + 1  
    let chg = (i%7) + 1
    let id = 'Chg'+chg+'Str'+str
    rtnObj.innerHTML[id] = sum.toFixed(1)
  } 

  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json(rtnObj)

})

module.exports = router;









