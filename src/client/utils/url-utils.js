const createParams = (obj) => {
  const createParam = (name) => {
    const toNameValueString = (name, value) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    const value = obj[name]

    return Array.isArray(value)
      ? value.map(v => toNameValueString(name, v)).join('&')
      : toNameValueString(name, value)
  }


  return Object.keys(obj)
    .map(key => {
      return createParam(key)
    })
    .join('&')
}


// Creates new url with parameters inferred from an object treated as key-value pair.
const addUrlParams = (url, objParams) => {
  let newUrl = url
  let params = createParams(objParams)

  if (!newUrl.includes('?')) {
    newUrl += '?' + params
  } else {
    newUrl += '&' + params
  }

  return newUrl
}

const getDomain = url => {
  if (!url) return ''

  let domain
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2]
  } else {
    domain = url.split('/')[0]
  }

  if (url.indexOf('www.') > -1) {
    domain = domain.split('www.')[1]
  }

  //find & remove port number
  domain = domain.split(':')[0]

  return domain
}

const removeHttpAndWww = url => url.replace(/.*?:\/\/(www\d?.)?/g, '')

//gets url without http, www and trailing /
const getShorterUrl = url => {
  if (!url) return ''

  let resultUrl = removeHttpAndWww(url)

  if (resultUrl.endsWith('/')) {
    resultUrl = resultUrl.slice(0, -1) //remove last symbol
  }

  return resultUrl
}


export { addUrlParams, getDomain, removeHttpAndWww, getShorterUrl }
