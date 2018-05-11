const index = require( "./ugs/index" );
const scraper = require( "./scraper" );
const http = require( "http" );

http.createServer( function( request, response ) {
	let formatted = formatRequest( request.url );
	response.writeHead( 200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' } ); // TODO add specific source

	if ( formatted.type.toLowerCase() === "autocomplete" ) {
		if ( formatted.args.text ) {
			index.autocomplete( formatted.args.text, function( a, b ) {
				if ( !a && b && b.length > 0 ) {
					response.write( JSON.stringify( b ) )
				}

				response.end();
			} );
		} else {
			response.end();
		}
	} else if ( formatted.type.toLowerCase() === "query" ) {
		if ( formatted.args.query ) {
			formatted.args.type = "Tab"; // TODO make parser compatible with Chords types as well.
			index.search( formatted.args, function( a, b ) {
				if ( !a && b ) {
					if ( Array.isArray( b ) ) {
						b = b.sort( function( elem1, elem2 ) {
							return ( elem2.rating * elem2.numberRates ) - ( elem1.rating * elem1.numberRates );
						} );
					}


					response.write( JSON.stringify( b ) );
				}

				response.end();
			} );
		} else {
			response.end();
		}
	} else if ( formatted.type.toLowerCase() === "parse" ) {
		let args = formatted.args;

		if ( args && args.artist && args.song_identifier ) {
			scraper.getSong( "https://tabs.ultimate-guitar.com/tab/" + args.artist + "/" + args.song_identifier, function( song ) {
				response.write( JSON.stringify( song.parsed_tabs ) );
				response.end();
			} );
		} else {
			response.end();
		}
	} else {
		response.end();
	}

} ).listen( 8080 );

function formatRequest( uri ) {
	uri = decodeURIComponent( uri );

	let output = { 
		url: uri 
	};

	if ( !/^\/.*\?/.test( uri ) ) {
		return "";
	}

	output.type = /^\/(.*)\?/.exec( uri )[1];
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