var express = require('express');
var router = express.Router();

var date = new Date();

/* GET home page. */ 
router.get('/', function(req, res, next) {

  let strHsh = {}
  res.render('aux', strHsh);

});

module.exports = router;









