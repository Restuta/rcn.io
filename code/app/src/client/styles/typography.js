const GOLDEN_RATIO = 1.61803398875;
const BASE_FONT_SIZE_PX = 14;
const LINE_HEIGHT = 1.36;
const baseLine = Math.round(BASE_FONT_SIZE_PX *  LINE_HEIGHT);
//calculating ideal height in rems, but that rounds nicely to pixels
const lineHeightRem = (baseLine / BASE_FONT_SIZE_PX);

const Typography = Object.freeze({
  BASE_FONT_SIZE_PX: BASE_FONT_SIZE_PX,
  LINE_HEIGHT_REM: lineHeightRem,
  GOLDEN_RATIO: GOLDEN_RATIO
});

//calculates height in rems that is a multiple of line-heights
const calculateIdealHeightInRems = (widthPx) => {
  const heightPx = widthPx / GOLDEN_RATIO;
  const lineHeightPx = BASE_FONT_SIZE_PX * lineHeightRem;
  return Math.round(heightPx / lineHeightPx) * lineHeightRem;
};

export { calculateIdealHeightInRems };
export default Typography;
