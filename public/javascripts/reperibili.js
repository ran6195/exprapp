(()=>{
    console.log('reperibili');


    $( '.elgi' ).on( 'click' , ( e )=>{

        e.preventDefault()

        let voci = e.target.parentNode.childNodes;
        let voce = $( e.target )

        voci.forEach( el => {
            $( el ).removeClass( 'active' );
        });

        voce.addClass( 'active' );

        switch( voce.text().trim() ) {

            case 'Reperibili':
                document.location.href = '/reperibili'
                break;

            case 'Crea reperibile':
                $( '#contenitore' ).html( '' );
                break;

        }



    });

    // recupera i reperibili dal db 



    
})();