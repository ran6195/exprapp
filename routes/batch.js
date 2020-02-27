var express = require( 'express');
var router = express.Router();
//var sqlite = require( 'sqlite3' );
var axios = require( 'axios' );
var fs = require( 'fs' );
var https = require( 'https' );
var moment = require( 'moment' );
var _ = require( 'lodash' )
var mysql = require( 'mysql' );
const connessione = {
    host : "10.38.108.133" ,
    user : "storage_user" ,
    password : "Pippo321!" ,
    database : "infostorage"
  };


var v1 = [ ];


let appliance;

router.get( '/test1' , ( req , res , next ) => {


    const instance = axios.create({
        httpsAgent: new https.Agent({  
          rejectUnauthorized: false
        })
    });
    
    var headers = {
        "X-Auth-User" : 'root' ,
        "X-Auth-Key" : ""
    };

    let metodo = '/api/storage/v1/filesystems';
    let con = mysql.createConnection( connessione );

    con.connect( err => {
        if( err ) throw err;

        con.query( 'SELECT * FROM zfs_appliance_hostname' , ( err , rows ) => {

            if( err ) throw err;

            appliance = rows;


            con.query( 'SELECT * FROM zfs_appliance' , ( err , rows ) => {

                if( err ) throw err;
    
                for( let i = 0; i < rows.length; i++ ) {
                    //console.log( v1 );
                    v1.push( { indirizzo : rows[ i ].addr1 + metodo , pass : rows[ i ].pass } );
                    if( rows[ i ].addr2 !== '' ) {
                        v1.push( { indirizzo : rows[ i ].addr2 + metodo , pass : rows[ i ].pass } );
                    }
                }
    
                let v = v1.map(  ( l ) => { 
                    headers["X-Auth-Key"] = l.pass;
                    return instance.get( l.indirizzo , { headers } ) 
                });
    
                let aggiungiQuote = ( s ) => '"' + s + '"';
                res.writeHead( 200 , { 'Content-Type' : 'text/plain' } );
                axios.all( v )
                    .then( axios.spread( ( ...response ) =>{
                        res.write( '"APPLIANCE","POOL","SHARE","PROJECT","EXPORT","DATACENTER"\n' );
                        response.forEach( r => {
                            let IP   = r.config.url.split('/')[2].split(':')[0];
                            let appl = appliance.filter( a => {
                                if( a.ip === IP )
                                    return [ a.nome , a.datacenter ];
                            });
                            
                            r.data.filesystems.forEach( f => {
                                f.sharenfs.split( ':' ).forEach( s => {
                                    s.split( ',' ).forEach( t => {
                                        res.write( aggiungiQuote( appl[ 0 ].nome ) +  "," + aggiungiQuote( f.pool ) + "," + aggiungiQuote( f.name ) + "," + aggiungiQuote( f.project ) + "," + aggiungiQuote( t.replace( 'rw=' , '' ) ) + "," + aggiungiQuote( appl[ 0 ].datacenter ) + "\n"   );
                                    });
                                });
                            });
                        });

                        res.end();
                    }))
                    .catch( err => console.log( err ) );
                
                
            });

        });

    });

});


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



    //db.all( 'DELETE FROM shares' , [] , err => console.log( 'errore' ) )

    //db.all( 'INSERT INTO share (ZFS-APPLIANCE, POOL)' )

    let metodo = '/api/storage/v1/filesystems'
  

  /*   db.all( 'SELECT * FROM zfsappliance' , [] , ( err , rows ) => {

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
    }); */


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
                        if( t !== 'sec=sys' ) {
                            res.write( aggiungiQuote( appl[ 0 ].nome ) +  "," + aggiungiQuote( f.pool ) + "," + aggiungiQuote( f.name ) + "," + aggiungiQuote( f.project ) + "," + aggiungiQuote( t.replace( 'rw=' , '' ) ) + "," + aggiungiQuote( appl[ 0 ].datacenter )+ "\n"   )
                        }
                        
                    })
                })
            })


        })


        res.end()
    }) ).catch( err => console.log( err ) )

});


router.get( '/rep' , ( req , res ,next ) =>{

    let dataZero = moment.now();

    let reperibili = [
        { firstName : 'Capitani' , lastName : 'Antonio' , roulo : 'interno' , posizione : 0} ,
        { firstName : 'Contaldi' , lastName : 'Domenico' , roulo : 'interno' , posizione : 1} ,
        { firstName : 'Cusani' , lasNname : 'Aurelio' , roulo : 'interno' , posizione : 2} ,
        { firstName : 'Cocchi' , lastName : 'Stefano' , roulo : 'interno' , posizione : 3} ,
        { firstName : 'Giampetruzzi' , lastName : 'Antonio' , roulo : 'interno' , posizione : 4} ,
        { firstName : 'Pastore' , lastName : 'Matteo' , roulo : 'esterno' , posizione : 5} ,
        { firstName : 'Zuin' , lastName : 'Giorgio' , roulo : 'interno' , posizione : 6} ,
        { firstName : 'Rambaldo' , lastName : 'Michele' , roulo : 'interno' , posizione : 7} ,
        { firstName : 'Carlini' , lastName : 'Gianluca' , roulo : 'interno' , posizione : 8} ,
        { firstName : 'Pellegrin' , lastName : 'Gianpaolo' , roulo : 'interno' , posizione : 9} ,
        { firstName : 'Galtarossa' , lastName : 'Stefano' , roulo : 'esterno' , posizione : 10} ,

    ];


    let routa = [
    //  [  L ,  M ,  M ,  G ,  V ,  S ,  D ]
        [  0 ,  1 ,  2 ,  3 ,  4 ,  4 ,  5 ] , //  0
        [  6 ,  7 ,  8 ,  9 , 10 , 10 ,  0 ] , //  1
        [  1 ,  2 ,  3 ,  4 ,  5 ,  5 ,  6 ] , //  2
        [  7 ,  8 ,  9 , 10 ,  0 ,  0 ,  1 ] , //  3
        [  2 ,  3 ,  4 ,  5 ,  6 ,  6 ,  7 ] , //  4
        [  8 ,  9 , 10 ,  0 ,  1 ,  1 ,  2 ] , //  5
        [  3 ,  4 ,  5 ,  6 ,  7 ,  7 ,  8 ] , //  6
        [  9 , 10 ,  0 ,  1 ,  2 ,  2 ,  3 ] , //  7
        [  4 ,  5 ,  6 ,  7 ,  8 ,  8 ,  9 ] , //  8
        [ 10 ,  0 ,  1 ,  2 ,  3 ,  3 ,  4 ] , //  9
        [  5 ,  6 ,  7 ,  8 ,  9 ,  9 , 10 ] , // 10
    ];

});


module.exports = router

