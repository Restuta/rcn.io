import React from 'react'

let logRenderPerfFor


if (process.env.NODE_ENV === 'development') {
  // logs component's rendering time in MS
  logRenderPerfFor = compName => function(WrappedComp) {
    class RenderPerf extends React.Component {
      constructor(props) {
        super(props)
        this.whenRenderStarted = 0
      }

      componentDidMount() {
        const now = +new Date()
        // eslint-disable-next-line  no-console
        console.log(`  ${compName} rendered in: ` + (now - this.whenRenderStarted) + 'ms')
      }

      componentDidUpdate() {
        const now = +new Date()
        // eslint-disable-next-line  no-console
        console.log(`  ${compName} re-rendered in: ` + (now - this.whenRenderStarted) + 'ms')
      }

      render() {
        this.whenRenderStarted = +new Date()
        return <WrappedComp {...this.props}/>
      }
    }

    // readable component name for wrapped component
    RenderPerf.displayName = `RenderPerf(${compName})`

    return RenderPerf
  }
} else {
  // noop function for prod
  logRenderPerfFor = compName => WrappedComp => WrappedComp
}



export {
  logRenderPerfFor
}
