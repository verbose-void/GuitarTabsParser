const request = require('request')
const utils = require('./utils')

function search ( query, callback, requestOptions ) {
  requestOptions = requestOptions || {}
  query = utils.formatSearchQuery(query)
  requestOptions.url = 'http://www.ultimate-guitar.com/search.php?' + utils.encodeParams(query)
  request(requestOptions, (error, response, body) => {
    if (error) {
      callback(error, null, response, body)
    } else if (response.statusCode !== 200) {
      callback(new Error('Bad response'), null, response, body)
    } else {
      const tabs = utils.parseListTABs(body)
      callback(null, tabs, response, body)
    }
  })
}

function autocomplete (query, callback, requestOptions) {
  requestOptions = requestOptions || {}
  query = query.toLowerCase()
  const letter = query[0]
  requestOptions.url = 'https://www.ultimate-guitar.com/static/article/suggestions/' + letter + '/' + encodeURIComponent( query ) + '.js'
  request(requestOptions, (error, response, body) => {
    if (error) {
      callback(error, null, response, body)
    } else if (response.statusCode !== 200) {
      callback(new Error('Bad response'))
    } else {
      try {
        const results = JSON.parse(body)
        if (results.hasOwnProperty('suggestions')) {
          callback(null, results['suggestions'], response, body)
        } else {
          callback(new Error('Bad response'), null, response, body)
        }
      } catch (e) {
        callback(new Error('Bad response'), null, response, body)
      }
    }
  })
}

function get (tabUrl, callback, requestOptions) {
  requestOptions = requestOptions || {}
  requestOptions.url = tabUrl
  request(requestOptions, (error, response, body) => {
    if (error) {
      callback(error, null, response, body)
    } else if (response.statusCode !== 200) {
      callback(new Error('Bad response'), null, response, body)
    } else {
      const tab = utils.parseSingleTAB(body, tabUrl)
      if (tab) {
        callback(null, tab, response, body)
      } else {
        callback(new Error("Can't parse TAB"), null, response, body)
      }
    }
  })
}

module.exports = {
  search,
  autocomplete,
  get
}