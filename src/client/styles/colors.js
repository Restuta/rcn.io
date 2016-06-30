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

//update matching variables in variables.scss
export default Object.freeze({
  ...grey,

  bodyBg: '#FCFCFC',

  brownMud: 'rgba(160,82,45,1)', //'SIENNA',
  brownMudDimmed: 'rgba(160,82,45,0.60)',

  ...purple,
  primary: purple.deepPurple400,
})
