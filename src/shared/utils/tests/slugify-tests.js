import { createTest } from 'tests/test-utils'
import slugify from 'shared/utils/slugify'


const test = createTest('Slugify')

test('correctly slugifyes given string', t => {
  const testCases = [
    { text: 'Test Name #1 @2 $3 - 4 ', expected: 'test-name-1-2-3-4' },
    { text: 'Test    Name      -', expected: 'test-name' },
    { text: '  Test   Name ', expected: 'test-name' },
    { text: 'Test------Name ', expected: 'test-name' },
    { text: 'Test---$##@^%*&()+=?---Name ', expected: 'test-name' },
    { text: 'Test/Name p/b bla', expected: 'testname-pb-bla' },
    { text: "88th Mike's Cat's ", expected: '88th-mikes-cats' },
  ]

  testCases.forEach((testCase, i) => {
    t.equal(slugify(testCase.text), testCase.expected,
    `#${i + 1} "${testCase.text}" => "${testCase.expected}"`)
  })

  t.end()
})
