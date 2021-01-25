import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import { DatePicker, } from 'antd';


import { post } from '../../../common/util/axios'
import servicePath from '../../../common/util/api/apiUrl'

const { RangePicker } = DatePicker;
class Echarts extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      title:this.props.title,
        data:{},
        dateSelect: ['日', '周', '月', '季', '年'],
        currentDate:[], ////选择日期
        now:[],//当前日期
        agentCurve: {
          type: 1,//日期
          limit:10,//查询条数
        },//代理人曲线
        data2:{},
        NumCountRange: [], // 日期选择范围
    }
  }
  componentDidMount() {
    // this.eachart()
    // this.agentCurve()
    this.currentDate(9)
 
  
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      title:nextProps.title,
      // data:nextProps.data
    })
    
  }

  //当前日期
currentDate=(value)=>{  
  var myDate = new Date();
  let time1 = myDate.valueOf() - value*24*60*60*1000
  let myDatelater = new Date(time1);
  var obj = {
    Y: myDate.getFullYear(),
    M: myDate.getMonth() + 1,
    D: myDate.getDate(),
  }
  var objstart = {
    Y: myDatelater.getFullYear(),
    M: myDatelater.getMonth() + 1,
    D: myDatelater.getDate(),
  }
  function supplement(nn) {
    return nn = nn < 10 ? '0' + nn : nn;
  }
  let endTime = obj.Y + '-' + supplement(obj.M) + '-' + supplement(obj.D)
  let startTime = objstart.Y + '-' + supplement(objstart.M) + '-' + supplement(objstart.D)
  console.log(startTime,endTime)
  this.setState((prev) => {
    return{
      currentDate:[startTime,endTime],
      now:[startTime,endTime]
    }
    },()=>{this.agentCurve();  /*this.getdata2()*/}) 
}
//日期选择
  dateClick1 = (e, index) => {
    this.setState({
      NumCountRange:null
    })
    let limit = null;
    let value = 10
    switch (index + 1) {
      case 1:
        limit = 10;
        value = 9
        break;
      case 2:
        limit = 8;
        value = 8*7
        break;
      case 3:
        limit = 15
        value = 15*30
        break;
      case 4:
        limit = 10
        value = 10*180
        break;
      case 5:
        limit = 5
        value = 10*180*360
        break;
    }
    this.setState((prev)=>{
      return { agentCurve:{...prev.agentCurve ,type:index+1,limit:limit}}
     
      },()=>{this.currentDate(value)})
    // this.setState((prev) => {
    //   prev.agentCurve.type = index+1
    //   prev.agentCurve.limit = limit
    // },()=>{this.props.onChange(this.state.agentCurve)}) 
   
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
    console.log(dates, dateStrings, info)
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
    console.log(open,'open')
    if (open) {
      this.setState({
        NumCountRange: null,
      })
    }
  }


  onChange = (date, dateString) => {
    console.log(date, dateString);
    if(dateString[0] === ''){
      this.setState((prev) => {
        // prev.agentCurve.dateString = dateString
        return{ 
          currentDate:this.state.now
        }
      },()=>{console.log(this.state.currentDate,'currentDate')})
    }else{
      this.setState((prev) => {
        // prev.agentCurve.dateString = dateString
        return{ 
          currentDate:dateString,
          // NumCountDates:dateString,
        }
      },()=>{console.log(this.state.currentDate)})
    }  
  }

  search=()=>{
    this.agentCurve();
    // this.getdata2()
  }

   //获取数据
   agentCurve = () => {    
    const url = this.props.url
    let params = {}
    post(servicePath[url], { "type": this.state.agentCurve.type, "limit": this.state.agentCurve.limit, 'startTime': this.state.currentDate[0], 'endTime': this.state.currentDate[1] })
      .then((response) => {
        const data = response.data.data
        // console.log(data, response,'respon')
        let axisx = []
        let axisy = []
        for (var i of data) {
          axisx.push(i.datetime)
          axisy.push(i.result)
        }
        this.setState((prev) => {
          return {
            data: { axisx:axisx.reverse(), axisy:axisy.reverse() }
          }
        },()=>{this.getdata2()})
      })
  }

