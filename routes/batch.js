var express = require( 'express');
var router = express.Router();
var sqlite = require( 'sqlite3' );
var axios = require( 'axios' );
var fs = require( 'fs' );
var https = require( 'https' );

let aspriDB = () => {
    return new  sqlite.Database( './storagetools.db' , [] , err => {
        if( err ) {
            console.log( err )
        } else {
            console.log( 'DB aperto' )
        }
    });
}

let chiudiDB = ( db ) => db.close();

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

 

    let v = [ 
        { indirizzo : 'https://10.22.250.82:215/api/storage/v1/filesystems' , pass : 'Vem5t[I0*8dp' } , 
        { indirizzo : 'https://10.22.250.80:215/api/storage/v1/filesystems' , pass : 'Vem5t[I0*8dp' } ,
        { indirizzo : 'https://10.34.224.78:215/api/storage/v1/filesystems' , pass : 'p$m1!Uku4efE'} , 
        { indirizzo : 'https://10.34.224.80:215/api/storage/v1/filesystems' , pass : 'p$m1!Uku4efE'} ,
        { indirizzo : 'https://10.22.43.22:215/api/storage/v1/filesystems' , pass : 'mQ4CP!oynX'} , 
        { indirizzo : 'https://10.22.43.24:215/api/storage/v1/filesystems' , pass : 'mQ4CP!oynX'} 
    ]
        .map(  ( l ) => { 
            headers["X-Auth-Key"] = l.pass;
            return instance.get( l.indirizzo , { headers } ) 
        })

    res.writeHead( 200 , { 'Content-Type' : 'text/plain' })
    res.write( 'inizio\n' )

    axios.all( v ).then( axios.spread( ( ...response ) =>{
        response.forEach( el => {
            el.data.filesystems.forEach( f => res.write( f.project + "," + f.name + ", " + ( f.space_data / Math.pow( 2 , 40 )).toFixed( 2 ) + "\n") )
        })

        res.write( 'fatto' )
        res.end()
    }) ).catch( err => console.log( err ) )

});
module.exports = router

