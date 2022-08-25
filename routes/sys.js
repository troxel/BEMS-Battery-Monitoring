var express = require('express');
const { resolve } = require('path');
var router = express.Router();

var date = new Date();

/* var cmdObj = {}
cmdObj['/bin/node /opt/bems/bin/www']  = {lbl:'Bems Gui',id:'bems_gui'}
cmdObj['/opt/bems_main/bin/bems_main'] = {lbl:'Bems Main',id:'bems_main'}
cmdObj['/opt/bems_aux/bin/bems_aux']   = {lbl:'Bems Aux',id:'bems_aux'}
cmdObj['/opt/bems_aux/bin/bems_env']   = {lbl:'Bems Env',id:'bems_env'}
 */

var cmdObj = {}
cmdObj['bems_main']  = {lbl:'Bems Main',cmd:'bems_main.exe'}
cmdObj['bems_gui']   = {lbl:'Bems Gui',cmd:'/bin/node /opt/bems/bems_gui/bin/www'}
cmdObj['bems_aux']  = {lbl:'Bems Aux',cmd:'bems_aux.exe'}
cmdObj['bems_env']  = {lbl:'Bems Env',cmd:'bems_env.exe'}
cmdObj['sbs_dcm']  = {lbl:'Bems SBS',cmd:'sbs_dcm.py'}

// -----------------------------------------------------------
//  GET System Data Paint Page
// -----------------------------------------------------------
router.get('/', function(req, res, next) {

    res.render('sys',{cmdObj:cmdObj})
})

// -----------------------------------------------------------
//  XHR GET System Data 
// -----------------------------------------------------------
const execSync = require('child_process').execSync;

/* var cmdObj = {}
cmdObj['bems_main']  = {lbl:'Bems Main',cmd:'bems_main.exe'}
cmdObj['bems_gui']   = {lbl:'Bems Gui',cmd:'/bin/node /opt/bems/bin/www'}
cmdObj['bems_aux']  = {lbl:'Bems Aux',cmd:'bems_aux.exe'}
cmdObj['bems_env']  = {lbl:'Bems Env',cmd:'bems_env.exe'}
cmdObj['sbs_dcm']  = {lbl:'Bems SBS',cmd:'sbs_dcm.py'}
 */
router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['classList'] = {}

  if ( req.query.id ) {
   console.log(req.query.id,req.query.cmd)
  }

  for (const key in cmdObj) {
    rtnObj['innerHTML'][key + '_pid'] = '--'
    rtnObj['innerHTML'][key + '_cpu'] = '--'
    rtnObj['innerHTML'][key + '_mem'] = '--'
    rtnObj['innerHTML'][key + '_btn'] = 'START',
    rtnObj['classList'][key] = {add:'text-danger'}
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

