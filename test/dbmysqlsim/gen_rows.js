// Insert one row of simulated data

var mysql = require('mysql');

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
