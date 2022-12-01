var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

const _ = require('lodash');
const util = require('../services/cmn-util');
const { xor } = require('lodash');

const dr = require('datareduce')

// Data decimation stuff
const {largestTriangleThreeBucket} = require('d3fc-sample')
lttb = largestTriangleThreeBucket()

tblObj = {volts:'Prop Volts',temperature:'Prop Temperature', balance:'Prop Balance',
impedance:'Prop Impedance', i_prop_str:'String Current', volts_aux:'Aux Volts', i_aux:'Aux Current',
temperature_aux:'Aux Temp',env:'Environmental'}

rngLst = [2,4,8,24,48,72,96,120]

/* GET home page. */ 
// -----------------------------------------------------------
router.get('/', function(req, res, next) {

  var selectVolts = []
  for (j=0;j<280;j++) {
    selectVolts.push({id:'v'+j,name:'v'+j})
  }

  res.render('tnd', {tblObj:tblObj,rngLst,rngLst});
});

// -----------------------------------------------------------
// -----------------------------------------------------------
/* GET str page. */ 
router.get('/xhr', async function(req, res, next) {

  if (! req.query ) { next }

  //console.log(req.query)
  let tbl    = req.query.tbl
  let sensors = req.query.sensor.split(',')
  let rng     = req.query.rng || 1

  rtnData = {}
  rtnData.innerHTML = {}

  if ( ! tblObj[tbl] ) { 
    rtnData.error = "No Table"
    return res.json(rtnData)  
  }

  // create placemark string based on the size of the sensors requested
  let pmStr = ",??".repeat(sensors.length)
  const sql = `select UNIX_TIMESTAMP(time) as ts,time${pmStr} from (??) WHERE time > NOW() - INTERVAL ? HOUR ORDER BY time desc;`
  const rows = await db.querys(sql,[...sensors,tbl,rng])

  // rows is of format
  // [ { time: 2022-11-05T05:26:07.000Z, v1: 12.2 },
  //   { time: 2022-11-05T05:25:49.000Z, v1: 12.9 }, ... ]
  
  if ( ! rows.length ) {
    console.log("Error No Data")
    console.log(tbl,sensors,rng)
    return res.json(rtnData)  
  }

  // Need to reorder the data for plotting with plotly
  rtnData.timeSeries = []
  rtnData.time = rows[0].time    // Most recent time
  rtnData.sensors = {}
  for (sen of sensors) { rtnData.sensors[sen] = Array(rows.length) }

  for (i=0;i<rows.length;i++){
    rtnData.timeSeries.push(rows[i]['time'])
    for ( sen of sensors ) {
      rtnData.sensors[sen][i] = rows[i][sen]   // reorder
    }
  }

  if ( rows.length > 1100 ){
    senDr = {}
    for ( sen of sensors ) {
      // Index 0 = time, 1 = value
      senDr[sen] = dr.lt3b(rtnData.timeSeries,rtnData.sensors[sen],900)
    }
    rtnData['dr'] = senDr
    delete rtnData.sensors
    delete rtnData.timeSeries
  }  

  res.json(rtnData) 
})
 
module.exports = router;