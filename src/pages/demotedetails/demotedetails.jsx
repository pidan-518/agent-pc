import React from "react";
import { Radio,Button,Select,message } from 'antd';
import "./demotedetails.less";
import "../../common/globalstyle.less";
import { post } from '../../common/util/axios';
import servicePath from '../../common/util/api/apiUrl';

const { Option  } = Select ;
class DemoteDetails extends React.Component {
  state = {
    value:0,
    demoteList:[{
      value:1,
      text: '立即降级',
    },{
      value:2,
      text: '暂不降级',
    }],
    detail:{},
    selectorType: ['请选择', '一个月','两个月','三个月','四个月','五个月','六个月','七个月','八个月','九个月','十个月','十一个月','十二个月'],
    monthsPostponed: 0,
  };
  componentDidMount() {
    document.title = "IST - 降级审核"
    console.log(this.props.match.params.id,this.props.match.params.type);
    this.getselectStaffDetail()
    if(this.props.match.params.type==2){
      this.setState({
        demoteList: [
          {
            value:1,
            text: '立即降级',
          },
          {
            value:3,
            text: '取消',
          },
          {
            value:4,
            text: '延期',
          },
          {
            value:5,
            text: '通过试用',
          },
        ]
      })
    }
  }
  getselectMore=(e)=>{
    console.log(e);
    if(this.state.value==0)return
    if(this.state.value==4&&this.state.monthsPostponed==0){
      message.info('请选择延期时长');
      return
    }
    this.getsaveDegradation()
  }
  onChange=(e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      value:e.target.value
    })
  }
  getsaveDegradation(){
    post(servicePath.getsaveDegradation,{agentId:Number(this.props.match.params.id),auditStatus:this.state.value,monthsPostponed:this.state.monthsPostponed})
    .then(res=>{
      console.log('降级保存',res); 
      if(res.data.code===0){
        message.success('操作成功');
        setTimeout(() => {
          window.history.back(-1)
        }, 2000);
      } else {
        message.info(res.data.msg);
      }
    })
    .catch(err=>{
      console.log('降级保存接口异常--',err);
    })
  }
  getselectStaffDetail() {
    post(servicePath.getselectStaffDetail,{userId:this.props.match.params.id})
    .then(res=>{
      console.log('降级详情',res);
      this.setState({
        detail:res.data.data
      })
    })
    .catch(err=>{
      console.log('降级详情接口异常--',err);
    })
  }
  handleChange=(e)=>{
    console.log(e,'月份');
    this.setState({
      monthsPostponed:e,
    })
  }
  render() {
    const {value,demoteList,detail,selectorType} = this.state
    return (
      <div className='demotedetails'>
        <div className='title'>降级详情</div>
        <div className='til'>基本信息</div>
        {detail.realName?<div className='text'>姓名：{detail.realName}</div>:''}
    
        <div className='text'>昵称：{detail.userName}</div>
        <div className='text'>级别：{detail.levelName}</div>
        <div className='text'>不达标时间：{detail.degradationDate}</div>
        <div className='til'>业绩数据</div>
        <div className='text'>本月业绩：<span className='red'>{detail.currentMonthlyPerformance}元</span> </div>
        <div className='text'>{new Date().getMonth()==0?12:new Date().getMonth()}月份业绩：<span className='red'>{detail.lastMonthPerformance}元</span> </div>
        <div className='text'>{new Date().getMonth()==0?12-1:new Date().getMonth()==1?12:new Date().getMonth()-1}月业绩：<span className='red'>{detail.oneMonthAgoPerformance}元</span> </div>
        <div className='text'>{new Date().getMonth()==0?12-2:new Date().getMonth()==1?12-1:new Date().getMonth()==2?12:new Date().getMonth()-2}月业绩：<span className='red'>{detail.twoMonthAgoPerformance}元</span> </div>
        <div className='til'>降级原因：{detail.degradationReason}</div>
        <Radio.Group onChange={this.onChange} value={value}>
          {
            demoteList.map(item=>{
              return <div key={item.value}>
                <Radio value={item.value}>{item.text}{item.value==3?<span className="tips"> (取消后重新计算三个月)</span>:''}
              </Radio>
              {
                item.value==4&&value==4?<Select defaultValue='0'  onChange={this.handleChange}>
                  {selectorType.map((itemn,indexn)=>{
                    return <Option key={indexn} value={`${indexn}`}>{itemn}</Option>
                  })}
              </Select>:''
              }
                </div>
            })
          }
        </Radio.Group>
        <Button type="primary" onClick={this.getselectMore.bind(this,1)}>确定</Button>
      </div>
    )
  }
}

export default DemoteDetails;