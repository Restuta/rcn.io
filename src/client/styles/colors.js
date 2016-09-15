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
  grey900: '#2F2F2F'
}

const blueGrey = {
  blueGrey50: '#ECEFF1',
  blueGrey100: '#CFD8DC',
  blueGrey200: '#B0BEC5',
  blueGrey300: '#90A4AE',
  blueGrey400: '#78909C',
  blueGrey500: '#607D8B',
  blueGrey600: '#546E7A',
  blueGrey700: '#455A64',
  blueGrey800: '#37474F',
  blueGrey900: '#263238',

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

const orange = {
  orange50: '#FFF3E0',
  orange100: '#FFE0B2',
  orange200: '#FFCC80',
  orange300: '#FFB74D',
  orange400: '#FFA726',
  orange500: '#FF9800',
  orange600: '#FB8C00',
  orange700: '#F57C00',
  orange800: '#EF6C00',
  orange900: '#E65100',
  orangeA100: '#FFD180',
  orangeA200: '#FFAB40',
  orangeA400: '#FF9100',
  orangeA700: '#FF6D00',

}

const blue = {
  blue50:  '#E3F2FD',
  blue100: '#BBDEFB',
  blue200: '#90CAF9',
  blue300: '#64B5F6',
  blue400: '#42A5F5',
  blue500: '#2196F3',
  blue600: '#1E88E5',
  blue700: '#1976D2',
  blue800: '#1565C0',
  blue900: '#0D47A1',
}

const colors = {
  ...grey,
  ...blueGrey,
  ...purple,
  ...red,
  ...blue,
  ...orange,

  bodyBg: '#FCFCFC',
  body: '#333333',

  // brownMud: 'rgba(160,82,45,0.8)', //'SIENNA',
  brownMud: '#a36d53',
  brownMudDimmed: 'rgba(160,82,45,0.60)',

  primary: purple.deepPurple400,
}

const clinicsColor = '#F06292'

const event = {
  other: {
    unknownType: colors.body,
    meeting: 'white',
    clinics: clinicsColor,
  },
  status: {
    past: colors.grey500,
    canceled: colors.grey400,
    moved: colors.grey400,
  },
  road: {
    'default': colors.primary,
    criterium: '#00BF10',
    roadRace: colors.blue500,
    circuitRace: colors.orange500,
    timeTrial: colors.red500,
    hillClimb: colors.red700,
    stageRace: colors.deepPurple400,
    omnium: colors.deepPurple400,
    clinics: clinicsColor,
  },
  mtb: {
    'default': colors.brownMud,
    defaultDimmed: colors.brownMudDimmed,
    clinics: clinicsColor,
  },
  cyclocross: {
    // 'default': colors.grey700,
    'default': '#10cec0',
    clinics: clinicsColor,
  },
  track: {
    'default': colors.grey800,
    clinics: clinicsColor,
  }
}

//update matching variables in variables.scss
export default Object.freeze({
  ...colors,

  event
})
