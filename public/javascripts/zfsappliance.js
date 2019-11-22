
(()=>{


    // Gestione del click su nome del box

    $( '.zfsa' ).on( 'click' , e => {
        e.preventDefault()
        let id = e.target.parentNode.id;
        $( '.loader' ).css({ display : 'block' })
        axios.get('/api/zfs' , { params : { id : id } } )
            .then( response => { 
                axios.post( '/zfsappliancedetails' , { appliance : response.data } )
                    .then( response => {
                        $( '.loader' ).css({ display : 'none' })
                        console.log( response.data )
                        $( '#contenitore' ).html( response.data )
                    })
                    .catch( err => console.log( err ) )
            })
            .catch( err => console.log( err ) )
    })


    //Gestione del menu di sinistra

    $( '.zlgi' ).on( 'click' , e => {

        e.preventDefault(); 

        let voci = e.target.parentNode.childNodes;
        let voce = $( e.target );
        voci.forEach(el => {
            $( el ).removeClass( 'active' )
        });

        voce.addClass( 'active' )


        console.log(voce.text().trim());
        
        switch( voce.text().trim() ) {
            case 'Appliance':

                document.location.href = '/zfsappliance'

                break;

            case 'Shares':

                    $( '#contenitore' ).html( '' )
                    axios.get( '/shares' )
                    .then( response => {
                        $( '#contenitore' ).html( response.data ) 
                        gestioneRicercaShare()
                    })
                    .catch( err => console.log( err ) )
                break;
            

            case 'Ambiti':

                break;
        }

    });

    // Gestione dei filtri e della ricerca

    let gestioneRicercaShare = () => {
        
        var getData = ( ui ) => {
            console.log( ui );
            axios.post( '/api/shares' , {
                campo : campo ,
                ricerca : ui.item.value ,
                datacenter : datacenter
            })
                .then( response => {
                    var rows = response.data 
                    console.log( rows );
                    axios.post( '/table' , { data : {
                        rows 
                    } })
                        .then( response => {
                            $( '#out' ).html( response.data )
                        })
                        .catch( err => console.log( err ) )

                })
                .catch( err => console.log( err ))
        }

        var riavviaAutocomplete = () => {

            try {
                $( '#host' ).autocomplete( 'destroy' );
            } catch ( err ) {
                console.log( 'err' );
            }

            $( '#host' ).autocomplete({
                source : str_ricerca ,
                minLength : 2 ,
                select : function ( evt , ui ) {
                    getData( ui );
                }
            });

        }
        var campo       = $( '#campo-ricerca' ).text().trim().toLowerCase();
        var datacenter  = $( '#dc-ricerca' ).text().trim().toLowerCase();
        var str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;


        riavviaAutocomplete();

        $( '.campo' ).css({ cursor : 'pointer'}).on( 'click' , ( e ) => {

            let voce = $( e.target );
            $( '#host' ).focus().val( '' )
            $( '#campo-ricerca' ).text( voce.text() );
            campo = voce.text().trim().toLowerCase();
            str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;
            riavviaAutocomplete();

        });


        $( '.datacenter' ).css({ cursor : 'pointer' }).on( 'click' , ( e ) => {
            
            let voce = $( e.target );
            
            $( '#host' ).focus().val( '' )
            $( '#dc-ricerca' ).text( voce.text() );
            datacenter = voce.text().trim().toLowerCase();
            str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;
            riavviaAutocomplete();
        });
        
    }


})()