import ExecutionEnvironment from 'exenv'


export const appendUrl = (url) => {
  //there is no point of working with pushState if there is no DOM
  if (!ExecutionEnvironment.canUseDOM) {
    return
  }

  //history API behaves differntly if current url ends with "/" or not, so it's safer
  //to use absolute url
  const currentLocation = window.location.href


  if (currentLocation.endsWith('/')) {
    window.history.pushState(null, null, `${currentLocation}${url}`)
  } else {
    window.history.pushState(null, null, `${currentLocation}/${url}`)
  }
}
