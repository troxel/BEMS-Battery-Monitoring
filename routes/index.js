var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');
const util = require('../services/cmn-util')

var date = new Date();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express!' });

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

console.log(rows)

  // Return object
  rtnObj = {}

  // Voltage stats
  let Vstat = {} 

  delete rows[0][0]['time']

  let vKeys = Object.keys(rows[0][0])
  let vVals = Object.values(rows[0][0])
  let vHash = rows[0][0]
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    rtnObj['vSumStr'+i] = (vVals.splice(0,69).sum().toFixed(0))
  }

  rtnObj['vminmax'] = util.maxmin(vHash,'v')
  
  // Temperature stats
  Tstat = {} 
  tKeys = Object.keys(rows[1][0])
  tVals = Object.values(rows[1][0])
  tHash = rows[1][0]
  delete tHash['time']

  rtnObj['tAve'] = (tVals.sum()/tVals.length).toFixed(1)

  rtnObj['tminmax'] = util.maxmin(vHash,'t')

  // Faults and Alarms ....
  if ( req.query.clearFaults ){
    sql = 'delete from flt_alm_buffer'
    let result = await db.querys(sql)
    console.log(result)
  
  }
  
  // --- Alarms and Faults
  sql = `select  time,incident_id,flt_sw from flt_alm_buffer;select incident_id,incident_str from flt_alm_msg`;
  rows = await db.querys(sql)

  let flt_alm_lst = []
  for(let i = 0; i<rows[0].length; i++){
    let time = rows[0][i]['time']
    let id = rows[0][i]['incident_id']
    let sw = rows[0][i]['flt_sw']
    timefmt = (new Date(time)).toLocaleString('en-GB', { timeZone: 'America/Los_Angeles',hour12: false })
    flt_alm_lst.push({ts:timefmt, msg:flt_alm_msg[id],flt_sw:sw})
  }  
  
  sql = `select * from i_prop_str order by time desc limit 1`;
  
  let iPropRows = await db.querys(sql)

  for (const k in iPropRows[0]) rtnObj[k] = iPropRows[0][k] 

  // Prepare to return
  let rtn = {}
  rtn['innerHTML'] = rtnObj
  rtn['fltAlm'] = flt_alm_lst
 
  res.json(rtn) 
})

module.exports = router;









