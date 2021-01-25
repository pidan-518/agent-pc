/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/14 下午2:12:21
 * LastEditor:  your name
 * ModifyTime:  2020/12/14 下午2:13:00
 * Description: 折线图组件
 */
import React, { Component } from 'react'
import './index.less'

import { Radio, DatePicker, Button, notification } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'

import moment from 'moment'

import echarts from 'echarts/lib/echarts'
// 引入折线图
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import { post } from '../../../../common/util/axios'
import servicePath from '../../../../common/util/api/apiUrl'

export default class index extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      NumCount: [], // 提现金额数据
      NumCountRange: [], // 提现金额日期选择范围
      NumCountDates: null, // 提现金额日期
    }

    this.withdrawals = null
  }

  componentDidMount() {
    this.withdrawals = echarts.init(document.getElementById(this.props.id))
    setTimeout(() => {
      this.withdrawals.resize({
        width: 'auto',
      })
    }, 300)
    this.getWithdrawaData(0)
    this.refreshData()
  }

  // 决定何时刷新
  componentDidUpdate(prevProps, prevState) {
    if (prevState.NumCount !== this.state.NumCount) {
      this.refreshData()
    }
  }

  // 获取提现金额
  getWithdrawaData = (type, range) => {
    let params = {}
    if (type !== null) {
      params = { type }
    } else {
      params = range
    }
    // console.log(params)
    const url = this.props.url
    post(servicePath[url], params)
      .then(res => {
        if (res.data.code === 0) {
          const NumCount = res.data.data
          console.log(`${this.props.title}数据-获取成功：`, NumCount)

          this.setState({
            NumCount,
          })
        } else {
          notification['warning']({
            message: `获取${this.props.title}数据发生异常`,
            description: res.data.msg,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 提现金额统计
  ChangeDrawalNumCount = e => {
    let newType = null

    switch (e.target.value) {
      case '0':
        newType = 0
        break
      case '1':
        newType = 1
        break
      case '2':
        newType = 2
        break
      case '3':
        newType = 3
        break
      case '4':
        newType = 4
        break
    }
    this.getWithdrawaData(newType)
  }

  // 提现金额日期筛选
  handleSelectDate = e => {
    if (e) {
      const startTime = moment(e[0]).format('YYYY-MM-DD') + ' 00:00:00'
      const endTime = moment(e[1]).format('YYYY-MM-DD') + ' 23:59:59'

      this.setState({
        NumCountDates: { startTime, endTime },
      })
    } else {
      this.setState({
        NumCountDates: null,
      })
    }
  }

  // 只能选择最多30天
  disabledDate = current => {
    if (!this.state.NumCountRange || this.state.NumCountRange.length === 0) {
      return false
    }
    const tooLate =
      this.state.NumCountRange[0] && current.diff(this.state.NumCountRange[0], 'days') > 30
    const tooEarly =
      this.state.NumCountRange[1] && this.state.NumCountRange[1].diff(current, 'days') > 30
    return tooEarly || tooLate
  }

  // 待选日期发生改变
  onCalendar = (dates, dateStrings, info) => {
    // console.log(dates, dateStrings, info)
    if (dates) {
      const startTime = dates[0]
      const endTime = dates[1]

      this.setState({
        NumCountRange: [startTime, endTime],
      })
    }
  }

  // 打开选择框
  onOpenChange = open => {
    if (open) {
      this.setState({
        NumCountRange: null,
      })
    }
  }

  // 提现金额筛选
  handleGetdrawalNumCount = () => {
    if (this.state.NumCountDates) {
      this.getWithdrawaData(null, this.state.NumCountDates)
    } else {
      this.getWithdrawaData(0)
      // console.log('没有选择日期！')
    }
  }

  // 刷新图标数据
  refreshData = data => {
    const option = {
      legend: {},
      // dataZoom: [
      //   {
      //     // 这个dataZoom组件，默认控制x轴。
      //     type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
      //     start: 0, // 左边在 10% 的位置。
      //     end: 100, // 右边在 60% 的位置。
      //   },
      //   {
      //     type: 'slider',
      //     yAxisIndex: 0,
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
            padding: [5, 14, 5, 5],
          },
        },
      },
      dataset: {
        dimensions: ['createTime', 'countNum'],
        source: this.state.NumCount,
      },
      xAxis: {
        type: 'category',
        name: '日期',
        nameLocation: 'end',
        boundaryGap: false,
        alignWithLabel: true,
      },
      yAxis: {
        type: 'value',
        name: this.props.yname,
        axisLine: { show: true },
        minInterval: 1, // 自动计算的坐标轴最小间隔大小
        nameTextStyle: {
          lineHeight: 30,
        },
      },
      series: [
        {
          type: 'line',
          // data: this.state.NumCount,
          connectNulls: true,
          smooth: true,
          name: this.props.title.slice(0, -2),
          itemStyle: {
            color: '#1473E6',
          },
          // 图形上的文本标签
          label: {
            show: true,
            position: "top",
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#1473E6', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    }

    this.withdrawals.setOption(option)
  }

  render() {
    const { RangePicker } = DatePicker

    return (
      <div id="LineChart">
        <div className="chartHeader">
          <div className="name">
            <div className="icon"></div>
            <span className="headerName">{this.props.title}</span>
          </div>
          <div className="datePick">
            <RangePicker
              value={this.state.NumCountRange}
              locale={locale}
              onChange={this.handleSelectDate}
              disabledDate={this.disabledDate}
              onCalendarChange={this.onCalendar}
              onOpenChange={this.onOpenChange}
              renderExtraFooter={() => '最多只能选择31天'}
            />
            <Button className="search_btn" type="primary" onClick={this.handleGetdrawalNumCount}>
              查询
            </Button>
          </div>
          <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.ChangeDrawalNumCount}>
            <Radio.Button value="0">日</Radio.Button>
            <Radio.Button value="1">周</Radio.Button>
            <Radio.Button value="2">月</Radio.Button>
            <Radio.Button value="3">季</Radio.Button>
            <Radio.Button value="4">年</Radio.Button>
          </Radio.Group>
        </div>
        <div id={this.props.id} className="lineChart" style={{ height: 500 }}></div>
      </div>
    )
  }
}
