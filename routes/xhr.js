var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

var date = new Date();

// Fault and alarm to ID relation
var flt_alm_msg = { 1:'Voltage High!',2:'Voltage Sorta High!',3:'Smoke Detected!',4:'Fire Detected!',5:'Current over threshold' }

// --------- Influx --------------
/* const Influx = require('influx');
var influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'bems',
  username: 'webdev',
  password: 'bems123'
})
 */

// -----------------------------------------------------------
/* GET str page. */ 
router.get('/str/:str', async function(req, res, next) {

  // Never should happen but... 
  let str_id = req.params.str - 1
  if ( ! ( str_id >= 0 && str_id <= 3 ) ) {
    console.error(str_id)
    res.json({error: `str_id ${str_id} is outside acceptible range`}) 
  }

  // ---- Hard code for efficiency
  let str_select = {}
  str_select['volts'] = []
  str_select['temperature'] = []
  str_select['impedance'] = []
  str_select['eq'] = []
  
  str_select['volts'][0] = "v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18,v19,v20,v21,v22,v23,v24,v25,v26,v27,v28,v29,v30,v31,v32,v33,v34,v35,v36,v37,v38,v39,v40,v41,v42,v43,v44,v45,v46,v47,v48,v49,v50,v51,v52,v53,v54,v55,v56,v57,v58,v59,v60,v61,v62,v63,v64,v65,v66,v67,v68,v69,v70"
  str_select['volts'][1] = "v71,v72,v73,v74,v75,v76,v77,v78,v79,v80,v81,v82,v83,v84,v85,v86,v87,v88,v89,v90,v91,v92,v93,v94,v95,v96,v97,v98,v99,v100,v101,v102,v103,v104,v105,v106,v107,v108,v109,v110,v111,v112,v113,v114,v115,v116,v117,v118,v119,v120,v121,v122,v123,v124,v125,v126,v127,v128,v129,v130,v131,v132,v133,v134,v135,v136,v137,v138,v139,v140"
  str_select['volts'][2] = "v141,v142,v143,v144,v145,v146,v147,v148,v149,v150,v151,v152,v153,v154,v155,v156,v157,v158,v159,v160,v161,v162,v163,v164,v165,v166,v167,v168,v169,v170,v171,v172,v173,v174,v175,v176,v177,v178,v179,v180,v181,v182,v183,v184,v185,v186,v187,v188,v189,v190,v191,v192,v193,v194,v195,v196,v197,v198,v199,v200,v201,v202,v203,v204,v205,v206,v207,v208,v209,v210"
  str_select['volts'][3] = "v211,v212,v213,v214,v215,v216,v217,v218,v219,v220,v221,v222,v223,v224,v225,v226,v227,v228,v229,v230,v231,v232,v233,v234,v235,v236,v237,v238,v239,v240,v241,v242,v243,v244,v245,v246,v247,v248,v249,v250,v251,v252,v253,v254,v255,v256,v257,v258,v259,v260,v261,v262,v263,v264,v265,v266,v267,v268,v269,v270,v271,v272,v273,v274,v275,v276,v277,v278,v279,v280"
  
  str_select['temperature'][0] = "t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16,t17,t18,t19,t20,t21,t22,t23,t24,t25,t26,t27,t28,t29,t30,t31,t32,t33,t34,t35,t36,t37,t38,t39,t40,t41,t42,t43,t44,t45,t46,t47,t48,t49,t50,t51,t52,t53,t54,t55,t56,t57,t58,t59,t60,t61,t62,t63,t64,t65,t66,t67,t68,t69,t70"
  str_select['temperature'][1] = "t71,t72,t73,t74,t75,t76,t77,t78,t79,t80,t81,t82,t83,t84,t85,t86,t87,t88,t89,t90,t91,t92,t93,t94,t95,t96,t97,t98,t99,t100,t101,t102,t103,t104,t105,t106,t107,t108,t109,t110,t111,t112,t113,t114,t115,t116,t117,t118,t119,t120,t121,t122,t123,t124,t125,t126,t127,t128,t129,t130,t131,t132,t133,t134,t135,t136,t137,t138,t139,t140"
  str_select['temperature'][2] = "t141,t142,t143,t144,t145,t146,t147,t148,t149,t150,t151,t152,t153,t154,t155,t156,t157,t158,t159,t160,t161,t162,t163,t164,t165,t166,t167,t168,t169,t170,t171,t172,t173,t174,t175,t176,t177,t178,t179,t180,t181,t182,t183,t184,t185,t186,t187,t188,t189,t190,t191,t192,t193,t194,t195,t196,t197,t198,t199,t200,t201,t202,t203,t204,t205,t206,t207,t208,t209,t210"
  str_select['temperature'][3] = "t211,t212,t213,t214,t215,t216,t217,t218,t219,t220,t221,t222,t223,t224,t225,t226,t227,t228,t229,t230,t231,t232,t233,t234,t235,t236,t237,t238,t239,t240,t241,t242,t243,t244,t245,t246,t247,t248,t249,t250,t251,t252,t253,t254,t255,t256,t257,t258,t259,t260,t261,t262,t263,t264,t265,t266,t267,t268,t269,t270,t271,t272,t273,t274,t275,t276,t277,t278,t279,t280"
  
  str_select['impedance'][0] = "r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,r13,r14,r15,r16,r17,r18,r19,r20,r21,r22,r23,r24,r25,r26,r27,r28,r29,r30,r31,r32,r33,r34,r35,r36,r37,r38,r39,r40,r41,r42,r43,r44,r45,r46,r47,r48,r49,r50,r51,r52,r53,r54,r55,r56,r57,r58,r59,r60,r61,r62,r63,r64,r65,r66,r67,r68,r69,r70"
  str_select['impedance'][1] = "r71,r72,r73,r74,r75,r76,r77,r78,r79,r80,r81,r82,r83,r84,r85,r86,r87,r88,r89,r90,r91,r92,r93,r94,r95,r96,r97,r98,r99,r100,r101,r102,r103,r104,r105,r106,r107,r108,r109,r110,r111,r112,r113,r114,r115,r116,r117,r118,r119,r120,r121,r122,r123,r124,r125,r126,r127,r128,r129,r130,r131,r132,r133,r134,r135,r136,r137,r138,r139,r140"
  str_select['impedance'][2] = "r141,r142,r143,r144,r145,r146,r147,r148,r149,r150,r151,r152,r153,r154,r155,r156,r157,r158,r159,r160,r161,r162,r163,r164,r165,r166,r167,r168,r169,r170,r171,r172,r173,r174,r175,r176,r177,r178,r179,r180,r181,r182,r183,r184,r185,r186,r187,r188,r189,r190,r191,r192,r193,r194,r195,r196,r197,r198,r199,r200,r201,r202,r203,r204,r205,r206,r207,r208,r209,r210"
  str_select['impedance'][3] = "r211,r212,r213,r214,r215,r216,r217,r218,r219,r220,r221,r222,r223,r224,r225,r226,r227,r228,r229,r230,r231,r232,r233,r234,r235,r236,r237,r238,r239,r240,r241,r242,r243,r244,r245,r246,r247,r248,r249,r250,r251,r252,r253,r254,r255,r256,r257,r258,r259,r260,r261,r262,r263,r264,r265,r266,r267,r268,r269,r270,r271,r272,r273,r274,r275,r276,r277,r278,r279,r280"
  
  str_select['eq'][0] = "e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12,e13,e14,e15,e16,e17,e18,e19,e20,e21,e22,e23,e24,e25,e26,e27,e28,e29,e30,e31,e32,e33,e34,e35,e36,e37,e38,e39,e40,e41,e42,e43,e44,e45,e46,e47,e48,e49,e50,e51,e52,e53,e54,e55,e56,e57,e58,e59,e60,e61,e62,e63,e64,e65,e66,e67,e68,e69,e70"
  str_select['eq'][1] = "e71,e72,e73,e74,e75,e76,e77,e78,e79,e80,e81,e82,e83,e84,e85,e86,e87,e88,e89,e90,e91,e92,e93,e94,e95,e96,e97,e98,e99,e100,e101,e102,e103,e104,e105,e106,e107,e108,e109,e110,e111,e112,e113,e114,e115,e116,e117,e118,e119,e120,e121,e122,e123,e124,e125,e126,e127,e128,e129,e130,e131,e132,e133,e134,e135,e136,e137,e138,e139,e140"
  str_select['eq'][2] = "e141,e142,e143,e144,e145,e146,e147,e148,e149,e150,e151,e152,e153,e154,e155,e156,e157,e158,e159,e160,e161,e162,e163,e164,e165,e166,e167,e168,e169,e170,e171,e172,e173,e174,e175,e176,e177,e178,e179,e180,e181,e182,e183,e184,e185,e186,e187,e188,e189,e190,e191,e192,e193,e194,e195,e196,e197,e198,e199,e200,e201,e202,e203,e204,e205,e206,e207,e208,e209,e210"
  str_select['eq'][3] = "e211,e212,e213,e214,e215,e216,e217,e218,e219,e220,e221,e222,e223,e224,e225,e226,e227,e228,e229,e230,e231,e232,e233,e234,e235,e236,e237,e238,e239,e240,e241,e242,e243,e244,e245,e246,e247,e248,e249,e250,e251,e252,e253,e254,e255,e256,e257,e258,e259,e260,e261,e262,e263,e264,e265,e266,e267,e268,e269,e270,e271,e272,e273,e274,e275,e276,e277,e278,e279,e280"
  // --------------------------------------------------------

  const sql = `select time,${str_select['volts'][str_id]} from volts order by time desc limit 1;select time,${str_select['temperature'][str_id]} from temperature order by time desc limit 1;select time,${str_select['impedance'][str_id]} from impedance order by time desc limit 1`;
  const rows = await db.querys(sql)

    // Prepare to return
  let innerHTML = rows[0][0]              // Volts
  innerHTML = {...innerHTML, ...rows[1][0] }  // Temperature
  innerHTML = {...innerHTML, ...rows[2][0] }  // Impedance

  //console.log('sql=',sql)
  //console.log('rows= ',rows)
  //res.json(rows) 
  

 /*  influx.query([
    `select ${str_select['volts'][str_id]} from volts order by time desc limit 1`,
    `select ${str_select['temperature'][str_id]} from temperature order by time desc limit 1`,
    `select ${str_select['impedance'][str_id]} from impedance order by time desc limit 1`]
  ).then( rows => {

    res.json(rows) 
  })
 */

  // Voltage stats
  vKeys = Object.keys(rows[0][0])
  vVals = Object.values(rows[0][0])
  vHash = rows[0][0]
  vKeys.shift()
  vVals.shift()
  
  innerHTML['vSum'] = vVals.sum().toFixed(0)
  innerHTML['vAve'] = (innerHTML['vSum']/vVals.length).toFixed(1)
      
  vKeys.sort((a,b)=>{return vHash[a]-vHash[b]})

  // Max/Min voltage
  const reTray = /(\d+)$/
  
  for (let i = 0;i<10;i++){

    let tray = reTray.exec(vKeys[i])[0]

    innerHTML["VminTray" + i] = tray
    innerHTML["VminVal" + i] = vHash[vKeys[i]]

    let offset = (vKeys.length-10) - i; 
    tray = reTray.exec(vKeys[offset])[0]

    innerHTML["VmaxTray" + i] = tray
    innerHTML["VmaxVal" + i] = vHash[vKeys[offset]]
  }

  // Temperature stats
  let tKeys = Object.keys(rows[1][0])
  let tVals = Object.values(rows[1][0])
  let tHash = rows[1][0]
  tKeys.shift()
  tVals.shift()

  innerHTML['tAve'] = (tVals.sum()/tVals.length).toFixed(1)
      
  // Descending sort
  tKeys.sort((a,b)=>{return tHash[b]-tHash[a]})

  // Max Temperature data
  for (let i = 0;i<10;i++){
    let tray = reTray.exec(tKeys[i])[0]

    innerHTML["TmaxTray" + i] = tray
    innerHTML["TmaxVal" + i] = tHash[tKeys[i]]
  }
  
  res.json({innerHTML:innerHTML}) 
})
  
