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
	
}
