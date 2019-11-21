var express = require( 'express' );
var router  = express.Router();
const sqlite3 = require( 'sqlite3' ).verbose();




/** Get All ZFS */

router.get( '/zfs' , ( req , res , next )=> {

    let db = new sqlite3.Database( './storagetools.db' , sqlite3.OPEN_READONLY , err => {
        if( err ) {
            console.log( err );
        } else {
            console.log( 'Database aperto' )
        }
    });

    let sql = 'SELECT * FROM zfsappliance ORDER BY dc';
    let option = [];


    db.all( sql , option , (err , rows )=>{
        res.json( rows )
    });
    
    db.close();

})


router.get( '/ricerca_zfs_shares' , ( req , res , next ) => {

    console.log( req.query )


    res.send(['pippo' , 'pluto' , 'Minnie' , 'paperina' , 'qui' , 'quo' , 'qua' ]);


});


module.exports = router;

