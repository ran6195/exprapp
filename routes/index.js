var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Storage Tools' , menuItem : 'home'});
});

/** pagina reperibilità */

router.get( '/reperibili' , (req, res, next) => {
  res.render( 'reperibili' , {
    title : 'Reperibili' , menuItem : 'reperibili'
  });
});

/** pagina zfs */

router.get( '/zfsappliance' , (req, res, next) => {
  res.render( 'zfsappliance' , {
    title : 'ZFS Appliance' , menuItem : 'zfsappliance'
  });
});


module.exports = router;
