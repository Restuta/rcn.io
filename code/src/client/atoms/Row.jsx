import React from 'react';
import Component from 'react-pure-render/component';


export default ({name = 'Nameless Cat'}) =>
  <div>Row: {name}</div>;

export class RowPure extends Component {
  render() {
    const {name} = this.props;
    return <div>Row Pure:{name}</div>
  }
}
