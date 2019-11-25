
(()=>{

    var schede = ['cluster','pools','projects','shares']

    var dataTableOptions = {
        "language": {
            "url": "/javascripts/italiana.json"
        }
    }


    // Gestione del click su nome del box

    $( '.zfsa' ).on( 'click' , e => {
        e.preventDefault()
        $( '#contenitore' ).html( '' )
        displayLoader()
        let id = e.target.parentNode.id;
        $( '.loader' ).css({ display : 'block' })
        axios.get('/api/zfs' , { params : { id : id } } )
            .then( response => {
                window.sessionStorage.applianceData = JSON.stringify( response.data ); 
                axios.post( '/zfsappliancedetails' , { appliance : response.data } )
                    .then( response => {
                        $( '#contenitore' ).html( response.data )
                        $( '.loader' ).css({ display : 'none' })
                        zfsDetailsMenuHandler();

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



    // Gestione della navigazione nella pagina di dettaglio degli ZFS
    var displayLoader = () => {
        $( '#loader' ).css({ display : 'block' })
    }

    var hideLoader = () => {
        $( '#loader' ).css({ display : 'none' })
    }

    var zfsDetailsMenuHandler = () => {

        $( '.zfsd' ).on( 'click' , ( e ) => {
            e.preventDefault();


           $( '.zfsd' ).removeClass( 'active' )
   

            $( e.target ).addClass( 'active' )

            let getPoolsDetails = () => {
                //recupero le info sull'appliance da window local storage

                let applianceDetails = JSON.parse( window.sessionStorage.applianceData );
                
                displayLoader()
                $( '#dettagli' ).html( '' )
                axios.post( '/zfspoolsdetails' , { applianceDetails } )
                    .then( response => {
                        window.sessionStorage.pools = JSON.stringify( response.data )
                        axios.post( '/poolsdetails' , { pools : response.data } )
                            .then( response => {
                                $( '#dettagli' ).html( response.data );
                               
                                hideLoader()
                            })
                            .catch( err => console.log( err ))
                    })
                    .catch( err => console.log( err ) )
            }

            let getProjects = () => {
                const pools = JSON.parse( sessionStorage.pools )
                const appliance = JSON.parse( sessionStorage.applianceData )

                displayLoader()
                $( '#dettagli' ).html( '' );

                axios.post( '/zfsprojects' , { pools , appliance } )
                    .then(response => axios.post( 'dettagli_projects' , { projects : response.data })
                        .then(response => {
                            $( '#dettagli' ).html( response.data )
                            $( '#projects' ).DataTable( dataTableOptions )
                            hideLoader()
                        })
                        .catch( err => console.log( err )))
                    .catch( err => console.log( err ))
    
            }


            let getShares = () => {

                const appliance = JSON.parse( sessionStorage.applianceData );

                displayLoader()
                $( '#dettagli' ).html( '' )

                axios.post( '/zfsshares' , { appliance } )
                    .then(response => {
                        axios.post( '/dettagli_shares' , { shares : response.data } )
                            .then(response => {
                                $( '#dettagli' ).html( response.data )
                                hideLoader()
                                handleShareNFS()
                                $( '#shares' ).DataTable( dataTableOptions )
                            })
                            .catch( err => console.log( err ))
                    })
                    .catch(err => console.log( err ))

            }


            let handleShareNFS = () => {

                $(()=>$('[data-toggle="tooltip"]').tooltip())

                $( '.fa-network-wired' ).css({ cursor : 'pointer' }).on( 'click' , e => {
                    console.log( e.target.parentNode.parentNode
                        .childNodes )
                })
            }

            switch( $( e.target ).text().trim().toUpperCase() ) {
                case 'POOLS':
                    getPoolsDetails()    
                break;

                case 'PROJECTS':
                    getProjects()
                break;

                case 'SHARES':
                    getShares()
                break;
            }




        });
    };

})()