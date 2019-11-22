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
        'jquery-ui.min' ,
        'zfsappliance'
      ]
    });
  })
  
});

router.get( '/shares' , ( err , res , next ) => {

  let db = new sqlite3.Database( './storagetools.db' , sqlite3.OPEN_READONLY , err => {
    if( err ) {
      console.log( err )
    } else {
      console.log('database aperto');
    }

    db.all( 'SELECT DISTINCT dc FROM zfsappliance ORDER BY dc' , [] , ( err , datacenter ) =>{
      if( err ) {
        console.log( err ) 
      } else {
        res.render( 'shares' , {
          datacenter
        })
      }
    });

  } )

});


router.get( '/test' , ( req , res , next ) => {
  var dati;

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  instance.get( 'https://10.22.43.24:215/api/hardware/v1/cluster/resources/zfs/Pool-01' , {
    headers : {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : "mQ4CP!oynX"
    }
  })
    .then( response => res.json( response.data ) )
    .catch( err => res.send( err ) )

})

router.post( '/table' , ( req , res , next) => {
  res.render( 'tabella' , { rows : req.body.data.rows } );
});


router.post( '/zfsappliancedetails' , ( req , res , next ) => {

  var appliance = req.body.appliance[ 0 ];
  console.log( appliance )
  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  instance.get( appliance.addr1 + '/api/hardware/v1/cluster' , {
    headers : {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : appliance.pass
    }
  })
    .then( response => {
      res.render( 'zfsdetails' , {
        appliance ,
        cluster : response.data.cluster  
      })
    })
    .catch( err => res.send( err ) )

});


module.exports = router;
