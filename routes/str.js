var express = require('express');
var router = express.Router();

var date = new Date();

var numTrays = 270

/* GET home page. */ 
router.get('/:str', function(req, res, next) {

  res.render('str', { str_id:req.params.str-1 });

});


module.exports = router;









