var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

const bit = require('../services/cmn-util').bit;

var date = new Date();

var numTrays = 270

/* GET home page. */ 
router.get('/', function(req, res, next) {

  let rtnObj = {}
  res.render('env', rtnObj);

})

//--------------------------------
// --- XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['setAttribute'] = {}
  rtnObj['style'] = {}
 
  const sql = 'select * from env order by time desc limit 1;select * from error_wd order by time desc limit 1;'
  const rows = await db.querys(sql)

  //rtnObj['innerHTML'] = rows[0][0]
  rtnObj.error_wd = rows[1][0]
  rtnObj.time = rows[0][0].time
  
  //for (let k in rows[0][0]){
   // rtnObj['setAttribute'][k] = {'title':rows[0][0][k]}
  //}

  // ------------- err word 8 -------------------
  let error_wd8 = rows[1][0].error_wd8
  let wd8 = {machine_temp_1:[bit[0],bit[1]], machine_temp_2:[bit[2],bit[3]], batt_temp:[bit[7],bit[8]],ee_temp:[bit[4],bit[6]]}

  for (let key in wd8) {

    rtnObj['style'][key] = {backgroundColor:'green'}
    if ( error_wd8 & wd8[key][0] ) { 
      rtnObj['style'][key] = {backgroundColor:'yellow'}
    }
    if ( error_wd8 & wd8[key][1] ) { 
      rtnObj['style'][key] = {backgroundColor:'red'}
    }
  }

  // ------------- err word 7 -------------------
  let error_wd7 = rows[1][0].error_wd7
  let wd7 = {machine_smoke:bit[0], batt_smoke:bit[1], ee_smoke:bit[2], machine_fire:bit[3], ee_fire:bit[4],
    batt_fire_1:bit[5], batt_fire_2:bit[6], batt_h2_1:bit[9], batt_h2_2:bit[9] }

  for (let key in wd7) {
      rtnObj['style'][key] = {backgroundColor:'green'}
      if ( error_wd7 & wd7[key] ) { 
        rtnObj['style'][key] = {backgroundColor:'red'}
      }
  }
  
  res.json(rtnObj)
})

module.exports = router;









