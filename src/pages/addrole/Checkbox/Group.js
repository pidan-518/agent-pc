import React,{  Children, cloneElement } from "react";
import PropTypes from 'prop-types';
// import isEqual from 'lodash.isequal';

import {Checkbox,Divider} from 'antd';

import styles from './index.less';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // checkedValue: props.value,
      checkedList:props.value,
      plainOptions : props.options,
      indeterminate:props.value.length != 0,
      checkAll:props.value.length === props.options.length,
    };
  }
  // componentDidMount() {
  //   console.log(this.props.value,'pppp')
  //   props.value.length != 0?
  //   setTimeout(() => {
  //     this.setState({
  //       checkAll:true
  //     })
  //   }, 20):''
  // };
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.value,'pppp')
    this.setState({
      checkAll:(nextProps.value.length == nextProps.options.length)
    })
    const { value: nextValue } = nextProps;

    if (nextValue !== this.state.checkedValue) {
      this.setState({ checkedValue: nextValue });
    }
  }

  onChange = (e, value) => {
    this.setState(
      prevState => {
        const prevCheckedValue = [...prevState.checkedValue];

        e.target.checked
          ? prevCheckedValue.push(value)
          : prevCheckedValue.splice(prevCheckedValue.indexOf(value), 1);

        return {
          checkedValue: prevCheckedValue
        };
      },
      () => {
        const { onChange } = this.props;

        typeof onChange === 'function' && onChange(this.state.checkedValue);
      },
    );
  };

  onChangeGroup=(list)=>{
    console.log(list,'list')
    this.setState({
      checkedList:list,
      indeterminate:!!list.length && list.length <  this.state.plainOptions.length,
      checkAll:list.length ===  this.state.plainOptions.length
    },() => {
      const { onChange } = this.props;

      typeof onChange === 'function' && onChange(this.state.checkedList);
    })
  }

  onCheckAllChange = e => {
    console.log(e,'e')
    this.setState({
      checkedList:e.target.checked ? this.state.plainOptions : [],
      indeterminate:false,
      checkAll:e.target.checked
    },() => {
      const { onChange } = this.props;

      typeof onChange === 'function' && onChange(this.state.checkedList);
    },)
  };

  renderGroupItem = () => {
    const { checkedValue } = this.state;
    const { disabled, options, children } = this.props;

    if (options && options.length) {
      return options.map(option => (
        <Checkbox
          key={option}
          disabled={disabled}
          checked={checkedValue.includes(option)}
          onChange={e => this.onChange(e, option)}
        >
          {option}
        </Checkbox>
      ));
    } else {
      return Children.map(children, child => {
        const { onChange: childOnChangeHandler, value: childValue } = child.props;

        return cloneElement(child, {
          disabled,
          checked: checkedValue.includes(childValue),
          onChange: e => {
            this.onChange(e, childValue);
            childOnChangeHandler && childOnChangeHandler(e);
          },
        })
      });
    }
  };

  render() {
    const { title ,options} = this.props;
    // console.log(options,'.....22......')
    return (
      <div className={styles.group}>
        {/* {title && (<h3>{title}</h3>)} */}
        {/* {this.renderGroupItem()} */}
        <div className='subtitle'>
        <Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}>
        {title}
      </Checkbox>
        </div>
        
      <Divider />
      <div className='checkboxGroup'>
      <Checkbox.Group options={options} value={this.props.value} onChange={this.onChangeGroup} />
      </div>
     
      </div>
    );
  }
}

Group.defaultProps = {
  value: [],
  options: [],
  disabled: false,
};
Group.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.string),
};

export default Group;