// -----------------------------------------------------------
// HOME Page
// -----------------------------------------------------------
router.get('/home', async function(req, res, next) {

  // Get last insert
  let sql = `select * from volts order by time desc limit 1;select * from temperature order by time desc limit 1;select * from impedance order by time desc limit 1`;
  
  var rows
  try {
    rows = await db.querys(sql)
  } catch(err) {
    console.error("Error xhr: ",err)
  } 

  // Return object
  rtnObj = {}

  // Voltage stats
  let Vstat = {} 
  let vKeys = Object.keys(rows[0][0])
  let vVals = Object.values(rows[0][0])
  let vHash = rows[0][0]

  // Remove time
  vKeys.shift()
  vVals.shift()
  
  // Calculate string series voltage
  for (let i=0;i<4;i++){
    rtnObj['vSumStr'+i] = (vVals.splice(0,69).sum().toFixed(0))
  }
        
  // Sort tray id by voltage
  vKeys.sort((a,b)=>{return vHash[a]-vHash[b]})

  // Used to extract just the tray number ie v101 > 101
  const reTray = /(\d+)$/
  
  for (let i = 0;i<10;i++){

    let tray = reTray.exec(vKeys[i])[0]

    rtnObj["VminTray" + i] = tray
    rtnObj["VminVal" + i] = vHash[vKeys[i]]

    let offset = (vKeys.length-10) - i; 
    tray = reTray.exec(vKeys[offset])[0]

    rtnObj["VmaxTray" + i] = tray
    rtnObj["VmaxVal" + i] = vHash[vKeys[offset]]
  }

  // Temperature stats
  Tstat = {} 
  tKeys = Object.keys(rows[1][0])
  tVals = Object.values(rows[1][0])
  tHash = rows[1][0]
  tKeys.shift()
  tVals.shift()

  rtnObj['tAve'] = (tVals.sum()/tVals.length).toFixed(1)
      
  // Descending sort of trays per values
  tKeys.sort((a,b)=>{return tHash[b]-tHash[a]})

  // Max Temperature data
  let TmaxTray = {}
  let TmaxVal = {}
  
  for (let i = 0;i<10;i++){

    // extract the number from the column name
    let tray = reTray.exec(tKeys[i])[0]

    rtnObj["TmaxTray" + i] = tray
    rtnObj["TmaxVal" + i] = tHash[tKeys[i]]
  }
  
  // Faults and Alarms ....
  if ( req.query.clearFaults ){
    sql = 'delete from flt_alm_buffer'
    let result = await db.querys(sql)
    console.log(result)
  
  }
  
  // --- Alarms and Faults
  sql = `select  time,incident_id,flt_sw from flt_alm_buffer;select incident_id,incident_str from flt_alm_msg`;
  rows = await db.querys(sql)

  let flt_alm_lst = []
  for(let i = 0; i<rows[0].length; i++){
    let time = rows[0][i]['time']
    let id = rows[0][i]['incident_id']
    let sw = rows[0][i]['flt_sw']
    timefmt = (new Date(time)).toLocaleString('en-GB', { timeZone: 'America/Los_Angeles',hour12: false })
    flt_alm_lst.push({ts:timefmt, msg:flt_alm_msg[id],flt_sw:sw})
  }  
  
  sql = `select * from i_prop_str order by time desc limit 1`;
  
  let iPropRows = await db.querys(sql)

  for (const k in iPropRows[0]) rtnObj[k] = iPropRows[0][k] 

  // Prepare to return
  let rtn = {}
  rtn['innerHTML'] = rtnObj
  rtn['fltAlm'] = flt_alm_lst
 
  res.json(rtn) 
})

