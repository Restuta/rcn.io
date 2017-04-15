import Perf from 'react-addons-perf'

export default store => next => action => {
  const key = `performance:${action.type}`
  Perf.start()

  // will re-render the application with new state
  const result = next(action)
  Perf.stop()

  console.group(key) //eslint-disable-line
  console.info('wasted') //eslint-disable-line
  Perf.printWasted()
  // any other Perf measurements you are interested in

  console.groupEnd(key) //eslint-disable-line
  return result
}
