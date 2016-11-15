//wraps segments.io "window.analytics" methods into safe ones that do not fail when not defined

export default {
  track() {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.track(...arguments)
    }
  },

  page() {
    if (typeof window.analytics !== 'undefined') {
      window.analytics.page(...arguments)
    }
  }
}
