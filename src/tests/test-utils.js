import tapeTest from 'tape'

const createTest = (groupName) => {
  return (name, testBody) => {
    tapeTest(groupName + ': ' + name, testBody)
  }
}

export { createTest }
