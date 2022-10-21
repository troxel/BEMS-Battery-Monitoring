const _ = require('lodash');

// ------------------------------------
// Takes a hash (object) such as {a1=3,a5=2,a2=4...}
// and returns a object with max and min keys/values
// rtnHsh = { prefixMaxKey0:maxval0,prefixMax2,maxval1... prefix}

function maxmin(hsh,prefix,len=10){

  delete hsh['time']
  let keys = Object.keys(hsh)

  keysNoNull = _.remove(keys, (n) => { return(hsh[n] != null ? true : false) })

  keysNoNull.sort((a,b)=>{return hsh[a]-hsh[b]})

  //console.log(keysNoNull)
  //console.log(keys)
  
  // pull out numbers from object keys
  const reTray = /(\d+)$/

  const rtnHsh = {}
  let endLst =  keysNoNull.length - 1
  for ( let i = 0; i<len; i++ ) {

    let id = reTray.exec(keysNoNull[i])[0]

    rtnHsh[prefix + "MinKey" + i] = id
    rtnHsh[prefix + "MinVal" + i] = hsh[keysNoNull[i]]

    let offset = endLst - i; 
    id = reTray.exec(keysNoNull[offset])[0]

    rtnHsh[prefix + "MaxKey" + i] = id
    rtnHsh[prefix + "MaxVal" + i] = hsh[keysNoNull[offset]]
  }

  return(rtnHsh)
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
  
  innerHTML[prefx + 'Sum'] = _.sum(vals).toFixed(0)
  innerHTML[prefx + 'Ave'] = (innerHTML[prefx + 'Sum']/vals.length).toFixed(1)

  // Init hi/low variables
  let numHigh = 0
  let numLow  = 0

  for (i=0; i<keys.length; i++) {
    let val = vals[i]
    let key = keys[i]

    if ( val == null ) {
      style[key] = {backgroundColor:'black'}
    } 
    else if ( val >= spHigh ) {
      style[key] = {backgroundColor:'#EE2222'}
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
    let tray = reTray.exec(ident)[0]

    innerHTML[prefx + "MinKey" + i] = tray
    innerHTML[prefx + "MinVal" + i] = hsh[ident]
    style[prefx + "MinRow" + i] = style[ident]   

    let offset = endInx - i; 
    id = reTray.exec(keysNoNull[offset])[0]

    innerHTML[prefx + "MaxKey" + i] = tray
    innerHTML[prefx + "MaxVal" + i] = hsh[keysNoNull[offset]]
    style[prefx + "MaxRow" + i] = style[keysNoNull[offset]]   
  }

  return([innerHTML, style])
}


// ---------------------------------------
let bit = []  
for(i=0;i<24;i++) { bit[i]=2**i }

module.exports = {
  maxmin, bit, tblProc
}