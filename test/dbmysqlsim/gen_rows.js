// Insert one row of simulated data

var mysql = require('mysql');

// --------------- util ---------------------

// ---------------------------
var randomValues = {
	v: function(){
		return( (11 + (Math.random() * 2)).toFixed(2) )
	},
	t: function(){
		return( (70 + (Math.random() * 20)).toFixed(2) )
	},
	b: function(){
		return(  (Math.random() * 100 ).toFixed(2) )
	},
	r: function(){
		return( (2 + (Math.random() * 3)).toFixed(2) )
	},
	i: function(){
		return( ( 200 + (Math.random() * 30)).toFixed(2) )
	},
	va: function(){
		return( ( 11 + (Math.random() * 3)).toFixed(2) )
	},
	temperature_aux: function(){
		return( ( 68 + (Math.random() * 14)).toFixed(2) )
	},
	i_aux: function(){
		return( ( 70 + (Math.random() * 40)).toFixed(2) )
	},
	env: function(){
		return( ( 1.5 + (Math.random() * 0.5)).toFixed(2) )
	}
}

var con = mysql.createConnection({
  host: "localhost",
  user: "webdev",
  password: "webdev1!",
  database: "bems"

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  insert_tray_rows() // do inserts
  insert_current_rows()
  insert_aux_rows()
  insert_env()
  insert_error_wd(8,3)
  con.end();
});

function insert_tray_rows(){

	var pLst = ['v','t','b','r']
	var pHsh = {v:'volts',t:'temperature',b:'balance',r:'impedance'}

	for(j of pLst) {
		let tLst = []

		for (let i = 1; i <= 280; i++) {
			tLst.push( randomValues[j]() )
		}

		valStr = tLst.join(',')

		var sql = `INSERT INTO ${pHsh[j]} VALUES (NULL,${valStr})`;
		
		console.log(`1 ${pHsh[j]} record insert`);
		con.query(sql, function (err, result) {
		  if (err) throw err;
		});
	
	}	
}

function insert_current_rows(){

	let iLst = []
	for ( let i=0;i<4;i++) {
		iLst.push( randomValues['i']() )
	}

	let valStr = iLst.join(',')
	var sql = `INSERT INTO i_prop_str VALUES (NULL,${valStr})`;

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 current record inserted`);
	});	
}

// -------------------------------------
function insert_aux_rows(){

	let vaLst = []
	for ( let i=0;i<186;i++) {
		vaLst.push( randomValues['va']() )
	}

	let valStr = vaLst.join(',')
	var sql = `INSERT INTO volts_aux VALUES (NULL,${valStr})`;

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 volts_aux record inserted`);
	});	

	let tmpLst = [];
	for (let i=0;i<6;i++){
		tmpLst.push( randomValues['temperature_aux']() )
	}
	let tmpStr = tmpLst.join(',')

	var sql = `INSERT INTO temperature_aux VALUES (NULL,${tmpStr})`;

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 temperature_aux record inserted`);
	});
	
	let i_aux = randomValues['i_aux']()
	var sql = `INSERT INTO i_aux VALUES (NULL,${i_aux})`;

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 i_aux record inserted`);
	});	

}

// -------------------------------------
function insert_env(){

	let vaLst = []
	for ( let i=0;i<13;i++) {
		vaLst.push( randomValues['env']() )
	}

	let valStr = vaLst.join(',')
	var sql = `INSERT INTO env VALUES (NULL,${valStr})`;

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 env record inserted`);
	});
}

// -------------------------------------
function insert_error_wd(wd,bit){

	let errorLst = [0,0,0,0,0,0,0,0]

	errorLst[wd-1] = 2**(bit - 1) 

	let valStr = errorLst.join(',')
	var sql = `INSERT INTO error_wd VALUES (NULL,${valStr});`;

	console.log(sql,2**2,bit)

	//console.log(sql)
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log(`1 err_wd word=${wd} bit=${bit} record inserted`);
	});
}

let bit = { 0:'0x0001',
1:'0x0002',
2:'0x0004',
3:'0x0008',
4:'0x0010',
5:'0x0020',
6:'0x0040',
7:'0x0080',
8:'0x0100',
9:'0x0200',
10:'0x0400',
11:'0x0800',
12:'0x1000',
13:'0x2000',
14:'0x4000',
15:'0x8000',
16:'0x00010000',
17:'0x00020000',
18:'0x00040000',
19:'0x00080000',
20:'0x00100000',
21:'0x00200000',
22:'0x00400000',
23:'0x00800000',
24:'0x01000000',
25:'0x02000000',
26:'0x04000000',
27:'0x08000000',
28:'0x10000000',
29:'0x20000000',
30:'0x40000000',
31:'0x80000000'
}