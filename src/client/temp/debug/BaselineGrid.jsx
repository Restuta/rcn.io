import React from 'react'

export default class BaselineGrid extends React.Component {
  constructor(props) {
    super(props)
    this.updateGridHeight =  this.updateGridHeight.bind(this)
  }

  componentDidMount() {
    this.updateGridHeight()
  }

  componentWillUpdate() {
    this.updateGridHeight()
  }

  updateGridHeight() {
    const getContainerElement = () => {
      let container = window.document.body.getElementsByClassName('container')

      if (!container || container.length === 0) {
        container = window.document.body.getElementsByClassName('container-fluid')
      }

      return container[0]
    }

    //delaying overlay till everything is presumably rendered, so we calendar
    //calculate browser scrollHeight
    setTimeout(() => {
      const mainContainerHeight = getContainerElement().scrollHeight

      if (!this.state || this.state.viewportHeight !== mainContainerHeight) {
        this.setState({ //eslint-disable-line react/no-did-mount-set-state
          viewportHeight: getContainerElement().scrollHeight
        })
      }

    }, 0)
  }

  render() {
    //skip first render to get required dom property
    if (!this.state || !this.state.viewportHeight) {
      return null
    }

    const baselineHeight = 1 //rem
    const extraHeight = 128 //16rem to compenstate for any margins around container

    const baseStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none', //to allow click-through
      backgroundColor: 'transparent',
      width: '100%',
      height: `${this.state.viewportHeight + extraHeight}px`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'left -1px',
      zIndex: 9999
    }

    const primaryBaselineStyle = {
      ...baseStyle,
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 170, 255, 0.4) 1px, transparent 1px)',
      backgroundSize: `${baselineHeight}rem ${baselineHeight}rem`,
    }

    // const secondaryBaselineStyle = Object.assign({}, baseStyle, {
    //   backgroundImage: 'linear-gradient(to bottom, rgba(0, 170, 255, 0.4) 1px, transparent 1px)',
    //   backgroundSize: `${baselineHeight * 2}rem ${baselineHeight * 2}rem`,
    // })

    return (
      <div className="BaselineGrid">
        <div style={primaryBaselineStyle}></div>
        {/*<div style={secondaryBaselineStyle}></div>*/}
      </div>

    )
  }
}
