const inputElement = document.getElementsByClassName( "query-input" )[0];
const dropDown = document.getElementById( "dd" );
const results = document.getElementById( "results" );
const loader = document.getElementsByClassName( "loader" )[0];
let currentSelection;

function onResultsClick( e ) {
    let clicked = e.target;
    if ( clicked && clicked === results ) {
        return;
    }

    if ( clicked.tagName.toLowerCase() !== "li" ) {
        onResultsClick( { target: clicked.parentElement } );
        return;
    }

    selectResult( clicked );
}

function selectResult( selection ) {
    deselectResult( currentSelection );
    currentSelection = selection;
    selection.children[0].classList.add( "hide" );
    selection.children[1].classList.add( "hide" );
}

function deselectResult( selection ) {
    if ( selection ) {
        selection.children[0].classList.remove( "hide" );
        selection.children[1].classList.remove( "hide" );
    }
}

results.addEventListener( "click", onResultsClick );

inputElement.addEventListener( "input", function( e ) {
    if ( e.srcElement.value.length < 1 ) {
        clearDropDown();
        dropDown.classList.remove( "show" );
        return;
    }

	getAutoComplete( e.srcElement.value, function( x ) {
        updateDropDown( x );
        showDropDown();
    } );
} );

inputElement.addEventListener( "focus", function() {
    if ( document.activeElement === inputElement ) {
        if ( dropDown.firstChild ) {
            showDropDown();
        }
    }
} );

inputElement.addEventListener( "keydown", function( e ) {
    if ( e.keyCode === 13 ) {
        getQuery( inputElement.value );
        dropDown.classList.remove( "show" );
    }
} );

dropDown.addEventListener( "click", function( e ) {
    inputElement.value = e.srcElement.innerText;
    dropDown.classList.remove( "show" );
    getQuery( inputElement.value );
} );

function clearDropDown() {
    while ( dropDown.firstChild ) {
        dropDown.removeChild( dropDown.firstChild );
    }
}

function updateResults( res ) {
    if ( !res || !results ) {
        return;
    }

    if ( !Array.isArray( res ) ) {
        res = [res];
    }

    while ( results.firstChild ) {
        results.removeChild( results.firstChild );
    }

    loader.classList.remove( "show" );

    let result;
    let rsheader;
    let resultmeta;
    let resultrating;
    let resultrates;
    let current;
    let rsheaderDiv;

    for ( let i = 0; i < res.length; i++ ) {
        current = res[i];

        result = document.createElement( "LI" );
        result.classList.add( "result" );
        rsheader = document.createElement( "a" );
        rsheader.appendChild( document.createTextNode( current.name + " - " + current.artist ) );
        rsheader.classList.add( "result-header" );
        rsheaderDiv = document.createElement( "div" );
        rsheaderDiv.classList.add( "result-header-container" );
        rsheaderDiv.appendChild( rsheader );
        result.appendChild( rsheaderDiv );
        resultmeta = document.createElement( "DIV" );
        resultmeta.classList.add( "result-meta" );
        resultrating = document.createElement( "STRONG" );
        resultrating.appendChild( document.createTextNode( "RATING: " + current.rating ) );
        resultrating.classList.add( "result-rating" );
        resultrates = document.createElement( "STRONG" );
        resultrates.appendChild( document.createTextNode( current.numberRates + " RATES" ) );
        resultrates.classList.add( "result-rates" );

        resultmeta.appendChild( resultrating );
        resultmeta.appendChild( resultrates );
        result.appendChild( resultmeta );

        results.appendChild( result );
    }
}

function updateDropDown( suggestions ) {
    clearDropDown();
    let loopValue = suggestions.length < 10 ? suggestions.length : 10; 

    for ( let i = 0; i < loopValue; i++ ) {
        let a = document.createElement( "A" );
        a.appendChild( document.createTextNode( suggestions[i] ) );
        a.classList.add( "dropbtn" );
        dropDown.appendChild( a );
    }
}

function getQuery( query ) {
    while ( results.firstChild ) {
        results.removeChild( results.firstChild );
    }
    loader.classList.add( "show" );

    let client = new HttpClient();
    client.get( "http://localhost:8080/query?query=" + encodeURIComponent( query ), function( res ) {
        if ( res ) {
            updateResults( JSON.parse( res ) );
        }
    } );
}

function getAutoComplete( string, callback ) {
    string = string.slice( 0, 4 ).replace( " ", "_" );
	let client = new HttpClient();
	client.get( "http://localhost:8080/autocomplete?text=" + encodeURIComponent( string ), function( res ) {
        if ( res ) {
            callback( JSON.parse( res ) );
        }
	} );
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
}

window.onclick = function( event ) {
  if ( !event.target.matches( '.dropbtn' ) && event.target !== inputElement ) {
    var dropdowns = document.getElementsByClassName( "dropdown-content" );
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if ( openDropdown.classList.contains('show') ) {
            openDropdown.classList.remove('show');
        }
    }
  }
  let li = !getParentResult( event.target );

  if ( li ) {
    deselectResult( currentSelection );
  }
}

function getParentResult( elem ) {
    if ( elem.tagName.toLowerCase() === "li" ) {
        return elem;
    }

    if ( !elem.parentElement ) {
        return null;
    }
    return getParentResult( elem.parentElement );
}

function showDropDown() {
    if ( !loader.classList.contains( "show" ) ) {
        dropDown.classList.add('show');
    }
}