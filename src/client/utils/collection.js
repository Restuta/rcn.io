import { isFunction } from './obj'

//groups given list by a property of its item, returs grouped object
const groupBy = (list, prop) =>
  list.reduce(function(grouped, item) {
    const key = isFunction(prop) ? prop.apply(this, [item]) : item[prop]
    grouped[key] = grouped[key] || []
    grouped[key].push(item)
    return grouped
  }, {})


export {
  groupBy
}
