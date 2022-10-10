var express = require('express');
const { resolve } = require('path');
var router = express.Router();
const request = require('request');

var date = new Date();

/* var cmdObj = {}
cmdObj['/bin/node /opt/bems/bin/www']  = {lbl:'Bems Gui',id:'bems_gui'}
cmdObj['/opt/bems_main/bin/bems_main'] = {lbl:'Bems Main',id:'bems_main'}
cmdObj['/opt/bems_aux/bin/bems_aux']   = {lbl:'Bems Aux',id:'bems_aux'}
cmdObj['/opt/bems_aux/bin/bems_env']   = {lbl:'Bems Env',id:'bems_env'}
 */

var cmdObj = {}
cmdObj['bems_main']  = {lbl:'Bems_Main',cmd:'bems_main.exe'}
cmdObj['bems_gui']   = {lbl:'Bems_Gui',cmd:'/bin/node /opt/bems/bems_gui/bin/www'}
cmdObj['bems_aux']  = {lbl:'Bems_Aux',cmd:'bems_aux.exe'}
cmdObj['bems_env']  = {lbl:'Bems_Env',cmd:'bems_env.exe'}
cmdObj['sbs_dcm']  = {lbl:'Bems_SBS',cmd:'sbs_dcm.py'}

// Get DCM hosts names from env which are set in the unit file
let dcm = {}
dcm.envHost = process.env.dcmEnvHost
dcm.auxHost = process.env.dcmAuxHost

// -----------------------------------------------------------
//  GET System Data Paint Page
// -----------------------------------------------------------
router.get('/', function(req, res, next) {

    res.render('sys',{cmdObj:cmdObj,envHost:dcm.envHost,auxHost:dcm.auxHost})
})

// -----------------------------------------------------------
//  XHR GET System Data 
// -----------------------------------------------------------
const execSync = require('child_process').execSync;
const ping = require('ping');

router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['classList'] = {}

  // ---- commands -------------------
  if ( req.query.id ) {
    console.log('cmd -> ',req.query.id,req.query.cmd)

    if ( req.query.id === 'halt_env' ) {

      request('http://' + dcm.envHost + '/halt', function (error, response, body) {
        if (error) { console.error(`Error halting ${dcm.envHost} `, error) }
        else { 
          console.log(`Halt ${dcm.envHost} statusCode: `, response && response.statusCode); // Print the response status code if a response was received
        }
      })
    } 

    if ( req.query.id === 'halt_aux' ) {

      request('http://' + dcm.auxHost + '/halt', function (error, response, body) {
        if (error) { console.error(`Error halting ${dcm.auxHost} `, error) }
        else { 
          console.log(`Halt ${dcm.auxHost} statusCode: `, response && response.statusCode); // Print the response status code if a response was received
        }
      })
    } 
  }

  for (const key in cmdObj) {
    rtnObj['innerHTML'][key + '_pid'] = '--'
    rtnObj['innerHTML'][key + '_cpu'] = '--'
    rtnObj['innerHTML'][key + '_mem'] = '--'
    rtnObj['innerHTML'][key + '_btn'] = 'START',
    rtnObj['classList'][key] = {add:'text-danger'}
  }

  // --- Ping DCMs -----------
  for (const key in dcm) {
    let response = await ping.promise.probe(dcm[key])
    rtnObj['innerHTML'][key] = response.alive ? 'UP' : 'DOWN'
  }
 
  try {
    var stdout = execSync("journalctl --unit=bems_gui -n 10 -r --no-pager",{timeout:2000,encoding:'utf8'})
    let logLst = stdout.split("\n")
    rtnObj['innerHTML']['logBr'] = logLst.join("<br>")

    // -b batch mode necessary
    stdout = execSync("top -n 1 -b",{timeout:2000,encoding:'utf8'})
    let topLst = stdout.split("\n").slice(0,5)
    rtnObj['innerHTML']['topBr'] = topLst.join("<br>")

    stdout = execSync("df -h",{timeout:2000,encoding:'utf8'})
    let dfLst = stdout.split("\n")
    rtnObj['innerHTML']['dfBr'] = dfLst.join("<br>")
    
    stdout = execSync("ps aux",{timeout:2000,encoding:'utf8'})
    let lst = []
    lst = stdout.split(/\n+/)

    let lstLst = []
    for(let i=0;i<lst.length;i++) {
        lstLst[i] = []
        lstLst[i] = lst[i].split(/\s+/)

        // The last col is the command and can contain spaces
        if (lstLst[i].length > 11){
            let cmd = []
            cmd = lstLst[i].slice(10)
            let cmdStr = cmd.join(" ")
            lstLst[i][10] = cmdStr
            
            for (key in cmdObj) {

                if ( rtnObj['innerHTML'].hasOwnProperty(key + '_fnd') ) {
                  continue; 
                }  
                // might need a regexp instead
                if ( cmdObj[key]['cmd'] === cmdStr ) {
            
                  rtnObj['innerHTML'][key + '_pid'] = lstLst[i][1]
                  rtnObj['innerHTML'][key + '_cpu'] = lstLst[i][2]
                  rtnObj['innerHTML'][key + '_mem'] = lstLst[i][3]
                  rtnObj['innerHTML'][key + '_btn'] = 'RESTART'

                  rtnObj['innerHTML'][key + '_fnd'] = true // used to continue above as we found our process

                  rtnObj['classList'][key] = {add:'text-success'}
                }
               
            } // end for
        }
    }
  }
    catch(error) {
      console.log("Error in xhr sys ",error);
  }

  rtnObj['innerHTML']['spn'] = req.spn   // still used?
  rtnObj['innerHTML']['ts'] = req.ts

  res.json(rtnObj) 

})


module.exports = router;

