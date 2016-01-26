import React from 'react'
import Component from 'react-pure-render/component'
import classNames from 'classnames'
import Checkbox from '../atoms/Checkbox.jsx'

export default class DebugGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldShow3x3Grid: false,
      shouldShowBaseline: true,
      shouldShowContainerEdges: true,
    }
  }

  render() {
    const style = {
      position: 'fixed',
      right: 0,
      background: 'white',
      padding: '0.5rem',
      margin: '0.5rem',
      paddingRight: '1.5rem',
      border: '1px solid lightgrey',
      borderRadius: '2px',
      boxShadow: '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)',
      zIndex: 99999
    }

    const on3x3GridCheckboxChange = () => this.setState({ shouldShow3x3Grid: !this.state.shouldShow3x3Grid })

    const stateToClasses = (state) => {
      let classes = ''

      if (state.shouldShowBaseline) {
        classes = classNames(classes, 'debug-baseline')
      }

      if (state.shouldShowContainerEdges) {
        classes = classNames(classes, 'debug-container')
      }

      return classes
    }

    const onBaselineCheckboxChange = () => {
      this.setState({ shouldShowBaseline: !this.state.shouldShowBaseline }, () => {
        this.props.setDebugClasses(stateToClasses(this.state))
      })
    }

    const onContainerCheckboxChange = () => {
      this.setState({ shouldShowContainerEdges: !this.state.shouldShowContainerEdges }, () => {
        this.props.setDebugClasses(stateToClasses(this.state))
      })
    }

    return (
      <div>
        <div style={style}>
          <Checkbox
            onChange={on3x3GridCheckboxChange}
            checked={this.state.shouldShow3x3Grid}>
            3x3 Grid
          </Checkbox>
          <Checkbox
            onChange={onBaselineCheckboxChange}
            checked={this.state.shouldShowBaseline}>
            Baseline
          </Checkbox>
          <Checkbox
            onChange={onContainerCheckboxChange}
            checked={this.state.shouldShowContainerEdges}>
            Container Edges
          </Checkbox>
        </div>

        {this.state.shouldShow3x3Grid ? <GridLines /> : null}
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
    zIndex: 9999999,
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
