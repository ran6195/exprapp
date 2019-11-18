var express = require('express');
var router = express.Router();
const sqlite3 = require( 'sqlite3' ).verbose(); 








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

  //var dati  = []

  let db = new sqlite3.Database( './storagetools.db' , sqlite3.OPEN_READONLY ,  err => {
    if( err ) {
      console.log( 'Errore: ' + err )
    } else {
      console.log( 'Database aperto' )
    }
  });


  db.all( 'SELECT * FROM zfsappliance ORDER BY dc' , [] , ( err , rows ) => {
    res.render( 'zfsappliance' , {
      title : 'ZFS Appliance' , 
      menuItem : 'zfsappliance' ,
      rows
    });
  })



  
});


module.exports = router;
