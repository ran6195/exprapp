var express = require( 'express');
var router = express.Router();
var sqlite = require( 'sqlite3' );
var axios = require( 'axios' );
var fs = require( 'fs' );
var https = require( 'https' );
var _ = require( 'lodash' )
var v1 = [ ];

let appliance;

let aspriDB = () => {
    return new  sqlite.Database( './storagetools.db' , [] , err => {
        if( err ) {
            console.log( err )
        } else {
            console.log( 'DB aperto' )
        }
    });
}

let chiudiDB = ( db ) => { 
    db.close();
    console.log( 'Database chiuso' ) 
}

router.get( '/test' , ( req , res , next ) => {

    const instance = axios.create({
        httpsAgent: new https.Agent({  
          rejectUnauthorized: false
        })
    });
    
    var headers = {
        "X-Auth-User" : 'root' ,
        "X-Auth-Key" : ""
    }; 

    let db = aspriDB();

    db.all( 'SELECT * FROM appliance_hostname' , [] , ( err , rows ) => {
        if( err ) {
            console.log( err )
        } else {
            appliance = rows;
        }
    });

    //db.all( 'DELETE FROM shares' , [] , err => console.log( 'errore' ) )

    //db.all( 'INSERT INTO share (ZFS-APPLIANCE, POOL)' )

    let metodo = '/api/storage/v1/filesystems'
  

    db.all( 'SELECT * FROM zfsappliance' , [] , ( err , rows ) => {

        console.log( v1 )

        for(let i = 0; i < rows.length; i++ ) {
            
            if( rows[ i ].addr2 !== '' ) {
                v1.push({ indirizzo : rows[ i ].addr1 + metodo , pass : rows[ i ].pass } )
                v1.push({ indirizzo : rows[ i ].addr2 + metodo , pass : rows[ i ].pass } )
            } else {
                v1.push({ indirizzo : rows[ i ].addr1 + metodo, pass : rows[ i ].pass } )
            }
        }
   
        chiudiDB( db )
    });


/*     let v = [ 
        { indirizzo : `https://10.22.250.82:${porta}${metodo}` , pass : 'Vem5t[I0*8dp' } , 
        { indirizzo : `https://10.22.250.80:${porta}${metodo}` , pass : 'Vem5t[I0*8dp' } ,
        { indirizzo : `https://10.34.224.78:${porta}${metodo}` , pass : 'p$m1!Uku4efE'} , 
        { indirizzo : `https://10.34.224.80:${porta}${metodo}` , pass : 'p$m1!Uku4efE'} ,
        { indirizzo : `https://10.22.43.22:${porta}${metodo}` , pass : 'mQ4CP!oynX'} , 
        { indirizzo : `https://10.22.43.24:${porta}${metodo}` , pass : 'mQ4CP!oynX'} ,
        { indirizzo : `https://10.25.73.40:${porta}${metodo}` , pass : '9Lb?53P0~8>3'} , 
        { indirizzo : `https://10.25.73.42:${porta}${metodo}` , pass : '9Lb?53P0~8>3'} 
       
    ] */

    let v = v1.map(  ( l ) => { 
        headers["X-Auth-Key"] = l.pass;
        return instance.get( l.indirizzo , { headers } ) 
    })

    console.log( v )

    res.writeHead( 200 , { 'Content-Type' : 'text/plain' })
    
    let aggiungiQuote = ( s ) => '"' + s + '"';
    
    

    axios.all( v ).then( axios.spread( ( ...response ) => {
        res.write( '"APPLIANCE","POOL","SHARE","PROJECT","EXPORT","DATACENTER"\n' )
        response.forEach( el => {
            let IP = el.config.url.split('/')[2].split(':')[0];

            let appl  = appliance.filter( e => {
                if( e.ip === IP )
                    return [ e.nome , e.datacenter ]
            })


            el.data.filesystems.forEach( f => {

                f.sharenfs.split( ':' ).forEach( s => {

                    s.split( ',' ).forEach( t => {
                        res.write( aggiungiQuote( appl[ 0 ].nome ) +  "," + aggiungiQuote( f.pool ) + "," + aggiungiQuote( f.name ) + "," + aggiungiQuote( f.project ) + "," + aggiungiQuote( t ) + "," + aggiungiQuote( appl[ 0 ].datacenter )+ "\n"   )
                    })
                })
            })


        })


        res.end()
    }) ).catch( err => console.log( err ) )

});
module.exports = router

