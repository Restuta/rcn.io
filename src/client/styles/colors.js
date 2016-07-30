const grey = {
  grey50:  '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey350: '#D3D3D3', //lightgrey
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
}

const purple = {
  deepPurple50: '#EDE7F6',
  deepPurple100: '#D1C4E9',
  deepPurple200: '#B39DDB',
  deepPurple300: '#9575CD',
  deepPurple400: '#7E57C2',
  deepPurple500: '#673AB7',
  deepPurple600: '#5E35B1',
  deepPurple700: '#512DA8',
  deepPurple800: '#4527A0',
  deepPurple900: '#311B92',
}

const red = {
  red50: '#ffebee',
  red100: '#ffcdd2',
  red200: '#ef9a9a',
  red300: '#e57373',
  red400: '#ef5350',
  red500: '#f44336',
  red600: '#e53935',
  red700: '#d32f2f',
  red800: '#c62828',
  red900: '#b71c1c',
}

const colors = {
  ...grey,

  bodyBg: '#FCFCFC',

  brownMud: 'rgba(160,82,45,1)', //'SIENNA',
  brownMudDimmed: 'rgba(160,82,45,0.60)',

  ...purple,
  primary: purple.deepPurple400,
  ...red,
}


const event = {
  status: {
    past: colors.grey500,
    cancelled: colors.grey400,
    moved: colors.grey400
  },
  road: {
    criterium: '#00BF10',
    roadRace: '#2196F3',
    circuitRace: '#FFA726',
    timeTrial: colors.red500,
    hillClimb: colors.red700,
  },
  mtb: {
    'default': colors.brownMud,
  }
}

//update matching variables in variables.scss
export default Object.freeze({
  ...colors,

  event
})
