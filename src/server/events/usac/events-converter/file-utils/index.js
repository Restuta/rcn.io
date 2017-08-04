const fs = require('fs')
const prettier = require('prettier')

/* Wrappers for node-fs function that return promises and write JSON to files
*/

function writeJsonToFile(file, obj) {
  return new Promise((resolve, reject) => {
    let str = ''

    try {
      str = JSON.stringify(obj, null, 2) + '\n'
      str = prettier.format(str, { parser: 'json' })
    } catch (err) {
      reject(err)
    }

    fs.writeFile(file, str, {}, (err) => {
      if (err) reject(err)

      resolve(file)
    })
  })
}

function appendJsonToFile(file, obj) {
  return new Promise((resolve, reject) => {
    let str = ''

    try {
      str = JSON.stringify(obj, null, 2) + '\n'
      str = prettier.format(str, { parser: 'json' })
    } catch (err) {
      reject(err)
    }

    fs.appendFile(file, str, {}, (err) => {
      if (err) reject(err)

      resolve(file)
    })
  })
}

module.exports = {
  writeJsonToFile,
  appendJsonToFile
}
