var express = require('express');
var router = express.Router();
const axios = require( 'axios' ).default;
const sqlite3 = require( 'sqlite3' ).verbose(); 
const https = require( 'https' )
var dati = {};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Storage Tools' , menuItem : 'home'});
});

/** pagina reperibilità */

router.get( '/reperibili' , (req, res, next) => {
  res.render( 'reperibili' , {
    title : 'Reperibili' , menuItem : 'reperibili' , scripts : [ 'reperibili' ]
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
      rows ,
      scripts : [
        'zfsappliance'
      ]
    });
  })
  
});

router.get( '/shares' , ( err , res , next ) => {
  res.render( 'shares' , {
    scripts : []
  });
});


router.get( '/test' , ( req , res , next ) => {
  var dati;

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });




  instance.get( 'https://10.25.73.40:215/api/storage/v1/projects' , {
    headers : {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : "9Lb?53P0~8>3"
    }
  })
    .then( response => res.json( response.data ) )
    .catch( err => res.send( err ) )

})



module.exports = router;
