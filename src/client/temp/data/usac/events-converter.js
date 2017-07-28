/*
 - converts raw USAC events to rcn.io format
 - validates them with schema
 - unit tests will be run as part of regular build enforsing additional constrains
 */


import { flow } from 'lodash/fp'
import usac2017CnRoadEvensRaw from './raw/2017-CN-road'


// main processing pipeline
flow(
  // map(convertToInternalFormat)
  // map(cleanUpEmptyFields)
  // map(validateOverSchema)
)(usac2017CnRoadEvensRaw)
