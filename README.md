## A NodeJS project that gives you a much cleaner API when working with data from [Ultimate Guitar](https://www.ultimate-guitar.com/).

### Features:
- Provides the ability to query UG's auto-complete API that returns an array of recommended links.
- Given a link to a song, you can parse all of it's meta data in one nice JSON file as documented below.
- The tablature gets parsed into sections, which in turn are sliced by measures, which encapsulate every given time step.

### Usage:
- Clone or [Download](https://github.com/McCrearyD/GuitarTabsParser/archive/master.zip) the source.
- The relevent file to require is "[scraper.js](https://github.com/McCrearyD/GuitarTabsParser/blob/master/node/scraper.js)".
- [scraper.js](https://github.com/McCrearyD/GuitarTabsParser/blob/master/node/scraper.js) contains the async method "getSong(...)" which takes a link to a UG song as a parameter, and calls the callback with a JSON object with the format mentioned below.

### Demo:
- The file [main.js](https://github.com/McCrearyD/GuitarTabsParser/blob/master/node/main.js) contains a demo server that can be interacted with via the [index.html](https://github.com/McCrearyD/GuitarTabsParser/blob/master/index.html) HTML file.
- The demo shows off the auto-complete, and query search by displaying all songs related to your search string. You can also parse the given song on the fly by clicking on it.

### Auto-Complete

<p align="center">
  <img src="https://i.gyazo.com/df6a893a6ab615fad42d02c559d3c714.png">
</p>

### Results Display

<p align="center">
  <img src="https://i.gyazo.com/e9d757fb8c08cebd7ffc08c52f82e0c7.png">
</p>

### Actions:
- Original: Brings you to the actual tablature.
- Formatted: Displays the raw parsed JSON.

<p align="center">
  <img src="https://i.gyazo.com/42957f8d71463eb23a2f247626481752.png">
</p>

### JSON Format
```json
{
  "artist": "Artist Name",
  "song_name": "Song Name",
  "tab_url": "https://www.ultimate-guitar.com/",
  "difficulty": "beginner",
  "tuning": [ "E", "A", "D", "G", "B", "E" ],
  "raw_tabs": "...",
  "parsed_tabs": {
    "order": [ "Chorus", "Verse 1", "Verse 2" ],
    "sections": {
      "Chorus": {
        "measures": [
          {
            "steps": [ 
              {
                "string_1": "3",
                "string_2": "2",
                "string_3": "0",
                "string_4": "0",
                "string_5": "3",
                "string_6": "3",
                "chord": "G"
              },
              null
            ]
          }
        ]
      },
      "Verse 1": { "...": "..." },
      "Verse 2": { "...": "..." }
    }
  }
}
```
