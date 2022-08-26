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
		return(  (Math.random() ).toFixed(2) )
	},
	r: function(){
		return( (2 + (Math.random() * 3)).toFixed(2) )
	},
	i: function(){
		return( ( 200 + (Math.random() * 30)).toFixed(2) )
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
  con.end();
});

function insert_tray_rows(){

	var pLst = ['v','t','b','r']
	var pHsh = {v:'volts',t:'temperature',b:'balance',r:'impedance'}

	for(j of pLst) {
		tLst = []

		for (var i = 1; i <= 280; i++) {
			tLst.push( randomValues[j]() )
		}

		valStr = tLst.join(',')

		var sql = `INSERT INTO ${pHsh[j]} VALUES (NULL,${valStr})`;
		//console.log(sql)
		con.query(sql, function (err, result) {
		  if (err) throw err;
		  console.log(`1 ${pHsh[j]} record inserted`);
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

