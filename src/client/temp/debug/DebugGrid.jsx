import React from 'react'
import Checkbox from 'atoms/Checkbox.jsx'
import BaselineGrid from './BaselineGrid.jsx'
import { connect } from 'react-redux'
import { toggleBaseline, toggle3x3Grid, toggleContainerEdges } from 'shared/actions/actions.js'


class DebugGrid extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {containerWidth} = this.props

    const style = {
      position: 'fixed',
      letf: 0,
      bottom: 0,
      background: 'white',
      padding: '1rem',
      margin: '1rem',
      paddingRight: '1.5rem',
      border: '1px solid lightgrey',
      borderRadius: '2px',
      boxShadow: '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)',
      zIndex: 99999
    }

    const containerSizeStyle = {
      fontSize: '1.25rem'
    }

    return (
      <div className="DebugGrid">
        <div style={style}>
          <Checkbox
            onChange={this.props.toggle3x3Grid}
            checked={this.props.show3x3Grid}>
            3x3 Grid
          </Checkbox>
          <Checkbox
            onChange={this.props.toggleBaseline}
            checked={this.props.showBaseline}>
            Baseline
          </Checkbox>
          <Checkbox
            onChange={this.props.toggleContainerEdges}
            checked={this.props.showContainerEdges}>
            Container Edges <span style={containerSizeStyle}>({containerWidth}px)</span>
          </Checkbox>
        </div>


        {this.props.showBaseline ? <BaselineGrid /> : null}
        {this.props.show3x3Grid ? <GridLines /> : null}
      </div>
    )
  }
}

const GridLines = (props) => {
  const thiknessPx = 4

  const baseStyle = {
    position: 'fixed',
    backgroundColor: 'red',
    opacity: '0.2',
    zIndex: 99999,
  }

  const firstVertical = Object.assign({}, baseStyle, {
    width: thiknessPx,
    height: '100%',
    left: '33.333333%',
  })

  const secondVertical = Object.assign({}, baseStyle, {
    width: thiknessPx,
    height: '100%',
    left: '66.666667%',
  })

  const firstHorizontal = Object.assign({}, baseStyle, {
    height: thiknessPx,
    width: '100%',
    top: '33.333333%',
  })

  const secondHorizontal = Object.assign({}, baseStyle, {
    height: thiknessPx,
    width: '100%',
    top: '66.6666667%',
  })

  return (
    <div>
      <div style={firstVertical}></div>
      <div style={secondVertical} ></div>
      <div style={firstHorizontal} ></div>
      <div style={secondHorizontal} ></div>
    </div>
  )
}


export default connect(state => state.debug, {
  toggleBaseline,
  toggle3x3Grid,
  toggleContainerEdges
})(DebugGrid)
