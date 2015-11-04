import React from 'react';
import Component from 'react-pure-render/component';

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
    const combinedClassNames = Object.keys(this.props)
      .map(propName => getColClassName(propName, this.props[propName]))
      .reduce((curr, prev) => prev + (curr ? (' ' + curr) : ''));

    const finalClassName = combinedClassNames + (this.props.className || '');
    return (
      <div className={finalClassName}>
        {this.props.children} =)
      </div>
    );
  }
};

//TODO: use functional component when https://github.com/gaearon/babel-plugin-react-transform/pull/34 is mereged
// export default function Col(props) {
//   const combinedClassNames = Object.keys(props)
//     .map(propName => getColClassName(propName, props[propName]))
//     .reduce((curr, prev) => prev + (curr ? (' ' + curr) : ''));
//
//
//   const finalClassName = combinedClassNames + (props.className || '');
//   return (
//     <div className={finalClassName}>
//       {props.children}
//     </div>
//   );
// };



//
//<Col c="col-xs-12 col-md-8" />
//<Col c="xs-12 md-8 push-xs-3"
//<Col {xs: 12, md: 8} />
//<Col sm="12" md="8" />
