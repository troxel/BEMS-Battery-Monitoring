var express = require('express');
var router = express.Router();

var date = new Date();

var numTrays = 270

/* GET home page. */ 
router.get('/:str', function(req, res, next) {

  let strHsh = {}
  strHsh['str_lbl'] = req.params.str
  strHsh['str_id']  = req.params.str - 1
  console.log("str ",strHsh)
  res.render('str', strHsh);

});

module.exports = router;









