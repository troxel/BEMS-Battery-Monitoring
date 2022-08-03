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
  insert_rows()
  con.end();
});

function insert_rows(){

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
		  console.log(`1 record inserted`);
		});
	
	}	
}
