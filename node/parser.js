module.exports = {
	tabs: function( content ) {
		return parse( content );
	}
};

function getOrder( content ) {
	let order = content.match( /\[.*\]/gm );

	for ( let i in order ) {
		order[i] = order[i].replace( "[", "" ).replace( "]", "" );
	}

	return order;
}

function parse( content ) {
	let output = {};

	output.order = getOrder( content );
	output.sections = {};
	let count = 0;

	for ( let i in output.order ) {
		let sec = output.order[i];

		if ( sec === "order" ) {
			throw new Error( "Section name cannot be \'" + sec + "\'." );
		}

		output.sections[sec] = parseSection( sec, content );
		count++;
	}

	output.all_measures = parseSection( 0, content );

	return output;
}

function parseSection( section, content, endLine ) {
	let temp;

	if ( typeof section != typeof 5 ) {
		let re = new RegExp( "\\[" + section + "\\].*([^\\0]*?)(?:\\[|\\*{36})", "i" );
		temp = re.exec( content );
		if ( !temp ) {
			return;
		}
	} else {
		content = content.slice( section, endLine ? ( typeof endLine == typeof 5 ? endLine : content.length ) : content.length );
	}

	let inner = temp ? temp[1] : content;
	inner = inner.split( "\n" );

	let measures = [];
	let measure = {};
	let step = {};
	let broke = false;
	let count = 0;
	let notes = [];
	let measureCount = 0;

	for ( let i = 0; i < inner.length; i++ ) {
		let line = inner[i];
		let previous = null;

		if ( i - 1 >= 0 ) {
			previous = inner[i-1];
		}

		if ( line.length > 0 ) {
			if ( /^.*\|/.test( line ) ) {
				measure = {};
				measure.steps = [];

				let hasStarted = false;

				for ( let c = line.indexOf( "|" ) + 1; c < line.length; c++ ) {
					step = {};
					broke = false;
					count = 0;

					for ( let j = i; j <= i + 6; j++ ) {
						let innerLine = inner[j];
						let character;
						if ( innerLine && innerLine.length > c ) {
							character = innerLine[c];
						} else {
							character = "-";
						}

						if ( character !== "|" ) {
							hasStarted = true;
						} else {
							broke = true;
							break;
						}

						if ( character && character !== "-" ) {
							step["string_" + ( 6 - ( j - i ) )] = character;
							count ++;
						}
					}

					if ( !broke ) {
						if ( count > 0 ) {
							measure.steps.push( step );
						} else {
							measure.steps.push( null );
						}
					} else if ( hasStarted ) {
						if ( measure.steps.length > 0 ) {
							measures.push( measure );
							measureCount++;
						}
						
						measure = {};
						measure.steps = [];
					}
				}
				
				i+=6;
			} else if ( !line.startsWith( "    " ) ) {
				notes.push( { 
					line: line,
					"previous-measure": measureCount
				} );
			}
		}
	}

	return { 
		measures: measures,
		notes: notes
	};
}