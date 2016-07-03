//TODO: use urlParams

const createParams = (obj) => {
  const createParam = (name) => `${encodeURIComponent(name)}=${encodeURIComponent(obj[name])}`

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

  if (!newUrl.endsWith('/')) {
    newUrl += '/'
  }

  return (newUrl += '?' + params)
}

export { addUrlParams }
