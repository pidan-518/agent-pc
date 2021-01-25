import React from "react";
import { Input,Select ,Button,Table,DatePicker,Pagination } from 'antd';
import { Link, Route } from 'react-router-dom'
import "./commdetails.less";
import "../../common/globalstyle.less";
import { post } from '../../common/util/axios';
import servicePath from '../../common/util/api/apiUrl';
import qee from 'qf-export-excel'
import moment from 'moment'

const { Option  } = Select ;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm'||undefined;
class CommDetails extends React.Component {
  state = {
    columns: [
      {
        title: '订单支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render:(text,record) =>(
          <div>
            {record.state==20?'已付款':'交易成功'}
          </div>
        )
      },
      {
        title: '商品价格',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
      },
      {
        title: '分佣金额',
        dataIndex: 'income',
        key: 'income',
      },
      {
        title: '收益来源',
        dataIndex: 'profitSharingModeName',
        key: 'profitSharingModeName',
      }
    ],
    detail:{},
    profitSharingType: '0', // 1 介绍费  2 自购分享  3直播
    totalList:[], // 全部数据
    dataList:[],
    length:10,
    total: '',
    current:1,
    payTimeStart: '', // 订单支付开始时间
    payTimeEnd: '', // 订单支付结束时间
    minDiscountPrice: '', // 最小商品价格
    maxDiscountPrice: '', // 最大商品价格
    info:{},
  };
  componentDidMount() {
    document.title = "IST - 佣金详情"
    console.log(this.props.match.params.id,'url');
    this.getcommissionDetail(this.props.match.params.id)
  }
  getcommissionDetailList(current){
    post(servicePath.getcommissionDetailList,{agentId:this.props.match.params.id,len:current=='total'?this.state.total:this.state.length,current:current=='total'?1:current,profitSharingType:this.state.profitSharingType,minDiscountPrice:this.state.minDiscountPrice,maxDiscountPrice:this.state.maxDiscountPrice,payTimeStart:this.state.payTimeStart?this.state.payTimeStart+' 00:00:00':'',payTimeEnd:this.state.payTimeEnd?this.state.payTimeEnd+' 23:59:59':'',})
    .then(res=>{
      console.log('佣金列表',res);
      const List = res.data.data.records
      List.forEach((item,index)=>{
        List[index].key = index
      })
      if(current=='total'){
        List.forEach((item,index)=>{
          List[index].status = item.state==20?'已付款':'交易成功'
        })
        this.setState({
          totalList: List,
        },()=>{
          qee(this.state.columns, this.state.totalList, `${this.state.detail.phonenumber}的佣金详情`)
        })
        return
      }
      this.setState({
        dataList: List,
        current:res.data.data.current,
        total:res.data.data.total,
      })
      console.log('222',this.state.messageList);
    })
    .catch(err=>{
      console.log('佣金列表接口异常--',err);
    })
  }
  getcommissionDetail(userId) {
    post(servicePath.getcommissionDetail,{userId})
    .then((res) => {
      console.log('佣金详情',res);
      this.getcommissionDetailList(1)
      this.setState({
        detail:res.data.data
      })
    }).catch((err) => {
      console.log('佣金详情接口异常--',err);
    });
  }
  onInputChange(e,item){
    const newInfo = this.state.info
    newInfo[item] = e.target.value
    this.setState({
      info:newInfo
    })
  }
  handleChange=(e)=>{
    console.log(e);
    this.setState({
      profitSharingType:e,
    })
  }
  onChange=(e)=>{
    console.log('radio checked', e);
    this.setState({
      current:e,
    },()=>{
      this.getcommissionDetailList(e)
    })
  }
  onShowSizeChange=(e,size)=>{
    console.log('onShowSizeChange', e,size);
    this.setState({
      length:size,
    })
  }
  onSubmit=()=>{
    if(Number(this.state.info.price1)>Number(this.state.info.price2)){
      this.setState({
        maxDiscountPrice:this.state.info.price1,
        minDiscountPrice:this.state.info.price2
      },()=>{
        this.getcommissionDetailList(1)
      })
    } else {
      this.setState({
        maxDiscountPrice:this.state.info.price2,
        minDiscountPrice:this.state.info.price1
      },()=>{
        this.getcommissionDetailList(1)
      })
    }
    
  }
  onClear=()=>{
    const newInfo = this.state.info
    for(let key in newInfo){
      newInfo[key] = ''
    }
    this.setState({
      info:newInfo,
      payTimeStart: '', // 订单支付开始时间
      payTimeEnd: '', // 订单支付结束时间
      minDiscountPrice: '', // 最小商品价格
      maxDiscountPrice: '', // 最大商品价格
      profitSharingType:'0',
    },()=>{
      this.getcommissionDetailList(1)
    })
  }
  onTotal=()=>{
    this.getcommissionDetailList('total')
    
  }
  dateChange=(e,string)=>{
    console.log(e,'riqi',string);
    this.setState({
      payTimeStart:string[0],
      payTimeEnd:string[1],
    })
  }
  render() {
    const {columns,dataList,detail,total,current,length,profitSharingType,info} = this.state
    return (
      <div className='commdetails'>
        <div className='title'>佣金详情</div>
        <div className='top'>
          <div className='top-text'>
            <div className='text'>昵称:</div>
            <div>{detail.userName}</div>
          </div>
          <div className='top-text'>
            <div className='text'>代理人总佣金:</div>
            <div>{detail.totalCommission}</div>
          </div>
          <div className='top-text'>
            <div className='text'>提现金额:</div>
            <div>{detail.userCommission}</div>
          </div>
          <div className='top-text'>
            <div className='text'>姓名:</div>
            <div>{detail.realName}</div>
          </div>
          <div className='top-text'>
            <div className='text'>佣金金额:</div>
            <div>{detail.commission}</div>
          </div>
          <div className='top-text'>
            <div className='text'>冻结金额:</div>
            <div>{detail.freezeAmount}</div>
          </div>
          <div className='top-text'>
            <div className='text'>手机号:</div>
            <div>{detail.phonenumber}</div>
          </div>
          <div className='top-text'>
            <div className='text'>成为代理人时间:</div>
            <div>{detail.createTime}</div>
          </div>
        </div>
        
        <div className='inp-div time'>
          <div className='text'>订单支付时间:</div><RangePicker format='YYYY-MM-DD' onChange={this.dateChange}  value={this.state.payTimeStart===undefined||this.state.payTimeEnd===undefined||this.state.payTimeStart===""||this.state.payTimeEnd===""?null:[moment(this.state.payTimeStart, dateFormat), moment(this.state.payTimeEnd, dateFormat)]}/>
        </div>
        <div className='inp-div long'>
          <div className='text'>商品价格:</div><Input className='inp' placeholder="商品价格" value={info.price1} onChange={(e)=>this.onInputChange(e,'price1')} />至<Input className='inp' value={info.price2} placeholder="商品价格" onChange={(e)=>this.onInputChange(e,'price2')} />
        </div>
        <div className='inp-div'>
          <div className='text'>收益来源:</div>
          <Select defaultValue="0"  onChange={this.handleChange} value={profitSharingType}>
            <Option value="0">请选择</Option>
            <Option value="2">自购/分享</Option>
            <Option value="1">介绍费</Option>
            <Option value="3">直播</Option>
          </Select>
        </div>
        <div className='btn-div'>
          <Button type="primary" onClick={this.onSubmit}>查询</Button>
          <Button className='green' onClick={this.onTotal}>导出</Button>
          <Button type="default" onClick={this.onClear}>重置</Button>
        </div>
        <Table columns={columns} dataSource={dataList} pagination={false}/>
        <Pagination
          total={total}
          current={current}
          showSizeChanger
          showQuickJumper
          showTotal={total => `每页${length}条，共${total}条记录`}
          onChange={this.onChange}
          onShowSizeChange={this.onShowSizeChange}
        />
        <div>
        
        </div>
      </div>
    )
  }
}

export default CommDetails;