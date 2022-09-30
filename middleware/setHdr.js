var spnPos = 0
//const spnLst = ['|','/','—','\\']

const db = require('../services/mysqldb');
const config = require('../config');

module.exports = async function (req, res, next) {

  var dateNow = Date.now()
  var staleThreshold = 20

  let sql = 'select count(*) from flt_buffer;select time from error_wd order by time desc limit 1'
  rows = await db.querys(sql)

  req.hdr = {}
  req.hdr.fltNum = rows[0][0]['count(*)']
  req.hdr.time = rows[1][0]['time']
  
  next()
}

