var express = require('express');
var router = express.Router();
const axios = require( 'axios' ).default;
const sqlite3 = require( 'sqlite3' ).verbose(); 
var dati = {};


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

pippo = new Promise( ( resole , reject ) => {
  axios.get('/api/zfs').then( data => resolve( data )).catch( err => reject( err ))
})



router.get('/test',(req, res, next) => {

    pippo.then(data => res.json( data ) ).catch( err => res.json( err ) )

})

module.exports = router;
