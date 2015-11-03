import React from 'react';
import Component from 'react-pure-render/component';

const PROPS_TO_COL_CLASS_MAP = {
  'xs': 'col-xs-',
  'sm': 'col-sm-',
  'md': 'col-xs-',
  'lg': 'col-lg-'
};

export default class Col extends Component {
  render() {
    const colClassName = "col ";
    console.info(Object.keys(this.props));

    Object.keys(this.props)
      .reduce(propName => {
        let colClassName = PROPS_TO_COL_CLASS_MAP[propName];
        if (colClassName) {
          colClassName = colClassName + this.props[propName];
        }
      });

    const finalClassName = colClassName + (this.props.className || '');
    return (
      <div className={finalClassName}>
        {this.props.children}
      </div>
    );
  }

  //<Col xs={12} md={8} />
  //<Col c="col-xs-12 col-md-8" />
  //<Col c="xs-12 md-8 push-xs-3"
  //<Col {xs: 12, md: 8} />
  //<Col sm="12" md="8" />
}
