const pupp = require( "puppeteer" );
const parser = require( "./parser" );

( async() => {
	const browser = await pupp.launch();
	const page = await browser.newPage();
	await page.goto( "https://tabs.ultimate-guitar.com/tab/zac_brown_band/chicken_fried_tabs_761400" );

	let song = await page.evaluate( () => { 
			let tab_view = window.UGAPP.store.page.data.tab_view;
			let tab = window.UGAPP.store.page.data.tab;
			let tuning = tab_view.meta.tuning;
			let difficulty = tab_view.meta.difficulty;

			if  ( !tuning ) {
				tuning = [ "E", "A", "D", "G", "B", "E" ];
			} else {
				tuning = tuning.value.split( " " );
			}

			if ( !difficulty ) {
				difficulty = "unknown";
			}

			return {
				artist: tab.artist_name,
				song_name: tab.song_name,
				tab_url: tab.tab_url,
				difficulty: difficulty,
				tuning: tuning,
				tabs: tab_view.wiki_tab.content
			}
		} );
	song.tabs = parser.tabs( song.tabs );

	console.log( song );
	console.log( JSON.stringify( song.tabs.sections["Verse 1"].measures[0] ) );
	browser.close();
} )();

