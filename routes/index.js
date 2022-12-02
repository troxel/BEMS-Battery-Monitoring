var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const util = require('../services/cmn-util')

const _ = require('lodash');
const { max } = require('lodash');

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
             select * from volts_aux order by time desc limit 1;
             select * from i_prop_str order by time desc limit 1;`;

  var rows
  try {
    rows = await db.querys(sql)
  } catch(err) {
    console.error("Error xhr: ",err)
  } 

  // Return object
  let innerHTML = {}
  let style = {}

  innerHTML = {...rows[0][0], ...rows[1][0], ...rows[2][0], ...rows[3][0], ...rows[4][0], ...rows[5][0]  }

  // Get max/min for strings
  vObj  =  rows[0][0]
  vKeys =  Object.keys(vObj)
  vKeys.shift() // time
    
  hiloObj = {}, hi = {}, lo = {}, attObj = {}
  for ( i = 0; i < 4; i++ ) {
    hi.val = -1
    lo.val = 20 
    for ( j = 70*i; j< 70*(i+1); j++ ) {
      val = vObj[ vKeys[j] ]
      if ( val == null ) { continue }

      if ( val > hi.val ) { hi.val = val; hi.key = vKeys[j] }      
      if ( val < lo.val ) { lo.val = val; lo.key = vKeys[j] }
    } 

    hiloObj['vStr' + i + 'Min'] = lo.val.toFixed(1)
    hiloObj['vStr' + i + 'Max'] = hi.val.toFixed(1) 
  
    attObj['vStr' + i + 'Min'] = {title:lo.key} 
    attObj['vStr' + i + 'Max'] = {title:hi.key}
  }
  
  innerHTML.hilo = hiloObj

  // Get max/min for aux cells
  vaObj =  rows[4][0]
  delete vaObj['time']

  hi = {}, lo = {}
  hi.val = -1, lo.val = 20 
  for ( [key, val] of Object.entries(vaObj)) {

    if ( val == null ) { continue }

    if ( val > hi.val ) { hi.val = val; hi.key = key }      
    if ( val < lo.val ) { lo.val = val; lo.key = key }
  }

  hiloObj['vaMin'] = lo.val.toFixed(1) 
  hiloObj['vaMax'] = hi.val.toFixed(1) 

  attObj['vaMin'] = {title:lo.key} 
  attObj['vaMax'] = {title:hi.key}

  let rtnObj = {}
  rtnObj['time'] = rows[0][0]['time']  // spinner
 
  delete rows[0][0]['time']

  vVals = Object.values(rows[0][0])
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    innerHTML['vSumStr'+i] = _.sum(vVals.splice(0,70)).toFixed(0)
  }

  // Calculate aux voltage
  delete rows[4][0].time
  innerHTML['vaSum'] = _.sum(Object.values(rows[4][0])).toFixed(0)

  // Format ---------------------------------
  innerHTML.i_aux = innerHTML.i_aux.toFixed(1)
  innerHTML.i_str0 = innerHTML.i_str0.toFixed(1)
  innerHTML.i_str1 = innerHTML.i_str1.toFixed(1)
  innerHTML.i_str2 = innerHTML.i_str2.toFixed(1)
  innerHTML.i_str3 = innerHTML.i_str3.toFixed(1)
  
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

  // Faults and Alarms ....
  if ( req.query.clearFaults ){
    sql = 'delete from flt_buffer'
    let result = await db.querys(sql)
    console.log(result)
  }
  
  // --- Alarms and Faults
  sql = `select * from flt_buffer`;
  fltAlm = await db.querys(sql)
  
  // Prepare to return
  rtnObj['innerHTML'] = innerHTML
  rtnObj['fltAlm'] = fltAlm
  rtnObj['style'] = style
  rtnObj['setAttribute'] = attObj
 
  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json(rtnObj) 
})

module.exports = router;
