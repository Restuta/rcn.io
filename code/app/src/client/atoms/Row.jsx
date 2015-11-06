import React from 'react';
import Component from 'react-pure-render/component';
import classNames from 'classnames';

export const RowFunc = ({name = 'Nameless Cat'}) =>
  <div>Row: {name}</div>;


export default class Row extends Component {
  render() {
    const className = classNames('row', this.props.className);
    return (
      <div className={className} {...this.props}>
      {this.props.children }
      </div>
    );
  }
}
