import React from 'react';
import Component from 'react-pure-render/component';
import classNames from 'classnames';

function getColClassName(propName, propValue) {
  const validProps = {
    'xs': 'col-xs-',
    'sm': 'col-sm-',
    'md': 'col-md-',
    'lg': 'col-lg-'
  };

  if (validProps[propName]) {
    let colClassName = validProps[propName] + propValue;
    return colClassName;
  } else {
    return '';
  }
}

//usage <Col xs={12} md={8} />
export default class Col extends Component {
  render() {
    //TODO: move this to it's own module
    const combinedClassNames = Object.keys(this.props)
      .map(propName => getColClassName(propName, this.props[propName]))
      .reduce((curr, prev) => classNames(prev, curr))
      .trim();

    //const finalClassName = combinedClassNames + (this.props.className || '');
    const finalClassName = classNames(combinedClassNames, this.props.className);
    return (
      <div className={finalClassName}>
        {this.props.children}
      </div>
    );
  }
};

//TODO: use functional component when https://github.com/gaearon/babel-plugin-react-transform/pull/34 is mereged
// export default function Col(props) {
//...
//}
