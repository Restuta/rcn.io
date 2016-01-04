export default {
  getContainerWidth(browserWidth) {
    //should match variables from bootstrap
    const ContainerMaxWidth = {
      sm: 576,
      md: 720,
      lg: 940,
      xl: 1140
    }

    const Breakpoints = {
      xs: 0,    // Extra small screen / phone
      sm: 544,  // Small screen / phone
      md: 768,  // Medium screen / tablet
      lg: 992,  // Large screen / desktop
      xl: 1200  // Extra large screen / wide desktop
    }

    if (browserWidth <= ContainerMaxWidth.sm) {
      return browserWidth //container becomes fluid for small size
    } else if (browserWidth > ContainerMaxWidth.sm && browserWidth < Breakpoints.md) {
      return ContainerMaxWidth.sm
    } else if (browserWidth >= Breakpoints.md && browserWidth < Breakpoints.lg) {
      return ContainerMaxWidth.md
    } else if (browserWidth >= Breakpoints.lg && browserWidth < Breakpoints.xl) {
      return ContainerMaxWidth.lg
    } else if (browserWidth > Breakpoints.xl) {
      return ContainerMaxWidth.xl
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
