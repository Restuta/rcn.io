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
    //delaying overlay till everything is presumable rendered, so we calendar
    //calculate browser scrollHeight
    setTimeout(() => {
      const mainContainerHeight = window.document.body.getElementsByClassName('container')[0].scrollHeight

      if (!this.state || this.state.viewportHeight !== mainContainerHeight) {
        this.setState({ //eslint-disable-line react/no-did-mount-set-state
          viewportHeight: window.document.body.getElementsByClassName('container')[0].scrollHeight
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
      pointerEvents: 'none', //to allow click-through
      backgroundColor: 'transparent',
      width: '100%',
      height: `${this.state.viewportHeight + extraHeight}px`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'left -1px',
      zIndex: 9999
    }

    const primaryBaselineStyle = Object.assign({}, baseStyle, {
      backgroundImage: 'linear-gradient(to bottom, rgba(0, 170, 255, 0.4) 1px, transparent 1px)',
      backgroundSize: `${baselineHeight}rem ${baselineHeight}rem`,
    })

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
