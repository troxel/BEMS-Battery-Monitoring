// ------------------------------------
// Takes a hash (object) such as {a1=3,a5=2,a2=4...}
// and returns a object with max and min keys/values
// rtnHsh = { prefixMaxKey0:maxval0,prefixMax2,maxval1... prefix}

function maxmin(hsh,prefix,len=10){

  let keys = Object.keys(hsh)

  keys.sort((a,b)=>{return hsh[a]-hsh[b]})

  // pull out numbers from object keys
  const reTray = /(\d+)$/

  const rtnHsh = {}
  
  for ( let i = 0; i<len; i++ ) {

    let id = reTray.exec(keys[i])[0]

    rtnHsh[prefix + "MinKey" + i] = id
    rtnHsh[prefix + "MinVal" + i] = hsh[keys[i]]

    let offset = (keys.length-len) - i; 
    id = reTray.exec(keys[offset])[0]

    rtnHsh[prefix + "MaxKey" + i] = id
    rtnHsh[prefix + "MaxVal" + i] = hsh[keys[offset]]
  }

  return(rtnHsh)
}

module.exports = {
  maxmin
}