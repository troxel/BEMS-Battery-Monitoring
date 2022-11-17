var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

const _ = require('lodash');
const util = require('../services/cmn-util');
const { xor } = require('lodash');

// Data decimation stuff
const {largestTriangleThreeBucket} = require('d3fc-sample')
lttb = largestTriangleThreeBucket()

tblLst = [{lbl:'Prop Volts',id:'volts'},{lbl:'Prop Temperature',id:'temperature'},{lbl:'Prop Balance',id:'balance'},
{lbl:'Prop Impedance',id:'impedance'},{lbl:'String Current',id:'i_prop_str'},
{lbl:'Aux Volts',id:'volts_aux'},{lbl:'Aux Current',id:'i_aux'},{lbl:'Aux Temp',id:'temperature_aux'}]

rngLst = [8,24,48,72,96,120]

/* GET home page. */ 
// -----------------------------------------------------------
router.get('/', function(req, res, next) {

  var selectVolts = []
  for (j=0;j<280;j++) {
    selectVolts.push({id:'v'+j,name:'v'+j})
  }

  res.render('tnd', {tblLst:tblLst,rngLst,rngLst});
});

// -----------------------------------------------------------
// -----------------------------------------------------------
/* GET data */ 
router.get('/xhr', async function(req, res, next) {

  if (! req.query ) { next }

  console.log(req.query)
  let tbl    = req.query.tbl
  let sensors = req.query.sensor.split(',')
  let rng     = req.query.rng || 1

  // create placemark string based on the size of the sensors requested
  let pmStr = ",??".repeat(sensors.length)
  const sql = `select UNIX_TIMESTAMP(time) as ts,time${pmStr} from (??) WHERE time > NOW() - INTERVAL ? HOUR ORDER BY time desc;`
  const rows = await db.querys(sql,[...sensors,tbl,rng])

  // rows is of format
  // [ { time: 2022-11-05T05:26:07.000Z, v1: 12.2 },
  //   { time: 2022-11-05T05:25:49.000Z, v1: 12.9 }, ... ]
  
  if ( ! rows.length ) {
    console.log("Error No Data")
    res.json({error:"No Data"}) 
    return
  }

  // Need to reorder the data for plotting with plotly
  rtnData = {}
  rtnData.timeSeries = []
  rtnData.time = rows[0].time    // Most recent tiem

  // console.log(rtnData.timeSeries.length)
  // rowsLess = []
  // if ( rows.length > 70 ) {
  //   senValLst = []
  //   for ( sen of sensors ) {
  //     let data = {}
  //     lttb.x(d => d.ts).y(d => d[sen])
  //     lttb.bucketSize(10)
  //     console.log('>')
  //     console.log(lttb(rows))
  //   }  
  // }
  //console.log(rtnData.timeSeries.length)


  rtnData.sensors = {}
  for (sen of sensors) { rtnData.sensors[sen] = Array(rows.length) }

  for (i=0;i<rows.length;i++){
    rtnData.timeSeries.push(rows[i]['time'])
    for ( sen of sensors ) {
      rtnData.sensors[sen][i] = rows[i][sen]   // reorder
    }
  }

  
  res.json(rtnData) 
})
 
module.exports = router;