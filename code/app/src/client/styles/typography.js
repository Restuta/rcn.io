//change in variables.scss also
const BASE_FONT_SIZE_PX = 9 //TODO: get it in runtime from the browser
const GOLDEN_RATIO = 1.61803398875
const FONT_SCALE = 1.25  //9, 11, 14, 18, 23, 29, 36, 45

//calculating ideal line height in rems, but that rounds nicely to pixels, that's why we need rounding
const getLineHeightInRem = () => {
  // const LINE_HEIGHT = 1.285714286;
  // const BASE_LINE = Math.round(BASE_FONT_SIZE_PX * LINE_HEIGHT);
  // return BASE_LINE / BASE_FONT_SIZE_PX
  //hardcoding for 9px font size to get round rems like 0.5,1,2,3
  return 2
}

const LINE_HEIGHT_REM = getLineHeightInRem()

//font operations
const scaleUpOperation = (size, scale) => size * scale
//const scaleDownOperation = (size, scale) => size / scale;

const scale = (number, scaleOperation) => {
  let size = BASE_FONT_SIZE_PX
  const toRems  = (sizePx) => (Math.round(sizePx) / BASE_FONT_SIZE_PX)

  for (let i = 1; i < number; i++) {
    size = scaleOperation(size, FONT_SCALE)
  }

  return toRems(size)
}

export default Object.freeze({
  BASE_FONT_SIZE_PX: BASE_FONT_SIZE_PX,
  //line height in rems
  LINE_HEIGHT_REM: LINE_HEIGHT_REM,
  HALF_LINE_HEIGHT_REM: LINE_HEIGHT_REM / 2,
  GOLDEN_RATIO: GOLDEN_RATIO,

  //ideal means one that fints baseline and converts to round pixels
  roundToIdealRems(heightPx) {
    const baseLineHeightPx = this.BASE_FONT_SIZE_PX * this.LINE_HEIGHT_REM
    const heightMultiplier = heightPx / baseLineHeightPx

    return Math.round(heightMultiplier * this.LINE_HEIGHT_REM)
  },
  scaleUp(number) {
    return scale(number, scaleUpOperation)
  },
  pxToRem(pixels) {
    return (pixels / BASE_FONT_SIZE_PX)
  }
})
