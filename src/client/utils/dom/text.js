function selectTextSegment({elementId, start, end}) {
  const element = document.getElementById(elementId)

  if (element.createTextRange) {
    let range = element.createTextRange()
    range.collapse(true)
    range.moveStart('character', start)
    range.moveEnd('character', end)
    range.select()
  } else if (element.setSelectionRange) {
    element.setSelectionRange(start, end)
  } else if (element.selectionStart) {
    element.selectionStart = start
    element.selectionEnd = end
  }
  element.focus()
}

function selectAllTextInElement({element, start, end}) {
  if (document.body.createTextRange) {
    let range = document.body.createTextRange()
    range.moveToElementText(element)
    range.moveStart('character', start)
    range.moveEnd('character', end)
    range.select()
  } else if (window.getSelection) {
    let selection = window.getSelection()
    let range  = document.createRange()
    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

function selectAllText({elementId, start, end}) {
  const element = document.getElementById(elementId)
  return selectAllTextInElement({element, start, end})
}


export {
  selectTextSegment,
  selectAllText,
  selectAllTextInElement
}
