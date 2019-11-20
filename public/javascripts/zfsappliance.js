

(()=>{

    console.log( document.location.href )

    $( '.zfsa' ).on( 'click' , e => {
        e.preventDefault()
        let id = e.target.parentNode.id;
        
        axios.get('/api/zfs').then( data => console.log( data.data ) ).catch( err => console.log( err ) )
       
    })



    $( '.zlgi' ).on( 'click' , e => {

        e.preventDefault(); 

        let voci = e.target.parentNode.childNodes;
        let voce = $( e.target );
        voci.forEach(el => {
            $( el ).removeClass( 'active' )
        });

        voce.addClass( 'active' )

        switch( voce.text() ) {
            case 'Appliance':

                document.location.href = '/zfsappliance'

                break;

            case 'Shares':

                    $( '#contenitore' ).html( '' )
                    axios.get( '/shares' )
                    .then( data => {
                        $( '#contenitore' ).html( data.data ) 
                    })
                    .catch( err => console.log( err ) )
                break;
            

            case 'Ambiti':

                break;
        }


        //console.log( e.target.parentNode.childNodes )

    });


})()