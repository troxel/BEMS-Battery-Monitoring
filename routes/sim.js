var express = require('express');
const { resolve } = require('path');
var router = express.Router();

const fs = require('fs');

// -----------------------------------------------------------
//  GET System Data Paint Page
// -----------------------------------------------------------
router.get('/', function(req, res, next) {

  let envTbl = {Smoke_Machine:true,Smoke_Battery:null,Smoke_EE:null,
                Fire_Machine:null,Fire_EE:true,Fire_Battery_1:true,Fire_Battery_2:true }

    res.render('sim',{envTbl:envTbl})
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

