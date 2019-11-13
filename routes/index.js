var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , menuItem : 'home'});
});

/** pagina reperibilità */

router.get( '/reperibili' , (req, res, next) => {
  res.render( 'reperibili' , {
    title : 'Reperibili' , menuItem : 'reperibili'
  });
});

module.exports = router;
