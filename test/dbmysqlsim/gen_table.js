var pLst = ['v','t','b','r']
var pHsh = {v:'volts',t:'temperature',b:'balance',r:'impedance'}

for(j of pLst) {
	tLst = []

	for (var i = 1; i <= 280; i++) {
		tLst.push(`${j}${i} float`)
	}
	
	var str = `CREATE TABLE ${pHsh[j]} ( time timestamp not null default current_timestamp primary key,`
	str += tLst.join(',')
	str += ");"

	console.log(str)
	console.log("#-----------------------------------")

}
	
tLst = []

for (var i = 1; i <= 186; i++) {
	tLst.push(`va${i} float`)
}

var str = `CREATE TABLE volts_aux ( time timestamp not null default current_timestamp primary key,`
str += tLst.join(',')
str += ");"

console.log(str)
console.log("#-----------------------------------")

var str = 'CREATE TABLE i_prop_str ( time timestamp not null default current_timestamp primary key,i_str0 float,i_str1 float,i_str2 float,i_str3 float);'
console.log(str)
console.log("#-----------------------------------")
var str = 'CREATE TABLE i_aux_str ( time timestamp not null default current_timestamp primary key,i_aux0 float);'
console.log(str)
console.log("#-----------------------------------")

var str = 'CREATE TABLE flt_buffer ( time timestamp not null default current_timestamp, msg varchar(30), flt TINYINT);'
console.log(str)
console.log("#-----------------------------------")

/* var str = 'CREATE TABLE flt_alm_buffer ( time timestamp not null default current_timestamp ,incident_id int UNSIGNED, flt_sw TINYINT);'
console.log(str)
console.log("#-----------------------------------")

var str = 'CREATE TABLE flt_alm_msg ( incident_id int UNSIGNED PRIMARY KEY, incident_str varchar(30));'
console.log(str)
console.log("#-----------------------------------")
 */
/* var str = `CREATE TABLE string_current ( time timestamp not null default current_timestamp primary key,str1 float,str2 float,str3 float,str4 float,`
str += tLst.join(',')
str += ");"

console.log(str)
console.log("#-----------------------------------") */

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
console.log("#-----------------------------------")


const auxTmpLst = ['aux_cell_temp_1','aux_cell_temp_2','aux_cell_temp_3','aux_cell_temp_4',
'aux_amb_temp_1','aux_amb_temp_2'];

let auxTmpStrLst = []
for (let item of auxTmpLst) {
	auxTmpStrLst.push(item + ' float')
}

let auxStr = auxTmpStrLst.join(',')
str = `CREATE TABLE temperature_aux ( time timestamp not null default current_timestamp primary key,${auxStr});`
console.log(str)
console.log("#-----------------------------------")

str = 'CREATE TABLE i_aux ( time timestamp not null default current_timestamp primary key, i_aux float);'
console.log(str)
console.log("#-----------------------------------")

str = 'CREATE TABLE error_wd ( time timestamp not null default current_timestamp primary key, error_wd1  SMALLINT UNSIGNED , error_wd2  SMALLINT UNSIGNED , error_wd3  SMALLINT UNSIGNED , error_wd4  SMALLINT UNSIGNED , error_wd5  SMALLINT UNSIGNED , error_wd6  SMALLINT UNSIGNED , error_wd7  SMALLINT UNSIGNED , error_wd8  SMALLINT UNSIGNED );'
console.log(str)
console.log("#-----------------------------------")
