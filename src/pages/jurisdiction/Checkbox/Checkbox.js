import React,{ createRef } from "react";
// import { Component, createRef } from '@tarojs/taro';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.less';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }

  _input = createRef();

  componentWillReceiveProps(nextProps) {
    const { checked: nextChecked } = nextProps;

    if (nextChecked !== this.state.checked) {
      this.setState({ checked: nextChecked });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.checked !== this.props.checked ||
      nextProps.disabled !== this.props.disabled ||
      nextState.checked !== this.state.checked
    );
  }

  onClick = () => {
    !this.props.disabled && this._input.current.click();
  };

  onChange = e => {
    const { onChange } = this.props;

    e.persist();
    this.setState({ checked: e.target.checked }, () => {
      typeof onChange === 'function' && onChange(e);
    });
  };

  render() {
    const { checked } = this.state;
    const { disabled, children } = this.props;

    return (
      <div className={disabled?'disabled wrapper':'wrapper'} onClick={this.onClick}>
        <span className={checked?'checkbox checked':'checkbox'}>
          <input type="checkbox" ref={this._input} onChange={this.onChange} checked={checked || false} />
          <span className={'inner'} />
        </span>
        {children && (
          <span className={styles.description}>
            {children}
          </span>
        )}
      </div>
    );
  }
}

Checkbox.defaultProps = {
  disabled: false,
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Checkbox;
