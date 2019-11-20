(()=>{
    $( '.zfsa' ).on( 'click' , e => {
        e.preventDefault()
        let id = e.target.parentNode.id;
        console.log( $.fn.jquery )
        jQuery.ajax({
            url : '/api/zfs' ,
            method : 'GET'
        })
            .then( data => console.log( data ) )
            .catch( err => console.log( err ) )

    })
})()