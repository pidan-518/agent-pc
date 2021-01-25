import React from 'react';
import './index.less';
import "../../common/globalstyle.less";
// import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/line';
// // 引入提示框和标题组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/toolbox';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/dataZoom';
// import { Link } from 'react-router-dom'
import Eachart from './compontent/Echarts'
// import { DatePicker } from 'antd';
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
import { Empty } from 'antd';
// const { RangePicker } = DatePicker;
class Index extends React.Component {
  state = {
    collapsed: false,
    headTottle: [{ img: require('../../static/index/TotalUsers.png'), number: null, title: '历史佣金总额（元)' },
    { img: require('../../static/index/newThisMonth.png'), number: null, title: '佣金余额（元)' },
    { img: require('../../static/index/growthLastMonth.png'), number: null, title: '已支出佣金（元）' },
    { img: require('../../static/index/numberOfGoods.png'), number: null, title: '待收益（元）' }],
    headListdata: [{ img: require('../../static/index/totalTurnover.png'), number: null, title: '代理人数' },
    { img: require('../../static/index/growthplatform.png'), number: null, title: '消费者会员数' },
    { img: require('../../static/index/transactionVolume.png'), number: null, title: '总订单数' },
    { img: require('../../static/index/averageOrder.png'), number: null, title: '本月订单数' },
    { img: require('../../static/index/totalOrders.png'), number: null, title: '总消费金额' },
    { img: require('../../static/index/cumulativeOrderQuantity.png'), number: null, title: '本月消费金额' },
    { img: require('../../static/index/ordersOfLastMonth.png'), number: null, title: '总提现笔数' },
    { img: require('../../static/index/consignment.png'), number: null, title: '冻结金额' }],

    // fistTotal: {},
    visible: {},
  };

  componentDidMount() {
    document.title = "IST - 首页"
    this.menusVisible()


  }
  //统计分佣数据
  Commission = () => {
    post(servicePath.fundAccount, {})
      .then((response => {
        const data = response.data.data
        this.setState((prev) => {
          prev.headTottle[0].number = response.data.data.totalCommission
          prev.headTottle[1].number = response.data.data.balanceCommission
          prev.headListdata[7].number = response.data.data.freezeAmount
          return {
            fistTotal: { ...prev.fistTotal, ...data },
            // headTottle:{...prev.headTottle}
          }
        })

      }))
  }
  //订单统计
  orderStatistics = () => {
    post(servicePath.itemOrder, {})
      .then((response => {
        const data = response.data.data
        this.setState((prev) => {
          prev.headListdata[4].number = data.totalAmount
          prev.headListdata[2].number = data.totalCount
          prev.headListdata[5].number = data.totalMonthAmount
          prev.headListdata[3].number = data.totalMonthCount
          return {
            fistTotal: { ...prev.fistTotal, ...data }
          }
        })

      }))
  }
  //统计体现记录
  withdrawalRecord = () => {
    post(servicePath.withdraw, {})
      .then((response => {
        const data = response.data.data
        this.setState((prev) => {
          prev.headTottle[2].number = data.amount
          prev.headListdata[6].number = data.count
          return {
            fistTotal: { ...prev.fistTotal, ...data }
          }
        })

      }))
  }
  //统计代理人/消费者会员人数
  indexAgent = () => {
    post(servicePath.indexAgent, {})
      .then((response => {
        const data = response.data.data
        this.setState((prev) => {
          prev.headListdata[0].number = data.agentUserAllNums
          prev.headListdata[1].number = data.primaryAgentAllNums
          return {
            fistTotal: { ...prev.fistTotal, ...data }
          }
        })

      }))
  }
  //统计待收益
  incomeToBePay = () => {
    post(servicePath.incomeToBePay, {})
      .then((response => {
        const data = response.data.data
        this.setState((prev) => {
          prev.headTottle[3].number = data
          return {
            fistTotal: { ...prev.fistTotal, ...data }
          }
        })
      }))
  }

  //消费额统计日期选择
  consumptionDate = (e) => {
    this.setState({
      consumptionDate: e.target.textContent
    }, () => { console.log(typeof this.state.date) })
    console.log(e.target.textContent, 'e')
  }
  //订单数量统计日期选择
  orderDate = (e) => {
    this.setState({
      orderDate: e.target.textContent
    }, () => { console.log(typeof this.state.date) })
    console.log(e.target.textContent, 'e')
  }
  //分佣金额统计日期选择
  subCommission = (e) => {
    this.setState({
      subCommission: e.target.textContent
    }, () => { console.log(typeof this.state.date) })
    console.log(e.target.textContent, 'e')
  }

  onClick = (e) => {
    console.log(e, 'e')
  }
  //首页左侧菜单展示权限
  menusVisible = () => {
    post(servicePath.menusVisible + JSON.parse(localStorage.getItem("userInfo")).userId, {})
      .then(response => {
        let list = {}
        response.data.data.map((item, index) => {
          list[item.key] = item
        })
        this.setState({
          visible: list
        }, () => {
          if( this.state.visible.index && this.state.visible.index.enable){         
                this.Commission();
                this.orderStatistics();
                this.withdrawalRecord();
                this.indexAgent();
                this.incomeToBePay();
              setInterval(() => {
                this.Commission();
                this.orderStatistics();
                this.withdrawalRecord();
                this.indexAgent();
                this.incomeToBePay();
              }, 30 * 60 * 1000)     
          }
        }
        )
        // console.log(list, response, 'responseresponse')
      })
  }

  render() {
    const { visible } = this.state;
    return (

      <div className='homecontext'>
        {visible.index && visible.index.enable ? <div>
          <div className='surContext' style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <div className='contextHead'> <div className='icon'></div >  <div className='title'> <span className='maintitle'>实时概况</span> <span className='Subtitle'>首页统计数据30分钟更新一次</span></div> </div>
            <div className='amountmoney'>
              {this.state.headTottle.map((item, index) => {
                return <div className='commission' key={index}>
                  <div className='commissionItem'
                    style={{
                      backgroundImage: "url(" + item.img + ")", backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div>{item.title}</div>
                    <div className='money'>{item.number}</div>
                  </div>
                </div>
              })}
            </div>
            <div className='variousData'>
              {this.state.headListdata.map((item, indx) => {
                return <div className='itemData' key={indx}>
                  <span><img src={`${item.img}`} alt="icon" /> </span>
                  <div>
                    <div className='littleTitle'>{item.title}</div>
                    <div className='num'>{item.number}</div>
                  </div>
                </div>
              })}

            </div>
          </div>

          <div>
            <Eachart
              id="team"
              title={['代理人', "消费者会员"]}
              url="agentCurve"
              url2='memberCurve'
              head='团队增长统计'
              company='单位：个'
            />
          </div>
          <div>
            <Eachart
              id="amountCurve"
              title={['消费额统计']}
              url="amountCurve"
              company='单位：元'
              head='消费额统计'
            />
          </div>
          <div>
            <Eachart
              id="orderCurve"
              title={['订单数量统计']}
              url="orderCurve"
              head='订单数量统计'
              company='单位：笔'
            />
          </div>
          <div>
            <Eachart
              id="subCommission"
              title={['收益', '待收益']}
              url="incomeCurve"
              url2='waitingIncomeCurve'
              head='分佣金额统计'
              company='单位：元'
            />
          </div>
        </div> : <Empty style={{ background: '#fff', height: '85vh' }} description={false} />}
      </div>
    );
  }
}



export default Index;