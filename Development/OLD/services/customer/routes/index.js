var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Customer Service Application - You should not be seeing this page <3' });
});

module.exports = router;
