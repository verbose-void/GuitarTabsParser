const index = require( "./ugs/index" );
const scraper = require( "./scraper" );
const http = require( "http" );

/* function getBestTab( tabList ) {
	let top = {
		adv_rating: 0,
		tab: null
	};

	let cur_adv;
	let cur;
	for ( let i = 0; i < tabList.length; i++ ) {
		cur = tabList[i];
		cur_adv = cur.rating * cur.numberRates;

		if ( cur_adv > top.adv_rating ) {
			top.adv_rating = cur_adv;
			top.tab = cur;
		}
	}

	return top.tab;
}*/

/*
	index.search( { 
				query: "chicken fried",  
				page: 1, 
				type: "Tab" 
			}, ( a, b ) => console.log( getBestTab( b ) ) );
*/

http.createServer( function( request, response ) {
	let formatted = formatRequest( request.url );
	response.writeHead( 200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' } ); // TODO add specific source

	if ( formatted.type.toLowerCase() === "autocomplete" ) {
		index.autocomplete( formatted.args.text, function( a, b ) {
			if ( b && b.length > 0 ) {
				response.write( JSON.stringify( b ) )
			}

			response.end();
		} );
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