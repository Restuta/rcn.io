const measurePerf = (func, description) => {
  const before = (+new Date())
  const result = func()
  const totalMs = (+new Date()) - before

  let desc = description || (func.toString())
  console.log(`"${desc}" took ${totalMs}ms"`) //eslint-disable-line

  return result
}

//wraps a function into a function that measures execution time in ms
//usefull for quick perf invistigations
const withPerf = (func, description) => {
  return (...args) => {
    return measurePerf(() => func(...args), description)
  }
}

/* usage example:
  let foo = () => {}

  foo = withPerf(foo)
*/

export {
  withPerf
}
