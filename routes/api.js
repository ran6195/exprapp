var express = require( 'express' );
var router  = express.Router();
const sqlite3 = require( 'sqlite3' ).verbose();


var apriDB = () => {
    return new sqlite3.Database( './storagetools.db' , [] , err => {
        if( err ) {
            console.log( err );
        } else {
            console.log( 'DB Apert' );
        }
    });
};

var chiudiDB = ( db ) => db.close(); 


/** Get All ZFS */

router.get( '/zfs' , ( req , res , next )=> {

    let db = apriDB()

    let sql = 'SELECT * FROM zfsappliance WHERE id = ?';
    let option = [ req.query.id ];

    db.all( sql , option , (err , rows )=>{
        res.json( rows )
    });
    
    db.close();

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
                    NFS_EXPORT AS Export ,
                    DATACENTER AS DC
                  FROM 
                    shares 
                  WHERE ${campo} = '${ricerca}' AND DATACENTER = '${datacenter}'`

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
        sql = `SELECT DISTINCT ${campo} FROM shares WHERE ${campo} LIKE ? AND DATACENTER = '${datacenter}'`
    }

    option.push( '%' + term + '%');
    
    db.all( sql , option , ( err , rows ) => {

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

