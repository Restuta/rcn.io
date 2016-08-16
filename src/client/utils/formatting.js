/* Various formatting utils */

/* pads a number with leading zeros to minimal width, e.g.:
 (1, 2) => 01
 (22, 2) => 22
 (2, 3) => 002
 (this is peformant implementation from http://stackoverflow.com/a/1268377/119493)
*/
const zeroPad = function(number, minLength) {

  //0 is special case that can't be handled with logarithmic approach
  if (number === 0) {
    return Array(minLength).join('0')
  }

  let absNumber = Math.abs(number)
  let digitCount = 1 + Math.floor(Math.log(absNumber) / Math.LN10)

  if (digitCount >= minLength) {
    return number.toString()
  }

  let zeroString = Math.pow(10, minLength - digitCount).toString().substr(1)

  return (number < 0
    ? '-' + zeroString + absNumber
    : zeroString + absNumber
  )
}


export { zeroPad }
