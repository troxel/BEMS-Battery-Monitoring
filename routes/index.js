var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const util = require('../services/cmn-util')

const _ = require('lodash');

var date = new Date();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'BEMS' });

});

// -----------------------------------------------------------
// HOME (index() XHR data
// -----------------------------------------------------------
router.get('/xhr', async function(req, res, next) {

  // Get last insert
  let sql = `select * from volts order by time desc limit 1;select * from temperature order by time desc limit 1;select * from impedance order by time desc limit 1`;
  
  var rows
  try {
    rows = await db.querys(sql)
  } catch(err) {
    console.error("Error xhr: ",err)
  } 

  // Return object
  let htmlObj = {}
  let style = {}

  let rtn = {}
  rtn['time'] = rows[0][0]['time']  // spinner
 
  delete rows[0][0]['time']

  let vKeys = Object.keys(rows[0][0])
  let vVals = Object.values(rows[0][0])
  let vHash = rows[0][0]
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    htmlObj['vSumStr'+i] = _.sum(vVals.splice(0,69)).toFixed(0)
  }

  // Populate and color max/min tables
  let spHighVolt = req.cookies.spHighVolt
  let spLowVolt  = req.cookies.spLowVolt
  let spHighTemp  = req.cookies.spHighTemp

  var [a,b] = util.tblProc('v',rows[0][0],spHighVolt,spLowVolt)
  htmlObj['voltinner'] = a
  style['voltColor'] = b

  //var [a,b] = util.tblProc('b',rows[1][0],spHighBalance,0)
  //rtnObj['style']['BalanceColor'] = b

  // Temperature stats
  var [a,b] = util.tblProc('t',rows[1][0],spHighTemp,0)
  htmlObj['tempinner'] = a
  style['tempColor'] = b

  // tKeys = Object.keys(rows[1][0])
  // tVals = Object.values(rows[1][0])
  // tHash = rows[1][0]
  // delete tHash['time']

  // // Note tAve is not used in the template... 
  // htmlObj['tAve'] = (_.sum(tVals)/tVals.length).toFixed(1)

  // htmlObj['tminmax'] = util.maxmin(vHash,'t')

  // Faults and Alarms ....
  if ( req.query.clearFaults ){
    sql = 'delete from flt_buffer'
    let result = await db.querys(sql)
    console.log(result)
  }
  
  // --- Alarms and Faults
  sql = `select * from flt_buffer`;
  fltAlm = await db.querys(sql)
  
  // -----------------------------------
  sql = `select * from i_prop_str order by time desc limit 1`;
  
  let iPropRows = await db.querys(sql)

  for (const k in iPropRows[0]) htmlObj[k] = iPropRows[0][k] 

  // Prepare to return
  rtn['innerHTML'] = htmlObj
  rtn['fltAlm'] = fltAlm
  rtn['style'] = style
 
  res.json(rtn) 
})

// handy dandy array sum function
// Using lodash now.
//Array.prototype.sum = function() {
//   return this.reduce(function(a,b){return a+b;});
//};


module.exports = router;









