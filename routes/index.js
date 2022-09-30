var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const util = require('../services/cmn-util')

var date = new Date();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'EMS' });

});

// -----------------------------------------------------------
// HOME Page
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

  // Voltage stats
  let Vstat = {} 

  let rtn = {}
  rtn['time'] = rows[0][0]['time']  // spinner
  htmlObj['timeFmt'] = new Date(rows[0][0]['time']).toLocaleString('en-US', {hour12: false})


  delete rows[0][0]['time']

  let vKeys = Object.keys(rows[0][0])
  let vVals = Object.values(rows[0][0])
  let vHash = rows[0][0]
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    htmlObj['vSumStr'+i] = (vVals.splice(0,69).sum().toFixed(0))
  }

  htmlObj['vminmax'] = util.maxmin(vHash,'v')
  
  // Temperature stats
  Tstat = {} 
  tKeys = Object.keys(rows[1][0])
  tVals = Object.values(rows[1][0])
  tHash = rows[1][0]
  delete tHash['time']

  htmlObj['tAve'] = (tVals.sum()/tVals.length).toFixed(1)

  htmlObj['tminmax'] = util.maxmin(vHash,'t')

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
 
  res.json(rtn) 
})

module.exports = router;









