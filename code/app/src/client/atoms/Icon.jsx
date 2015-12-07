import React from 'react';
import Component from 'react-pure-render/component';
import classNames from 'classnames';
import Styles from './Icon.scss';

export default class Icon extends Component {
  render() {
    const {name, color} = this.props;
    const iconNameClass = `fa fa-${name}`;
    const style = {color: color};

    const className = classNames(Styles.Icon, iconNameClass, this.props.className);
    return (
      <i className={className} style={style}>
        {this.props.children }
      </i>
    );
  }
}
