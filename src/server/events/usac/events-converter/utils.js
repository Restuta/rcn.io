const { first } = require('lodash/fp')

const preProcessUrl = (rawUrl) => {
  if (rawUrl) {
    if (rawUrl.startsWith('http') || rawUrl.startsWith('https')) {
      return rawUrl
    } else {
      return 'http://' + rawUrl
    }
  } else {
    return ''
  }
}

const toUpperCaseFirst = string => first(string).toUpperCase() + string.slice(1)

const normalizeSpaces = string =>
  string.trim()
    .replace('    ', ' ')
    .replace('   ', ' ')
    .replace('  ', ' ')


module.exports = {
  preProcessUrl,
  normalizeSpaces,
  toUpperCaseFirst
}
