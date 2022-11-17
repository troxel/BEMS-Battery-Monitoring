var express = require('express');
const { resolve } = require('path');

var router = express.Router();
const request = require('request');

var cmdObj = {}
cmdObj['bems_main']  = {lbl:'Bems Main',cmd:'bems_main',regexp:RegExp(/\/bems_main/)}
cmdObj['bems_gui']   = {lbl:'Bems Gui',cmd:'bems_gui',regexp:RegExp(/\/bems_gui/)}
cmdObj['bems_aux']  = {lbl:'Bems Aux',cmd:'bems_aux',regexp:RegExp(/\/bems_aux/)}
cmdObj['bems_env']  = {lbl:'Bems Env',cmd:'bems_env',regexp:RegExp(/\/bems_env/)}
cmdObj['bems_wmn']  = {lbl:'Bems Wmn',cmd:'bems_wmn',regexp:RegExp(/\/bems_wmn/)}
cmdObj['bems_flt']  = {lbl:'Bems Flt',cmd:'bems_flt',regexp:RegExp(/\/bems_flt/)}

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
const exec     = require('child_process').exec;
const ping = require('ping');

router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['classList'] = {}

  // ---- commands -------------------
  if ( req.query.id ) {
    // console.log('id -> ',req.query.id,"cmd ->",req.query.cmd)

    // --------- Halt Commands ------------
    if ( req.query.id === 'halt_env' ) {

      request('http://' + dcm.envHost + '/halt', function (error, response, body) {
        if (error) { console.error(`Error halting ${dcm.envHost} `, error) }
        else { 
          console.log(`Halt ${dcm.envHost} statusCode: `, response && response.statusCode); // Print the response status code if a response was received
        }
      })
    }
    else if ( req.query.id === 'halt_aux' ) {

      request('http://' + dcm.auxHost + '/halt', function (error, response, body) {
        if (error) { console.error(`Error halting ${dcm.auxHost} `, error) }
        else { 
          console.log(`Halt ${dcm.auxHost} statusCode: `, response && response.statusCode); // Print the response status code if a response was received
        }
      })
    }
    else if ( req.query.id === 'halt_supcomp' ) {
      exec("systemctl halt")  // party is over
    } 
    // --------- Start/Restart Commands ------------
    else if ( (req.query.cmd === 'RESTART') || req.query.cmd === 'START' ) {
      let key = /(bems_\w+)_btn/.exec(req.query.id)[1]
      if ( cmdObj[key] ) {
        let cmd = req.query.cmd.toLowerCase()
        exec(`systemctl ${cmd} ${key}`,{timeout:2000,encoding:'utf8'})  // <- Right here is where it happens
        console.log(`systemctl ${cmd} ${key}`)
      }
      else{
        console.log(`${key} not in Command Object`)
      }
    }
    // --------- Cal Commands ------------
    else if ( req.query.id == 'cmd_cal_exe_env' ) {
      console.log("/cmd_cal_exe",'env')   
    }
    else if ( req.query.id == 'cmd_cal_exe_aux' ) {
      console.log("/cmd_cal_exe",'aux')   
    }    
    else if ( req.query.id == 'cmd_cal_rec_env' ) {
      console.log("/cmd_cal_rec",'env')   
    }
    else if ( req.query.id == 'cmd_cal_rec_aux' ) {
      console.log("/cmd_cal_rec",'aux')   
    }
  } // end query 

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
   
    // -b batch mode necessary
    stdout = execSync("top -n 1 -b",{timeout:2000,encoding:'utf8'})
    let topLst = stdout.split("\n").slice(0,4)
    rtnObj['innerHTML']['topBr'] = topLst.join("<br>")

    stdout = execSync("df -h",{timeout:2000,encoding:'utf8'})
    let dfLst = stdout.split("\n")
    rtnObj['innerHTML']['dfBr'] = dfLst.join("<br>")
    
    // no node process list module :(
    // %p - pid, %C cpu%, %z memory commitment, %a cmd with args, return is csv
    stdout = execSync("ps ahx -o '%p,%C,%z,%a'",{timeout:2000,encoding:'utf8'})
    let procLst = []
    procLst = stdout.split(/\n+/)

    for(let i=0;i<procLst.length;i++) {

      if ( ! procLst[i] ) continue; 

      let colLst = procLst[i].split(',')

      for (key in cmdObj) {

          if ( rtnObj['innerHTML'].hasOwnProperty(key + '_fnd') ) {
          rtnObj['innerHTML'][key + '_fnd'] =+ 1  // multiple processes bad :(  need to set alert
          continue; 
        }  

        let hit = colLst[3].match(cmdObj[key]['regexp'])

        if ( hit ) {
          rtnObj['innerHTML'][key + '_pid'] = colLst[0]
          rtnObj['innerHTML'][key + '_cpu'] = colLst[1]
          rtnObj['innerHTML'][key + '_mem'] = (colLst[2]/1000).toFixed(0) + 'kb' // in kb
          rtnObj['innerHTML'][key + '_btn'] = 'RESTART'
          rtnObj['innerHTML'][key + '_fnd'] = 1 // used to continue above as we found our process
          rtnObj['classList'][key] = {add:'text-success'}
        }
      }
    }
  }
    catch(error) {
      console.log("Error in xhr sys ",error);
  }

  rtnObj.innerHTML.fltBang = req.hdr.fltNum ? '!' : ''
  rtnObj.time = new Date()

  res.json(rtnObj) 

})


module.exports = router;

