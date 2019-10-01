const slugify = require('../slugify')

describe('Slugify', () => {
  it('slugifies given string', () => {
    const result = slugify('--hello#$^&*()!@+/\\:><~`"|.🍎_WHAT IS    YOUR----NAME---')
    expect(result).toEqual('hello-what-is-your-name')
  })
})
