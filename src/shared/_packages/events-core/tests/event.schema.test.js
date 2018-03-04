const Joi = require('joi')

const eventSchema = require('../event.schema')

describe('Event Schema', () => {
  it('should validate basic event, duh!', () => {
    const { error } = Joi.validate(
      {
        id: 'test',
        name: 'test name',
        date: 'May 01 2018',
        usacPermit: '1990-1212',
        discipline: 'Road',
      },
      eventSchema
    )
    expect(error).toBeNull()
  })
})
