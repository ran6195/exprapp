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


  let db = new sqlite3.Database( './storagetools.db' , sqlite3.OPEN_READONLY ,  err => {
    if( err ) {
      console.log( 'Errore: ' + err )
    }
  });

  let dati = [ 'pippo' ];

  db.serialize(() => {
    db.each( 'SELECT * FROM zfsappliance' , ( err , row ) => {
      if( err ) {
        console.log( err )
      }
      dati.push( row )
    }) 
    
  })

  db.close( err => {
    if( err ) {
      console.log( err )
    }
  })



  res.render( 'zfsappliance' , {
    title : 'ZFS Appliance' , 
    menuItem : 'zfsappliance' ,
    dati
  });
});


module.exports = router;
