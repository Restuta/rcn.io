//converts location object to address string in a common format like:
//888 Market St, San Francisco, CA 94102
const locationToAddressStr = ({streetAddress = '', city = '', state = '', zip = ''}) => {
  let addressArr = []
  const pushIfNotEmpty = prop => (prop && addressArr.push(prop))

  pushIfNotEmpty(streetAddress)
  pushIfNotEmpty(city)
  pushIfNotEmpty(state)

  return (addressArr.join(', ') + ' ' + zip).trim()
}

export {
  locationToAddressStr
}
