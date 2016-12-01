// Returns a random integer between min (included) and max (included)
const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//lightweight hashing, use only for non critical small sample data where it's
//ok to have collisions
const hash = (str) =>  str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0)


//generates short id of a given length, pseudo-random
const generateShortId = ({length = 8} = {}) => {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let shortId = ''

  for (let i = 0; i < length; i++) {
    shortId += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
  }

  return shortId
}

export {
  rnd,
  hash,
  generateShortId,
}
