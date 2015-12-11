//change in variables.scss also
const BASE_FONT_SIZE_PX = 14; //TODO: get it in runtime from the browser
const GOLDEN_RATIO = 1.61803398875;
const LINE_HEIGHT = 1.36;
const FONT_SCALE = 1.3333; //perfect fourth

const calcBaseLine = (baseFontSizePx, lineHeight) => {
  return Math.round(baseFontSizePx *  lineHeight);
};

//calculating ideal line height in rems, but that rounds nicely to pixels
const calcLineHeightRem = (baseFontSizePx, baseLine) => {
  return baseLine / BASE_FONT_SIZE_PX;
};

const baseLine = calcBaseLine(BASE_FONT_SIZE_PX, LINE_HEIGHT);
const lineHeightRem = calcLineHeightRem(BASE_FONT_SIZE_PX, baseLine);

export default Object.freeze({
  BASE_FONT_SIZE_PX: BASE_FONT_SIZE_PX,
  LINE_HEIGHT_REM: lineHeightRem,
  GOLDEN_RATIO: GOLDEN_RATIO,

  //based on width in px calulate height that follows golden ratio
  //and fits to a baseline (has round amount of base-lines)
  calculateIdealHeightInRems(widthPx) {
    const heightPx = widthPx / this.GOLDEN_RATIO;
    const baseLineHeightPx = this.BASE_FONT_SIZE_PX * this.LINE_HEIGHT_REM;
    const heightMultiplierRounded = Math.round(heightPx / baseLineHeightPx);

    return heightMultiplierRounded * this.LINE_HEIGHT_REM;
  },

  scaleUp(number) {
    let size = BASE_FONT_SIZE_PX;
    const toRems  = (sizePx) => (Math.round(sizePx) / BASE_FONT_SIZE_PX);

    // if (number === 1) {
    //   return toRems(size);
    // }

    for (let i = 1; i < number; i++) {
      size *= FONT_SCALE;
    }

    return toRems(size);
  },
  scaleDown(number) {

  }
});
