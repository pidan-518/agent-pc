/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/14 下午2:12:21
 * LastEditor:  your name
 * ModifyTime:  2020/12/14 下午2:13:00
 * Description: 折线图组件
 */
import React, { Component } from 'react'
import './index.less'

import { notification } from 'antd'

import echarts from 'echarts/lib/echarts'
import 'zrender/lib/svg/svg'
// 引入折线图
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import { post } from '../../../../common/util/axios'
import servicePath from '../../../../common/util/api/apiUrl'

export default class index extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      WayCount: null, // 提现方式数据
    }

    this.withdrawals = null
  }

  componentDidMount() {
    this.getWithdrawalWayCount()
    this.withdrawals = echarts.init(document.getElementById(this.props.id), null, {
      renderer: 'svg',
    })
    setTimeout(() => {
      this.withdrawals.resize({
        width: 'auto',
      })
    }, 300)
    this.refreshData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.WayCount !== this.state.WayCount) {
      this.refreshData()
    }
  }

  // 获取提现方式饼状图
  getWithdrawalWayCount = () => {
    post(servicePath.getWithdrawalWayCount, {})
      .then(res => {
        if (res.data.code === 0) {
          const WayCount = res.data.data.map(item => {
            item['name'] = item.accountType
            item['value'] = item.countNum.slice(0, -1) * 100
            return item
          })
          // console.log('获取提现方式饼状图成功：', WayCount)

          this.setState({
            WayCount,
          })
        } else {
          notification['warning']({
            message: '获取提现方式数据异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  refreshData = data => {
    const option = {
      legend: {
        right: '25%',
        orient: 'vertical',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      series: [
        {
          name: '提现方式',
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 30,
          clockwise: true,
          color: ['#1473E6', '#235894'],
          label: {
            // formatter: '{b}: {c}',
            fontSize: 16,
            color: '#235894',
          },
          data: this.state.WayCount,
        },
      ],
    }
    this.withdrawals.setOption(option)
  }

  render() {
    return <div id={this.props.id} className="chart" style={{ height: 380 }}></div>
  }
}
