import React from 'react';
import Component from 'react-pure-render/component';
import classNames from 'classnames';
import './Icon.scss';

export default class Icon extends Component {
  render() {
    const {name} = this.props;
    const iconNameClass = `fa fa-${name}`;

    const className = classNames('Icon', iconNameClass, this.props.className);
    return (
      <i {...this.props} className={className}>
        {this.props.children }
      </i>
    );
  }
}
