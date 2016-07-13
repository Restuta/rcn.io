
//change in variables.scss also
const BASE_FONT_SIZE_PX = 8 //TODO: get it in runtime from the browser
//for 10px: 10, 13, 16, 20, 24, 31, 38
//for 9px:   9, 11, 14, 18, 23, 29, 36
//for 8px:   8, 10, 13, 16, 20, 24, 31, 38, 48, 57 (1.25)
//for 8px:   8, 11, 14, 19, 25, 34, 45 (1.333)


//const FONT_SCALE = 1.28
const FONT_SCALE = 1.25

//calculating ideal line height in rems, but that rounds nicely to pixels, that's why we need rounding
const getLineHeightInRem = () => {
  /* rcn baseline works by setting the root font-size as half the line-height of the standard paragraph text.
   The height of the baseline grid is then effectively set at 2rem, with increments at each 1rem. This makes it nice
   and easy to work proportionally from the baseline with integer rem values to create harmony in your layout and
   typography. This is based off a technique for setting text in print documents. */

  //hardcoding for 8px font size to get round rems like 0.5,1,2,3
  return 2
}

const LINE_HEIGHT_REM = getLineHeightInRem()

//font operations
const scaleUpOperation = (size, scale) => size * scale
//const scaleDownOperation = (size, scale) => size / scale;

const scale = (number, scaleOperation) => {
  const scaleTo = number + 1

  let size = BASE_FONT_SIZE_PX
  const toRems  = (sizePx) => (Math.round(sizePx) / BASE_FONT_SIZE_PX)

  for (let i = 1; i < scaleTo; i++) {
    size = scaleOperation(size, FONT_SCALE)
  }

  return toRems(size)
}

export const pxToRem = pixels => (pixels / BASE_FONT_SIZE_PX)
export const scaleUp = number => scale(number, scaleUpOperation)


export default Object.freeze({
  BASE_FONT_SIZE_PX: BASE_FONT_SIZE_PX,
  //line height in rems
  LINE_HEIGHT_REM: LINE_HEIGHT_REM,
  HALF_LINE_HEIGHT_REM: LINE_HEIGHT_REM / 2,

  //ideal means one that fints baseline and converts to round pixels
  roundToIdealRems(heightPx) {
    const baseLineHeightPx = this.BASE_FONT_SIZE_PX * this.LINE_HEIGHT_REM
    const heightMultiplier = heightPx / baseLineHeightPx

    return Math.round(heightMultiplier * this.LINE_HEIGHT_REM)
  },
  /* gets next value of the font size on modular scale in rems
    "number" means order on modular scale, starts from 1 */
  scaleUp,
  pxToRem,
})
