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
  res.render('wds', strHsh);
});

//--------------------------------
// --- XHR Data Handler
//--------------------------------
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['style'] = {}
 
  const sql = 'select * from error_wd order by time desc limit 1;'
  const rows = await db.querys(sql)

  let errwdObj = rows[0]
  rtnObj.time = errwdObj.time

  rtnObj['innerHTML']['error_wd_bit'] = {}
  let keyLst = (Object.keys(errwdObj)) 
  for (i=1;i<keyLst.length;i++) {
    rtnObj['innerHTML']['error_wd_bit'][keyLst[i]] = bitString(errwdObj[keyLst[i]])
  }
  rtnObj['innerHTML']['error_wd_bit'].time_error_wd = errwdObj.time

  for (i=1; i<=8; i++) {
    rtnObj['innerHTML']['sbs_error_wd' + i]  = bitString(0)
    rtnObj['innerHTML']['sbs_alarm_wd' + i]  = bitString(0)
    rtnObj['innerHTML']['sbs_status_wd' + i] = bitString(1)
  }

  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json(rtnObj)

})

function bitString(uint16) {
  
  let binStr = uint16.toString(2)
  let rep = 16 - binStr.length
  let bitWord = '0'.repeat(rep) + binStr
 
  bitWord=bitWord.replace(/\B(?=(.{8})+(?!.))/g, " ") 
  return bitWord;
}

module.exports = router;









