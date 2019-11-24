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

  instance.get( 'https://10.22.250.82:215/api/storage/v1/filesystems' , {
    headers : {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : "Vem5t[I0*8dp"
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

router.post( '/zfspoolsdetails' , ( req , res , next ) => {

  const appliance = req.body.applianceDetails[ 0 ];

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  const headers = {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : appliance.pass
  }

  if ( appliance.addr2 !== '' ) {
    let interrogaTestaUno = () => {
      return instance.get( appliance.addr1 + '/api/storage/v1/pools' , { headers } );
    }
  

    let interrogaTestaDue = () => {
      return instance.get( appliance.addr2 + '/api/storage/v1/pools' , { headers } );
    }

    axios.all([ interrogaTestaUno() , interrogaTestaDue() ] )
      .then( axios.spread( ( addr1 , addr2 ) => {

        let testa1 = addr1.data.pools.filter( e => e.status === 'online' )
        let testa2 = addr2.data.pools.filter( e => e.status === 'online' )
        
        testa1.forEach( el => {
          el.owner_ip = appliance.addr1
        });
        
        
        testa2.forEach( el => {
          el.owner_ip = appliance.addr2
        });

        let pools = testa1.concat ( testa2 ) 
        
        res.json( pools )

      }) )
      .catch( err => console.log( err ))

  } else {
    instance.get( appliance.addr1 + '/api/storage/v1/pools' , { headers } )
      .then( response => res.json( response.data.pools ) )
      .catch( err => console.log( err ) )
  } 

});

router.post( '/zfsprojects' , ( req , res , next ) =>{

  const appliance = req.body.appliance[ 0 ];

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  const headers = {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : appliance.pass
  }

  if ( appliance.addr2 !== '' ) {
    let interrogaTestaUno = () => {
      return instance.get( appliance.addr1 + '/api/storage/v1/projects' , { headers } );
    }
  

    let interrogaTestaDue = () => {
      return instance.get( appliance.addr2 + '/api/storage/v1/projects' , { headers } );
    }


    axios.all([ interrogaTestaUno() , interrogaTestaDue()] )
      .then( axios.spread( ( addr1 , addr2 ) =>{
        
        let out = addr1.data;
        
        res.json( [ addr1.data , addr2.data ])
        
      }))
      .catch(err => console.log(err))

  } else {
    instance.get( appliance.addr1 + '/api/storage/v1/projects', { headers })
      .then(response => res.json( [ response.data ] ))
      .catch(err => console.log(err))
  }

});


router.post( '/zfsshares' , ( req  , res , next ) =>{
  
  const appliance = req.body.appliance[ 0 ]

  const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });

  const headers = {
      "X-Auth-User" : 'root' ,
      "X-Auth-Key" : appliance.pass
  }

  if ( appliance.addr2 !== '' ) {
    let interrogaTestaUno = () => {
      return instance.get( appliance.addr1 + '/api/storage/v1/filesystems' , { headers } );
    }
  

    let interrogaTestaDue = () => {
      return instance.get( appliance.addr2 + '/api/storage/v1/filesystems' , { headers } );
    }


    axios.all([ interrogaTestaUno() , interrogaTestaDue()] )
      .then( axios.spread( ( addr1 , addr2 ) =>{
        
        res.json( [ addr1.data , addr2.data ])
        
      }))
      .catch(err => console.log(err))

  } else {
    instance.get( appliance.addr1 + '/api/storage/v1/filesystems', { headers })
      .then(response => res.json( [ response.data ] ))
      .catch(err => console.log(err))
  }

});


router.post( '/dettagli_shares' , ( req , res , next )=>{
  res.render( 'dettagli_shares' , { shares : req.body.shares })
})

router.post( '/dettagli_projects' , (req , res , next ) => {
  res.render( 'dettagli_projects' , { projects : req.body.projects })
})

router.post( '/poolsdetails', ( req , res , next ) => {
  res.render( 'dettagli_pools' , { pools : req.body.pools })
}); 



module.exports = router;
