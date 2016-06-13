import tapeTest from 'tape'
import { zeroPad } from '../formatting'

const testFactory = (groupName) => {
  return (name, testBody) => {
    tapeTest(groupName + ': ' + name, testBody)
  }
}

const test = testFactory('Utils')

test('zeroPad when (1, 2) is passed', t => {
  const result = zeroPad(1, 2)

  t.equal(result, '01', 'should output "01"')
  t.end()
})

test('zeroPad when (22, 2) is passed', t => {
  const result = zeroPad(22, 2)

  t.equal(result, '22', 'should output "22"')
  t.end()
})


test('zeroPad when (2, 3) is passed', t => {
  const result = zeroPad(2, 3)

  t.equal(result, '002', 'should output "002"')
  t.end()
})
