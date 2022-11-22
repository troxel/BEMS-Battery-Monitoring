var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const util = require('../services/cmn-util')

var date = new Date();

/* GET home page. */ 
router.get('/', function(req, res, next) {

  let strHsh = {}
  res.render('aux', strHsh);

});

//--------------------------------
// --- AUX XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  // volt,temperature_aux,i_aux
  const sql = 'select * from volts_aux order by time desc limit 1;select * from temperature_aux order by time desc limit 1;select * from i_aux order by time desc limit 1;'
  const rows = await db.querys(sql)

  let spHighVoltAux = req.cookies.spHighVoltAux
  let spLowVoltAux  = req.cookies.spLowVoltAux
  let spHighTempAux  = req.cookies.spHighTempAux
  let spLowTempAux  = req.cookies.spLowTempAux

  let innerHTML = {...rows[0][0], ...rows[1][0], ...rows[2][0] }
  for ( [k,v] of Object.entries(innerHTML)){ if (v==null){innerHTML[k]='&nbsp;'} }

  let rtnObj = {}
  rtnObj.innerHTML = innerHTML
  rtnObj.time = new Date(rows[0][0]['time']).toLocaleString('en-US', {hour12: false})
  rtnObj.style = {}

  var [a,b] = util.tblProc('va',rows[0][0],spHighVoltAux,spLowVoltAux)
  rtnObj['innerHTML']['voltColor'] = a
  rtnObj['style']['voltColor'] = b

  var [a,b] = util.tblProc('',rows[1][0],spHighTempAux,spLowTempAux)
  rtnObj['innerHTML']['tempColor'] = a
  rtnObj['style']['tempColor'] = b
  
  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json( rtnObj )
})

module.exports = router;









