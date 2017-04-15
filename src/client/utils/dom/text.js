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

function selectAllText({elementId, start, end}) {
  const textField = document.getElementById(elementId)

  if (document.body.createTextRange) {
    let range = document.body.createTextRange()
    range.moveToElementText(textField)
    range.moveStart('character', start)
    range.moveEnd('character', end)
    range.select()
  } else if (window.getSelection) {
    let selection = window.getSelection()
    let range  = document.createRange()
    range.selectNodeContents(textField)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}


export {
  selectTextSegment,
  selectAllText
}
