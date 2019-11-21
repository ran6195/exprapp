
(()=>{


    // Gestione del click su nome del box

    $( '.zfsa' ).on( 'click' , e => {
        e.preventDefault()
        let id = e.target.parentNode.id;
        
        axios.get('/api/zfs').then( data => console.log( data.data ) ).catch( err => console.log( err ) )
       
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
                    .then( data => {
                        $( '#contenitore' ).html( data.data ) 
                        gestioneRicercaShare()
                    })
                    .catch( err => console.log( err ) )
                break;
            

            case 'Ambiti':

                break;
        }


        //console.log( e.target.parentNode.childNodes )

    });

    // Gestione dei filtri

    //gestioneRicercaShare = () => {

        var campo       = $( '#campo-ricerca' ).text();
        var datacenter  = $( '#dc-ricerca' ).text();
        var str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;


        $( '.campo' ).css({ cursor : 'pointer'}).on( 'click' , ( e ) => {

            let voce = $( e.target );

            $( '#campo-ricerca' ).text( voce.text() );
            campo = voce.text();
            str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;
            console.log( str_ricerca )

        });


        $( '.datacenter' ).css({ cursor : 'pointer' }).on( 'click' , ( e ) => {
            
            let voce = $( e.target );
            
            $( '#dc-ricerca' ).text( voce.text() );
            datacenter = voce.text();
            str_ricerca = `/api/ricerca_zfs_shares?campo=${campo}&datacenter=${datacenter}`;
            console.log( str_ricerca );
        });

        $( '#host' ).autocomplete({
            source : str_ricerca ,
            minLength : 1
        });
    //}


})()