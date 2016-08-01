import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import classnames from 'classnames'

function getColClassName(propName, propValue) {
  if (!propValue) return ''

  const validProps = {
    xs: 'col-xs-',
    sm: 'col-sm-',
    md: 'col-md-',
    lg: 'col-lg-',
    xsOffset: 'col-xs-offset-',
    smOffset: 'col-sm-offset-',
    mdOffset: 'col-md-offset-',
    lgOffset: 'col-lg-offset-',
  }

  return validProps[propName] ? validProps[propName] + propValue : ''
}

//usage <Col xs={12} md={8} />
export default class Col extends Component {
  render() {
    //TODO: move this to it's own module and make it render faster
    const columnClassNames = Object.keys(this.props)
      .map(propName => getColClassName(propName, this.props[propName]))
      .reduce((curr, prev) => classnames(prev, curr))

    const classNames = classnames('col', columnClassNames, this.props.className)

    return (
      <div style={this.props.style} className={classNames}>
        {this.props.children}
      </div>
    )
  }
}

Col.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number
}

//TODO: use functional component when https://github.com/gaearon/babel-plugin-react-transform/pull/34 is mereged
// export default function Col(props) {
//...
//}
