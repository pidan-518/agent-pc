import React from "react";
// import isEqual from 'lodash.isequal';

import {Checkbox} from 'antd';
import Group from './Group';

import styles from './index.less';

class CheckAll extends React.Component{
  constructor(props) {
    super(props);
    this._plainGroups = this.groupsFormat();
    this.state = {
      checkAll: props.checked,
      checkedList: props.checked ? this._plainGroups : {},
      indeterminate:props.defaultCheckedList && props.defaultCheckedList.length!== this._trigger
    };
    this._trigger = props.groups.reduce((prev, next) => prev + next.options.length, 0);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.checked !== this.props.checked ||
  //     nextState.checkAll !== this.state.checkAll ||
  //     !isEqual(nextState.checkedList, this.state.checkedList)
  //   );
  // }

  groupsFormat = () => {
    const result = {};

    this.props.groups.forEach(({ title, options }) => {
      result[title] = options;
    });
    console.log('result',result)
    return result;
  };

  onUpdated = () => {
    const { onChange } = this.props;

    typeof onChange === 'function' && onChange(this.state.checkedList);
  };

  onCheckAllChange = (e) => {
    console.log(this._trigger,'...')
    this.setState({
      checkedList: e.target.checked ? this._plainGroups : {},
      checkAll: e.target.checked,
      indeterminate: false
    }, this.onUpdated);
  }

  onChange = (title, values) => {
    this.setState(prevState => {
      const prevCheckedList = { ...prevState.checkedList };

      prevCheckedList[title] = values;
      // console.log(Object.values(prevCheckedList).reduce((prev, next) => prev + next.length, 0),'////////')
      return {
        checkAll: Object.values(prevCheckedList).reduce((prev, next) => prev + next.length, 0) === this._trigger,
        checkedList: prevCheckedList,
        indeterminate:(Object.values(prevCheckedList).reduce((prev, next) => prev + next.length, 0) == 0)? false: (Object.values(prevCheckedList).reduce((prev, next) => prev + next.length, 0) === this._trigger)? false :true
      };
    }, this.onUpdated);
  };

  render() {
    const { groups } = this.props;
    const { checkAll, checkedList } = this.state;

    return (
      <div className='checkAll'>
        <Checkbox checked={checkAll} indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange}>{this.props.title}</Checkbox>
        <div className='groups'>
          {groups.map(({ title, options }, index) => (
            <Group
              key={index}
              title={title}
              options={options}
              value={checkedList[title] || []}
              onChange={values => this.onChange(title, values)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CheckAll;
