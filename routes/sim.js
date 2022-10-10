var express = require('express');
const { resolve } = require('path');
var router = express.Router();

const fs = require('fs');

var fspecBemsAux = '/opt/bems/bems_gui/test/bems_aux.json'
var fspecBemsEnv = '/opt/bems/bems_gui/test/bems_env.json'

// -----------------------------------------------------------
//  GET System Data Paint Page
// -----------------------------------------------------------
let renderSimPage = function(req, res, next) {

  let rtnObj = {}

  try {
    let auxChkStr = fs.readFileSync(fspecBemsAux, {encoding:'utf8', flag:'r'})
    let envChkStr = fs.readFileSync(fspecBemsEnv, {encoding:'utf8', flag:'r'})

    auxChk = JSON.parse(auxChkStr)
    envChk = JSON.parse(envChkStr)

    rtnObj.checked = {...auxChk, ...envChk}
  } catch(err) {
    console.error(err)
    rtnObj.checked = {}
  }
 
  rtnObj.errWd7 = ["Smoke_Machine", "Smoke_Battery","Fire_Machine","Fire_EE","Fire_Battery_1","Fire_Battery_2"]

  rtnObj.errWd8 = ["Temperature_Machine_1_Alarm","Temperature_Machine_1_Fault","Temperature_Machine_2_Alarm",
  "Temperature_Machine_2_Fault","Temperature_EE_Alarm","Temperature_EE_Fault"]

  rtnObj.errWd5 = ['String_High_Voltage_Aux_Alarm','String_High_Voltage_Aux_Fault','String_Low_Voltage_Aux_Alarm',
  'String_Low_Voltage_Aux_Fault','String_High_Current_Aux_Alarm','String_High_Current_Aux_Fault',
  'String_High_Temperature_Aux_Alarm','String_High_Temperature_Aux_Fault','Cell_Low_Voltage_Aux_Alarm',
  'Cell_Low_Voltage_Aux_Fault']
 
  res.render('sim',rtnObj)
}

// -----------------------------------------------------------
//  
// -----------------------------------------------------------
router.get('/', renderSimPage)

// -----------------------------------------------------------
//  
// -----------------------------------------------------------
router.post('/submit_env', function(req, res, next) {

  let jsonStr = JSON.stringify(req.body);
  fs.writeFileSync(fspecBemsEnv, jsonStr)
  renderSimPage(req,res,next)
  //res.send(req.body) 

})

// -----------------------------------------------------------
//  
// -----------------------------------------------------------
router.post('/submit_aux', function(req, res, next) {

  let jsonStr = JSON.stringify(req.body);
  fs.writeFileSync(fspecBemsAux, jsonStr)
  renderSimPage(req,res,next)
  //res.send(req.body) 

})

// -----------------------------------------------------------
//  XHR GET System Data 
// -----------------------------------------------------------
const execSync = require('child_process').execSync;

router.get('/xhr', async function(req, res, next) {

  let rtnObj = {}
  rtnObj['innerHTML'] = {}
  rtnObj['classList'] = {}

  if ( req.query.id ) {
   console.log(req.query.id,req.query.cmd)
  }

  rtnObj['setAttribute'] = {}
  rtnObj['setAttribute']['smoke_machine'] = {checked:true}
  rtnObj['setAttribute']['smoke_battery'] = {checked:true}

  try {
    fspec_bems_aux = "../test/bems_aux.json"
    //let stat = fs.statSync( )
    if (fs.existsSync(fspec_bems_aux)) {
      console.log('it exists')
    }  
    //stdout = execSync("top -n 1 -b",{timeout:2000,encoding:'utf8'})
  }
    catch(error) {
      console.log("Error in xhr sys ",error);
  }

  rtnObj['innerHTML']['spn'] = req.spn   // still used?

  res.json(rtnObj) 

})


module.exports = router;

