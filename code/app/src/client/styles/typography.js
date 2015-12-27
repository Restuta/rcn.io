//change in variables.scss also
const BASE_FONT_SIZE_PX = 14; //TODO: get it in runtime from the browser
const GOLDEN_RATIO = 1.61803398875;
const LINE_HEIGHT = 1.285714286;
const FONT_SCALE = 1.3333; //perfect fourth
//calculating ideal line height in rems, but that rounds nicely to pixels, that's why we need rounding
const BASE_LINE = Math.round(BASE_FONT_SIZE_PX * LINE_HEIGHT);
const LINE_HEIGHT_REM = BASE_LINE / BASE_FONT_SIZE_PX;

//font operations
const scaleUpOperation = (size, scale) => size * scale;
const scaleDownOperation = (size, scale) => size / scale;

const scale = (number, scaleOperation) => {
  let size = BASE_FONT_SIZE_PX;
  const toRems  = (sizePx) => (Math.round(sizePx) / BASE_FONT_SIZE_PX);

  for (let i = 1; i < number; i++) {
    size = scaleOperation(size, FONT_SCALE);
  }

  return toRems(size);
};

export default Object.freeze({
  BASE_FONT_SIZE_PX: BASE_FONT_SIZE_PX,
  LINE_HEIGHT_REM: LINE_HEIGHT_REM,
  GOLDEN_RATIO: GOLDEN_RATIO,

  //ideal means one that fints baseline and converts to round pixels
  roundToIdealRems(heightPx) {
    const baseLineHeightPx = this.BASE_FONT_SIZE_PX * this.LINE_HEIGHT_REM;
    const heightMultiplierRounded = Math.round(heightPx / baseLineHeightPx);

    return heightMultiplierRounded * this.LINE_HEIGHT_REM;
  },
  //based on width in px calulate height that follows golden ratio
  //and fits to a baseline (has round amount of base-lines)
  calculateIdealHeightInRems(widthPx) {
    const heightPx = widthPx / this.GOLDEN_RATIO;
    return this.roundToIdealRems(heightPx);
  },

  scaleUp(number) {
    return scale(number, scaleUpOperation);
  },
  scaleDown(number) {
    return scale(number, scaleDownOperation);
  },
  pxToRem(pixels) {
    return (pixels / BASE_FONT_SIZE_PX);
  }
});
