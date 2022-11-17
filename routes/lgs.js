var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

const fs = require('fs')

// Logs and filespecs 
const selObj = {
  Messages: '/var/log/messages',
  Secure: '/var/log/secure',
  SysLog: '/var/log/syslog',
  Aux: '/var/log/bems/bems_aux.log',
  Env: '/var/log/bems/bems_env.log',
  GUI: '/var/log/bems/bems_gui.log',
  Main: '/var/log/bems/bems_main.log',
  Webmanager0: '/var/log/bems/crbv-bms-0.log',
  Webmanager1: '/var/log/bems/crbv-bms-1.log',
  Webmanager2: '/var/log/bems/crbv-bms-2.log',
  Webmanager3: '/var/log/bems/crbv-bms-3.log',
  Webmanager4: '/var/log/bems/crbv-bms-4.log',
  Webmanager5: '/var/log/bems/crbv-bms-5.log',
  Webmanager6: '/var/log/bems/crbv-bms-6.log',
  Webmanager7: '/var/log/bems/crbv-bms-7.log',
  Webmanager8: '/var/log/bems/crbv-bms-8.log'
}

// Only display logs that exist
let selLbl = []
for ( lbl in selObj ) {
  if ( fs.existsSync(selObj[lbl]) ) selLbl.push(lbl)
}

// -----------------------------------------------------------
//  GET Logs Data Paint Page
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
    res.render('lgs',{selLbl:selLbl})
})

// -----------------------------------------------------------
//  XHR GET Logs Data 
// -----------------------------------------------------------
const execSync = require('child_process').execSync;
const exec     = require('child_process').exec;

router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['classList'] = {}

  // ---- commands -------------------
  if ( req.query.lg ) {

    try {
      let cmd = `tail -${req.query.lns} ${selObj[req.query.lg]}`
      let stdout = execSync(cmd,{timeout:2000,encoding:'utf8'})
      let logLst = stdout.split("\n").reverse()
      rtnObj['innerHTML']['logBr'] = logLst.join("<br>")
    }
    catch(error) {
        console.log("Error in xhr lgs ",error);
    }
  }

  const sql = 'select time from volts order by time desc limit 1'
  const rows = await db.querys(sql)

  rtnObj.time = rows[0].time
  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json(rtnObj) 

})

module.exports = router;
