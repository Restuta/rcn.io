/* converts JavaScript's native Map to object */
const mapToObject = map => {
  let obj = {}

  for (let [key, value] of map.entries()) {
    obj[key] = value
  }

  return obj
}

export { mapToObject }
