/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/7 下午3:53:02
 * LastEditor:  your name
 * ModifyTime:  2020/12/29 下午3:05:55
 * Description: 财务管理--财务统计
 */

import React from 'react'
import { notification } from 'antd'
import 'moment/locale/zh-cn'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import Linechart from './components/LineChart/index'
import Piechart from './components/PieChart/index'

import HeaderTitle from '../../components/HeaderTitle/HeaderTitle'

import './statistics.less'
import '../../common/globalstyle.less'

class Statistics extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      RealTimeCount: {}, // 实时统计数据
    }
  }

  componentDidMount() {
    document.title = 'IST - 财务统计'

    this.getRealTimeCount()
  }

  // 获取财务统计-实时统计
  getRealTimeCount = () => {
    post(servicePath.getRealTimeCount, {})
      .then(res => {
        if (res.data.code === 0) {
          const RealTimeCount = res.data.data
          // console.log('实时统计数据-获取成功：', RealTimeCount)

          this.setState({
            RealTimeCount,
          })
        } else {
          notification['warning']({
            message: '获取实时统计数据异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 表单提交事件
  onFinish = values => {
    console.log('表单输出: ', values)
  }

  // 更新配置
  handleChangeCondition = e => {
    let newXdata = []
    let newfseries = []

    switch (e.target.value) {
      case 'a':
        newXdata = ['1', '2', '3', '4', '5', '6', '7']
        newfseries = [800, 932, 901, 934, 1290, 1330, 1200]
        break
      case 'b':
        newXdata = ['第一周', '第一周', '第一周', '第一周', '第一周', '第一周', '第一周']
        newfseries = [900, 862, 231, 364, 690, 930, 1100]
        break
      case 'c':
        newXdata = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        newfseries = [800, 932, 901, 934, 1290, 1330, 1200]
        break
      case 'd':
        newXdata = ['1-3', '4-6', '7-9', '10-12']
        newfseries = [800, 932, 901, 934, 1290, 1330, 1200]
        break
      case 'e':
        newXdata = ['2017', '2018', '2019', '2020', '2021']
        newfseries = [800, 932, 901, 934, 1290, 1330, 1200]
        break
    }
    console.log(newXdata)

    this.setState({
      fxdata: newXdata,
      fseries: newfseries,
    })
  }

  render() {
    const { RealTimeCount } = this.state

    return (
      <div id="Statistics">
        <div className="mainArea">
          <HeaderTitle title="实时统计"></HeaderTitle>
          <div className="mainDetail">
            {/* Total number of withdrawals -- 总提现人数 */}
            <div className="DetailArea">
              <span className="DetailName">总提现人数</span>
              <span className="DetailData">{RealTimeCount.allWithdrawal}</span>
            </div>
            <div className="DetailArea">
              <span className="DetailName">总提现笔数</span>
              <span className="DetailData">{RealTimeCount.allWithdrawalSum}</span>
            </div>
            <div className="DetailArea">
              <span className="DetailName">总提现金额</span>
              <span className="DetailData">{RealTimeCount.allWithdrawalNum}</span>
            </div>
            <div className="DetailArea">
              <span className="DetailName">本月提现人数</span>
              <span className="DetailData">{RealTimeCount.nowWithdrawal}</span>
            </div>
            <div className="DetailArea">
              <span className="DetailName">本月提现笔数</span>
              <span className="DetailData">{RealTimeCount.nowWithdrawalSum}</span>
            </div>
            <div className="DetailArea">
              <span className="DetailName">本月提现金额</span>
              <span className="DetailData">{RealTimeCount.nowWithdrawalNum}</span>
            </div>
          </div>
        </div>
        {/* 第二区域 */}
        <div className="mainArea">
          <HeaderTitle title="实时统计"></HeaderTitle>
          <div className="mainDetail lastMonth">
            <div className="DetailArea2">
              <span className="DetailName2">上月提现人数</span>
              <span className="DetailData2">{RealTimeCount.lastWithdrawal}</span>
            </div>
            <div className="DetailArea2">
              <span className="DetailName2">上月提现笔数</span>
              <span className="DetailData2">{RealTimeCount.lastWithdrawalSum}</span>
            </div>
            <div className="DetailArea2">
              <span className="DetailName2">上月提现金额</span>
              <span className="DetailData2">{RealTimeCount.lastWithdrawalNum}</span>
            </div>
          </div>
        </div>
        {/* 第三区域--提现人数折线图 */}
        <div className="mainArea">
          <Linechart
            id="drawalPeopleCount"
            title="提现人数统计"
            yname="单位：个"
            url="getWithdrawalPeopleCount"
          ></Linechart>
        </div>
        {/* 第四区域--提现笔数折线图 */}
        <div className="mainArea">
        <Linechart
            id="drawalCount"
            title="提现笔数统计"
            yname="单位：笔"
            url="getWithdrawalCount"
          ></Linechart>
        </div>
        {/* 第五区域--提现金额折线图 */}
        <div className="mainArea">
          <Linechart
            id="drawalNumCount"
            title="提现金额统计"
            yname="单位：元"
            url="getWithdrawalNumCount"
          ></Linechart>
        </div>
        {/* 第六区域--提现人均金额折现图 */}
        <div className="mainArea">
          <Linechart
            id="drawalCapitaCount"
            title="提现人均金额统计"
            yname="单位：元"
            url="getWithdrawalCapitaCount"
          ></Linechart>
        </div>
        {/* 第七区域--提现方式饼状图 */}
        <div className="mainArea">
          <HeaderTitle title="提现方式饼状图"></HeaderTitle>
          <Piechart id="PieChart"></Piechart>
        </div>
      </div>
    )
  }
}

export default Statistics
