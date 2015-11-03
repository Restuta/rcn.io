import React from 'react';
import Component from 'react-pure-render/component';

export const RowFunc = ({name = 'Nameless Cat'}) =>
  <div>Row: {name}</div>;


export default class Row extends Component {
  render() {
    const className = 'row ' + this.props.className;
    return (
      <div className={className}>
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