// -----------------------------------------------------------
//  GET System Data 
// -----------------------------------------------------------
const execSync = require('child_process').execSync;

var cmdObj = {}
cmdObj['bems_main']  = {lbl:'Bems Main',cmd:'bems_main.exe'}
cmdObj['bems_gui']   = {lbl:'Bems Gui',cmd:'/bin/node /opt/bems_gui/bems/bin/www'}
cmdObj['bems_aux']  = {lbl:'Bems Aux',cmd:'bems_aux.exe'}
cmdObj['bems_env']  = {lbl:'Bems Env',cmd:'bems_env.exe'}
cmdObj['sbs_dcm']  = {lbl:'Bems SBS',cmd:'sbs_dcm.py'}

// ------------------------------------------------
router.get('/sys', async function(req, res, next) {

  if ( req.query.id ) {
   console.log(req.query.id,req.query.cmd)
  }

  let rtnObj = {}
  for (const key in cmdObj) {
    rtnObj['innerHTML'][key + '_pid'] = '--'
    rtnObj['innerHTML'][key + '_cpu'] = '--'
    rtnObj['innerHTML'][key + '_mem'] = '--'
    rtnObj['innerHTML'][key + '_btn'] = 'START'
  }

  try {
    var stdout = execSync("journalctl --unit=bems_gui -n 50 --no-pager",{timeout:2000,encoding:'utf8'})
    let err_lst = stdout.split("\n")
    rtnObj['innerHTML']['logTail'] = err_lst.join("<br>")
    
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

                  rtnObj['classList'][key] = {add:'text-succes'}
                }
               
            } // end for
        }
    }
  }
    catch(error) {
      console.log("Error in xhr sys ",error);rt
  }

  // Prepare to return
  res.json(rtnObj) 

})



// handy dandy array sum function
Array.prototype.sum = function() {
  return this.reduce(function(a,b){return a+b;});
};

module.exports = router;
