//TODO: encapsulate back to private function when card design is done
const ContainerWidth = {
  SM: 576,
  MD: 720,
  LG: 940,
  XL: 1140
}

export default {
  ContainerWidth : ContainerWidth,

  getContainerWidth(browserWidth) {
    //should match variables from bootstrap

    const Breakpoints = {
      XS: 0,    // Extra small screen / phone
      SM: 544,  // Small screen / phone
      MD: 768,  // Medium screen / tablet
      LG: 992,  // Large screen / desktop
      XL: 1200  // Extra large screen / wide desktop
    }

    if (browserWidth <= ContainerWidth.SM) {
      return browserWidth //container becomes fluid for small size
    } else if (browserWidth > ContainerWidth.SM && browserWidth < Breakpoints.MD) {
      return ContainerWidth.SM
    } else if (browserWidth >= Breakpoints.MD && browserWidth < Breakpoints.LG) {
      return ContainerWidth.MD
    } else if (browserWidth >= Breakpoints.LG && browserWidth < Breakpoints.XL) {
      return ContainerWidth.LG
    } else if (browserWidth >= Breakpoints.XL) {
      return ContainerWidth.XL
    }
  },
  init(containerWidth) {
    return {
      //returns widh in px of Container's content area (width without paddings)
      getColumnContentWidth(numberOfCols) {
        //more precise calcualtion could be with using percentages
        const COLUMNS = 14
        const GUTTER_PX = 14

        const oneColPercent = (100 / COLUMNS) / 100
        return containerWidth * (oneColPercent * numberOfCols) - GUTTER_PX
      }
    }
  },

}
