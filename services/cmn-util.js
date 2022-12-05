const _ = require('lodash');

// Overriding the toJSON prototype as it converts the Date object to 
// zulu time which plotly doesn't know how to deal with properly.
// This prototype converts the Date Object to ISO with timezone offset
// which new Date knows how to handle correctly. 
// https://stackoverflow.com/questions/31096130/how-to-json-stringify-a-javascript-date-and-preserve-timezone
Date.prototype.toJSON = function () {
  var timezoneOffsetInHours = -(this.getTimezoneOffset() / 60); //UTC minus local time
  var sign = timezoneOffsetInHours >= 0 ? '+' : '-';
  var leadingZero = (Math.abs(timezoneOffsetInHours) < 10) ? '0' : '';

  //It's a bit unfortunate that we need to construct a new Date instance 
  //(we don't want _this_ Date instance to be modified)
  var correctedDate = new Date(this.getFullYear(), this.getMonth(), 
      this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), 
      this.getMilliseconds());
  correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
  var iso = correctedDate.toISOString().replace('Z', '');
  
  rtn_str = iso + sign + leadingZero + Math.abs(timezoneOffsetInHours).toString() + ':00'
  console.log(rtn_str)

  return rtn_str
}

// ---------------------------------------
// Process the table data and calculate 
// statistics and style table elements
// ---------------------------------------
function tblProc(prefx,hsh,spHigh,spLow) {

  let lenRow = 10 // length of max/min rows

  let innerHTML = {}
  let style = {}

  delete hsh['time']

  keys = Object.keys(hsh)
  vals = Object.values(hsh)

  // Ave without nulls  
  let numNoNulls=0
  for (i of vals) { if (i){numNoNulls++} }

  innerHTML[prefx + 'Sum'] = _.sum(vals).toFixed(0)
  innerHTML[prefx + 'Ave'] = (innerHTML[prefx + 'Sum']/numNoNulls).toFixed(1)

  // Init hi/low variables
  let numHigh = 0
  let numLow  = 0

  for (i=0; i<keys.length; i++) {
    let val = vals[i]
    let key = keys[i]

    if ( val == null ) {
      style[key] = {backgroundColor:'#B7C0C0'}
    } 
    else if ( val >= spHigh ) {
      style[key] = {backgroundColor:'#EE3333'}
      numHigh += 1
    }
    else if ( val <= spLow ){
      style[key] = {backgroundColor:'yellow'}
      numLow += 1
    }
    else {
      style[key] = {backgroundColor:'forestgreen'}
    } 
  }

  innerHTML[prefx + 'NumHigh'] = numHigh
  innerHTML[prefx + 'NumLow']  = numLow
  
  // --- Max Min determination ----
  // Remove null
  let keysNoNull = _.remove(keys, (n) => { return(hsh[n] != null ? true : false) })

  keysNoNull.sort((a,b)=>{return hsh[a]-hsh[b]})
  
  // Pull out numbers from object keys
  const reTray = /(\d+)$/

  let endInx =  keysNoNull.length - 1
  for ( let i = 0; i<lenRow; i++ ) {
    let ident = keysNoNull[i]            // ie v1,v2, etc.
    
    if (! ident) continue; 

    let cell = reTray.exec(ident)[0]

    // tray for prop / cell for aux   
    let subcell = cell % 70

    // create tray identifier and format
    subcell = (subcell>10) ? subcell : '0' + subcell
    let tray = 'tray' + (Math.trunc(cell / 70) + 1) + '-' + subcell

    innerHTML[prefx + "MinTray" + i] = tray
    innerHTML[prefx + "MinKey" + i] = cell
    innerHTML[prefx + "MinVal" + i] = hsh[ident].toFixed(2)
    style[prefx + "MinRow" + i] = style[ident]   

    let offset = endInx - i; 
    cell = reTray.exec(keysNoNull[offset])[0]

    subcell = cell % 70
    subcell = (subcell>10) ? subcell : "0" + subcell
    tray = 'tray' + (Math.trunc(cell / 70) + 1) + '-' + subcell

    innerHTML[prefx + "MaxTray" + i] = tray
    innerHTML[prefx + "MaxKey" + i] = cell
    innerHTML[prefx + "MaxVal" + i] = hsh[keysNoNull[offset]].toFixed(2)
    style[prefx + "MaxRow" + i] = style[keysNoNull[offset]]   
  }

  return([innerHTML, style])
}

// ---------------------------------------
// bit util
// ---------------------------------------
let bit = []  
for(i=0;i<24;i++) { bit[i]=2**i }

module.exports = {
  bit, tblProc
}