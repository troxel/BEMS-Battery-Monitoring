// ############### Propulsion Data Elements ################
var pLst = ['v','t','b','r']
var pHsh = {v:'volts',t:'temperature',b:'balance',r:'impedance'}

for(j of pLst) {
      let tLst = []

      for (var i = 1; i <= 280; i++) {
            tLst.push(`${j}${i} float`)
      }
     
      var str = `CREATE TABLE ${pHsh[j]} ( time timestamp not null default current_timestamp primary key,`
      str += tLst.join(',')
      str += ");"

      console.log(str)
      console.log("#-----------------------------------\n")

}

// ################### BACS Alarms ##############################
let tLst = []
for (var i = 1; i <= 280; i++) {
      tLst.push(`bacs${i} smallint unsigned`)
}

var str = `CREATE TABLE alarms ( time timestamp not null default current_timestamp primary key,`
str += tLst.join(',')
str += ");"

console.log(str)
console.log("#-----------------------------------\n")


// ################### Aux ##############################
tLst = []

for (var i = 1; i <= 186; i++) {
      tLst.push(`va${i} float`)
}

var str = `CREATE TABLE volts_aux ( time timestamp not null default current_timestamp primary key,`
str += tLst.join(',')
str += ");"

console.log(str)
console.log("#-----------------------------------\n")

var str = 'CREATE TABLE i_prop_str ( time timestamp not null default current_timestamp primary key,i_str0 float,i_str1 float,i_str2 float,i_str3 float);'
console.log(str)
console.log("#-----------------------------------")

// ############### Fault/Alarm Buffer ################

var str = 'CREATE TABLE i_aux_str ( time timestamp not null default current_timestamp primary key,i_aux0 float);'
console.log(str)
console.log("#-----------------------------------\n")

// ############### Fault/Alarm Buffer ################

var str = 'CREATE TABLE flt_buffer ( time timestamp not null default current_timestamp, msg varchar(30), flt TINYINT);'
console.log(str)
console.log("#-----------------------------------\n")

// ############### Aux Temp ################

const envLst = ['batt_h2_1','batt_fire_1','batt_smoke',
                  'ee_fire','ee_smoke','machine_fire','machine_smoke',
                  'batt_h2_2','batt_fire_2','batt_temp','ee_temp','machine_temp_1','machine_temp_2'];

let envStrLst = []
for (let item of envLst) {
      envStrLst.push(item + ' float')
}

let envStr = envStrLst.join(',')
str = `CREATE TABLE env ( time timestamp not null default current_timestamp primary key,${envStr});`
console.log(str)
console.log("#-----------------------------------\n")

// ############### Aux Temp ################

const auxTmpLst = ['aux_cell_temp_1','aux_cell_temp_2','aux_cell_temp_3','aux_cell_temp_4',
'aux_amb_temp_1','aux_amb_temp_2'];

let auxTmpStrLst = []
for (let item of auxTmpLst) {
      auxTmpStrLst.push(item + ' float')
}

let auxStr = auxTmpStrLst.join(',')
str = `CREATE TABLE temperature_aux ( time timestamp not null default current_timestamp primary key,${auxStr});`
console.log(str)
console.log("#-----------------------------------\n")

// ############### Aux Current ################

str = 'CREATE TABLE i_aux ( time timestamp not null default current_timestamp primary key, i_aux float);'
console.log(str)
console.log("#-----------------------------------\n")

// ############### Error Words ################

str = 'CREATE TABLE error_wd ( time timestamp not null default current_timestamp primary key, error_wd1  SMALLINT UNSIGNED , error_wd2  SMALLINT UNSIGNED , error_wd3  SMALLINT UNSIGNED , error_wd4  SMALLINT UNSIGNED , error_wd5  SMALLINT UNSIGNED , error_wd6  SMALLINT UNSIGNED , error_wd7  SMALLINT UNSIGNED , error_wd8  SMALLINT UNSIGNED );'
console.log(str)
console.log("#-----------------------------------\n")

// ############### SBS Status,Alarm,Alert Words ################

const equalinkWds = ['EquaLink_System_Alarms','EquaLink_General_Alarms','Equalink_System_Status']

equalinkLst = []
for (let item of equalinkWds) {
      for (i=1;i<=8;i++) {
            equalinkLst.push(item + '_' + i + ' SMALLINT UNSIGNED')
      }    
}

let equalinkStr = equalinkLst.join(',')
str = `CREATE TABLE sbs_status_wd ( time timestamp not null default current_timestamp primary key,${equalinkStr});`
console.log(str)
console.log("#-----------------------------------\n")