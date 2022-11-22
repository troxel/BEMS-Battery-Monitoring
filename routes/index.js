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

  // volts,temperature,impedance,i_aux,volts_aux
  let sql = `select * from volts order by time desc limit 1;
             select * from temperature order by time desc limit 1;
             select * from impedance order by time desc limit 1;
             select * from i_aux order by time desc limit 1;
             select * from volts_aux order by time desc limit 1`;
  
  var rows
  try {
    rows = await db.querys(sql)
  } catch(err) {
    console.error("Error xhr: ",err)
  } 

  // Return object
  let innerHTML = {}
  let style = {}

  innerHTML = {...rows[0][0], ...rows[1][0], ...rows[2][0], ...rows[3][0], ...rows[4][0]  }


  let rtnObj = {}
  rtnObj['time'] = rows[0][0]['time']  // spinner
 
  delete rows[0][0]['time']

  let vKeys = Object.keys(rows[0][0])
  let vVals = Object.values(rows[0][0])
  let vHash = rows[0][0]
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    innerHTML['vSumStr'+i] = _.sum(vVals.splice(0,70)).toFixed(0)
  }

  // Calculate aux voltage
  delete rows[4][0].time
  innerHTML['vaSum'] = _.sum(Object.values(rows[4][0])).toFixed(0)

  // Populate and color max/min tables
  let spHighVolt = req.cookies.spHighVolt
  let spLowVolt  = req.cookies.spLowVolt
  let spHighTemp  = req.cookies.spHighTemp

  var [a,b] = util.tblProc('v',rows[0][0],spHighVolt,spLowVolt)
  innerHTML['voltinner'] = a
  style['voltColor'] = b

  //var [a,b] = util.tblProc('b',rows[1][0],spHighBalance,0)
  //rtnObj['style']['BalanceColor'] = b

  // Temperature stats
  var [a,b] = util.tblProc('t',rows[1][0],spHighTemp,0)
  innerHTML['tempinner'] = a
  style['tempColor'] = b

//console.log(a,b)

  // tKeys = Object.keys(rows[1][0])
  // tVals = Object.values(rows[1][0])
  // tHash = rows[1][0]
  // delete tHash['time']

  // // Note tAve is not used in the template... 
  // innerHTML['tAve'] = (_.sum(tVals)/tVals.length).toFixed(1)

  // innerHTML['tminmax'] = util.maxmin(vHash,'t')

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

  for (const k in iPropRows[0]) innerHTML[k] = iPropRows[0][k] 

  // Prepare to return
  rtnObj['innerHTML'] = innerHTML
  rtnObj['fltAlm'] = fltAlm
  rtnObj['style'] = style
 
  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json(rtnObj) 
})

// handy dandy array sum function
// Using lodash now.
//Array.prototype.sum = function() {
//   return this.reduce(function(a,b){return a+b;});
//};


module.exports = router;









