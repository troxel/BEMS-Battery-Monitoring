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

var str = 'CREATE TABLE flt_alm_buffer ( time timestamp not null default current_timestamp ,incident_id int UNSIGNED, flt_sw TINYINT);'
console.log(str)
console.log("#-----------------------------------")

var str = 'CREATE TABLE flt_alm_msg ( incident_id int UNSIGNED PRIMARY KEY, incident_str varchar(30));'
console.log(str)
console.log("#-----------------------------------")