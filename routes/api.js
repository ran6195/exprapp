var express = require( 'express' );
var router  = express.Router();
//const sqlite3 = require( 'sqlite3' ).verbose();
const mysql = require('mysql');
const connessione = {
    host : "10.38.108.133" ,
    user : "storage_user" ,
    password : "Pippo321!" ,
    database : "infostorage"
  };

/** Get All ZFS */

router.get( '/zfs' , ( req , res , next )=> {

/*     let db = apriDB()

    let sql = 'SELECT * FROM zfsappliance WHERE id = ?';
    let option = [ req.query.id ];

    db.all( sql , option , (err , rows )=>{
        res.json( rows )
    });
    
    db.close(); */


    let con = mysql.createConnection( connessione );
    let id = req.query.id;

    con.connect( err => {
        if( err ) throw err;
        console.log( 'Connected' );
        con.query( 'SELECT * FROM zfs_appliance WHERE id = ' + id  , ( err , rows ) => {
            if( err ) throw err;
            res.json( rows );
        });
    });

})

router.post( '/shares' , ( req , res , next ) => {
    
    var db = apriDB();
    
    let option = [];
    let campo = req.body.campo.toUpperCase();
    campo === 'BOX' ? campo = 'APPLIANCE' : campo;
    let ricerca = req.body.ricerca;
    let datacenter = req.body.datacenter.toUpperCase();
    if( datacenter === 'ALL' )
        var sql = `SELECT
                    APPLIANCE AS Appliance ,
                    SHARE AS Share ,
                    POOL AS Pool ,
                    PROJECT AS Project ,
                    EXPORT AS Export ,
                    DATACENTER AS DC
                  FROM 
                    shares 
                  WHERE ${campo} = '${ricerca}'`;
    else    
        var sql = `SELECT
                    APPLIANCE AS Appliance ,
                    SHARE AS Share ,
                    POOL AS Pool ,
                    PROJECT AS Project ,
                    EXPORT AS Export ,
                    DATACENTER AS DC
                  FROM 
                    shares 
                  WHERE ${campo} = '${ricerca}' AND DATACENTER LIKE '${datacenter}'`

    console.log( sql );

    db.all( sql , option , ( err , rows ) => {

        res.send( rows )

        chiudiDB( db );
    });

});


router.get( '/ricerca_zfs_shares' , ( req , res , next ) => {

    let db = apriDB();

    let campo = req.query.campo.toUpperCase();
    if( campo === 'BOX' )
        campo = 'APPLIANCE';
    let datacenter = req.query.datacenter.toUpperCase();
    let term = req.query.term;
    let sql = '';
/*     if( datacenter === 'ALL' ) {
        sql = `SELECT DISTINCT ${campo} FROM shares WHERE ${campo} LIKE '%${term}%'`;
    } else {
        sql = `SELECT DISTINCT ${campo} FROM shares WHERE ${campo} LIKE '%${term}%' AND DATACENTER = '${datacenter}'`;
    } */
    let option = [];
    if( datacenter === 'ALL' ) {
        sql = `SELECT DISTINCT ${campo} FROM shares WHERE ${campo} LIKE ?`
    } else {
        sql = `SELECT DISTINCT ${campo} FROM shares WHERE ${campo} LIKE ? AND DATACENTER LIKE '${datacenter}'`
    }



    option.push( '%' + term + '%');
    
    db.all( sql , option , ( err , rows ) => {

        console.log( sql )

        var out = [];

        if( rows.length > 0 ) {
            rows.forEach( el => {
                out.push( el[ campo ] );
            });
        } 
        
        res.send( out );
        chiudiDB( db );
    });

});


module.exports = router;

