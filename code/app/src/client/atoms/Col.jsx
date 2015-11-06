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
    const columnClassNames = Object.keys(this.props)
      .map(propName => getColClassName(propName, this.props[propName]))
      .reduce((curr, prev) => classNames(prev, curr))
      .trim();

    const combinedClassNames = classNames(columnClassNames, this.props.className);

    return (
      <div {...this.props} className={combinedClassNames}>
        {this.props.children}
      </div>
    );
  }
};

//TODO: use functional component when https://github.com/gaearon/babel-plugin-react-transform/pull/34 is mereged
// export default function Col(props) {
//...
//}
