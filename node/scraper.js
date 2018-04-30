const pupp = require( "puppeteer" );
const parser = require( "./parser" );

( async() => {
	const browser = await pupp.launch();
	const page = await browser.newPage();
	await page.goto( "https://tabs.ultimate-guitar.com/tab/zac_brown_band/chicken_fried_tabs_761400" );

	let difficulty = parser.difficulty( await page.evaluate( () => document.querySelector( "div._3JgI9" ).textContent ) );
	let tuning = parser.tuning( await page.evaluate( () => document.querySelector( "#tuning" ).textContent ) );
	let tabs = parser.tabs( await page.evaluate( () => window.UGAPP.store.page.data["tab_view"]["wiki_tab"].content ) );

	console.log( difficulty, tuning );
	for ( let sec in tabs.sections ) {
		let section = tabs.sections[sec];
		console.log( sec, JSON.stringify( section ) );
		console.log( "\n\n" );
	}

	browser.close();
} )();

