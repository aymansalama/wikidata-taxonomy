var request = require('request-promise-native')

function queryViaRequest (sparql, env) {
  var options = {
    uri: env.endpoint,
    method: env.post ? 'POST' : 'GET',
    qs: { // query string
      format: 'json',
      query: sparql
    }
  }
  // HTTP Authentication
  if (env.user || env.password) {
    options.auth = {}
    if (env.user) options.auth.user = env.user
    if (env.password) options.auth.password = env.password
  }

  // use axios as fallback
  if (!request) {
    if (typeof (axios) === 'function') {
      request = function (options) {
        options.url = options.uri
        options.params = options.qs
        if (options.auth) options.auth.username = options.auth.user
        return axios(options).then(r => r.data) // eslint-disable-line
      }
    } else {
      return Promise.reject(new Error('No HTTP client library enabled!'))
    }
  }

  return request(options)
}

module.exports = queryViaRequest
