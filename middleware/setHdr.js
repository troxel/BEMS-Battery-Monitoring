var spnPos = 0
//const spnLst = ['|','/','—','\\']

const db = require('../services/mysqldb');
const config = require('../config');

module.exports = async function (req, res, next) {

  var dateNow = Date.now()
  var staleThreshold = 20

  const sqlObj = { 
    bems_sbs:'select time from volts order by time desc limit 1',
    bems_aux:'select time from volts_aux order by time desc limit 1'
  }

  req.tStamp = {}
  for (key in sqlObj) {
    let rows; 
   
    rows = await db.querys(sqlObj[key])
    if ( rows ) {
      var dateI = new Date(rows[0].time)

      // Calculate the difference in milliseconds
      var diffSec = (dateNow - dateI)/1000

      //if ( )
      req.tStamp[key] = diffSec
    } 
  }

  next()
}

