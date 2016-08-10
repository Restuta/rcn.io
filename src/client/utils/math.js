// Returns a random integer between min (included) and max (included)
const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const hash = (str) =>  str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)

export {
  rnd,
  hash
}
