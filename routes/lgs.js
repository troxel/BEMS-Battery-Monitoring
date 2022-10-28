var express = require('express');
var router = express.Router();

const fs = require('fs')

let selLgsLst = [{lbl:"Messages",fs:"/var/log/messages"},
{lbl:"Secure",fs:"/var/log/secure"},{lbl:"SysLog",fs:"/var/log/syslog"}]

// -----------------------------------------------------------
//  GET Logs Data Paint Page
// -----------------------------------------------------------
router.get('/', function(req, res, next) {
    res.render('lgs',{selLgsLst:selLgsLst})
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

    console.log(req.query)
    try {
      let cmd = `tail -${req.query.lns} ${req.query.lg}`
      let stdout = execSync(cmd,{timeout:2000,encoding:'utf8'})
      let logLst = stdout.split("\n").reverse()
      rtnObj['innerHTML']['logBr'] = logLst.join("<br>")
    }
      catch(error) {
        console.log("Error in xhr lgs ",error);
    }
  }

  res.json(rtnObj) 

})

module.exports = router;