getdata2=()=>{
  const url2 = this.props.url2
  if(url2){
    let params = {}
    post(servicePath[url2], { "type": this.state.agentCurve.type, "limit": this.state.agentCurve.limit, 'startTime': this.state.currentDate[0], 'endTime': this.state.currentDate[1] })
      .then((response) => {
        const data = response.data.data
        // console.log(data, response,'respon')
        // let axisx = []
        let axisy2 = []
        for (var i of data) {
          // axisx.push(i.datetime)
          axisy2.push(i.result)
        }
        this.setState((prev) => {
          return {
            data2: { /*axisx:axisx.reverse()*/ axisy2:axisy2.reverse() }
          }
        },()=>{this.eachart()})
      })
  }else{
    this.eachart()
    return null
  } 
}


//更新
updata=()=>{
  setInterval(() => {
    console.log('更新')
    // this.getdata2();
    this.agentCurve();
  }, 30*60*1000);
}


  eachart = () => {
    // console.log(this.props.title,this.state.data.axisy,this.props.id,';;221;')
    let myChart = echarts.init(document.getElementById(this.props.id));
    setTimeout(() => {
      myChart.resize({
        width: 'auto',
      })
    }, 300)

    myChart.setOption({
      legend: {
        data:this.props.title,
        trigger: 'axis',
        // top: 30,
        left: 30
      },
      //保存按钮
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        // right: '200px',
        // top: '22px',
        // showTitle : '自定义扩展方法'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      //位置
      grid: {
        left: '2%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
  
      //x轴
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data:this.state.data.axisx,
      },
      //y轴
      yAxis: [
        { type: 'value',
        name: this.props.company? this.props.company:'',
        minInterval: 1,
        axisPointer: {
          snap: true
      }
      },
        // {
        //   // name: '降雨量(mm)',
        //   nameLocation: 'start',
        //   max: 5,
        //   type: 'value',
        //   inverse: true
        // }
      ],
      series: [
        {
          name: this.props.title[0],
          type: 'line',
          // yAxisIndex: 1,
          animation: true,
          smooth: true,
          data: this.state.data.axisy,
          areaStyle: {
            // color: {
            //   type: 'linear',
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 1,
            //   colorStops: [{
            //     offset: 0, color: 'red' // 0% 处的颜色
            //   }, {
            //     offset: 1, color: 'blue' // 100% 处的颜色
            //   }],
            //   global: false // 缺省为 false
            // }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
        },
        {
          name: this.props.title[1],
          type: 'line',
          animation: true,
          smooth: true,
          data: this.state.data2.axisy2,
          areaStyle: {},
          label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        }]
    });
  }
  render() {
    return(
      <div className='consumption' style={{ margin: '16px 0px', padding: 24, background: '#fff', minHeight: 360 }}>
          <div className='eachBox'>
            <div className='head'>
              <div className='title'>
                <div className='titleIcon'></div>
                <div className='titlebox'>
                  <span className='mainTitle'>{this.props.head}</span>
                  <span className='subTitle'>首页统计数据30分钟更新一次</span>
                </div>
              </div>
              <div className='query'>
                <div className='screenDate'>筛选日期:&nbsp;&nbsp;</div>
                <div className='dateChoice'>
                  <RangePicker onChange={this.onChange}
                   value={this.state.NumCountRange} 
                   disabledDate={this.disabledDate} 
                   onCalendarChange={this.onCalendar}
                   onOpenChange={this.onOpenChange}
                   renderExtraFooter={() => '最多选择31天'} />
                </div>

                <div className='queryBtn'  onClick={this.search}>查询</div>
              </div>
              <div className='dateSele'>
              {this.state.dateSelect.map((item, index) => {
                  return <div key={(index + 1)} onClick={(e) => this.dateClick1(e, index)} className={this.state.agentCurve.type === (index + 1) ? 'dateeve dateeve-active' : 'dateeve'}>{item}</div>
                }
                )}
              </div>
            </div>
            <div className='line'></div>
          </div>
          <div id={this.props.id} style={{width:'100%' ,height:'350px'}}></div>
        </div>
    )
  }
}
export default Echarts;




