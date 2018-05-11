let ugURL;
let body = document.getElementById( "body" );
const loader = document.getElementsByClassName( "loader" )[0];

function formatRequest( uri ) {
	uri = decodeURIComponent( uri );

	let output = { 
		url: uri 
	};

	output.type = /#(.*)\?/.exec( uri )[1];
	output.args = {};
	let raw = uri.slice( uri.indexOf( output.type ) + output.type.length + 1, uri.length ).split( "&" );

	for ( let i in raw ) {
		let keyVal = raw[i].split( "=" );
		if ( keyVal.length == 2 ) {
			output.args[keyVal[0]] = keyVal[1];
		}
	}
	return output;
}

var HttpClient = function() {
    this.get = function( aUrl, aCallback ) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
};

( function( href ) {
	let formatted = formatRequest( href );
	let args = formatted.args;
	if ( !args || !args.artist || !args.song_identifier ) {
		// TODO no results page
		return;
	}

	let client = new HttpClient();
    client.get( "http://localhost:8080/parse?artist=" + encodeURIComponent( args.artist ) + "&song_identifier=" + encodeURIComponent( args.song_identifier ), function( res ) {
    	loader.classList.remove( "show" );
    	body.innerText = res;
    } );
} )( window.location.href );