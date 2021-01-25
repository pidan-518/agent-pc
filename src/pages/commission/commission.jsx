import React from "react";
import { Input,Select ,Button,Table,Image,Pagination } from 'antd';
import { Link, Route } from 'react-router-dom'
import "./commission.less";
import "../../common/globalstyle.less";
import { post } from '../../common/util/axios';
import servicePath from '../../common/util/api/apiUrl';
import qee from 'qf-export-excel'


const { Option  } = Select ;
class Commission extends React.Component {
  state = {
    columns: [
      {
        title: '昵称/会员ID',
        align: "center",
        dataIndex: 'userExal',
        key: 'userExal',
        ellipsis: true,
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.userName}</div>
            <div>{record.userId}</div>
          </div>
        ),
      },
      {
        title: '姓名/手机号',
        align: "center",
        dataIndex: 'realExal',
        key: 'realExal',
        ellipsis: true,
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.realName}</div>
            <div>{record.phonenumber}</div>
          </div>
        ),
      },
      {
        title: '总佣金金额',
        align: "center",
        dataIndex: 'totalCommission',
        key: 'totalCommission',
        ellipsis: true,
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.totalCommission}</div>
          </div>
        ),
      },
      {
        title: '剩余佣金',
        align: "center",
        dataIndex: 'commission',
        key: 'commission',
        ellipsis: true,
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.commission}</div>
          </div>
        ),
      },
      {
        title: '提现佣金',
        align: "center",
        dataIndex: 'userCommission',
        key: 'userCommission',
        ellipsis: true,
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.userCommission}</div>
          </div>
        ),
      },{
        title: '操作',
        align: "center",
        dataIndex: 'caozuo',
        key: 'caozuo',
        render: (text, record) => (
          <Button type="primary" onClick={this.getselectMore.bind(this,record.userId)} >查看详情</Button>
        ),
      },
    ],
    tableColumns: [
      {
        title: '昵称',
        align: "center",
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,
      },
      {
        title: '会员ID',
        align: "center",
        dataIndex: 'userId',
        key: 'userId',
        ellipsis: true,
      },
      {
        title: '姓名',
        align: "center",
        dataIndex: 'realName',
        key: 'realName',
        ellipsis: true,
      },
      {
        title: '手机号',
        align: "center",
        dataIndex: 'phonenumber',
        key: 'phonenumber',
        ellipsis: true,
      },
      {
        title: '总佣金金额',
        align: "center",
        dataIndex: 'totalCommission',
        key: 'totalCommission',
        ellipsis: true,
      },
      {
        title: '剩余佣金',
        align: "center",
        dataIndex: 'commission',
        key: 'commission',
        ellipsis: true,
      },
      {
        title: '提现佣金',
        align: "center",
        dataIndex: 'userCommission',
        key: 'userCommission',
        ellipsis: true,
      },{
        title: '操作',
        align: "center",
        dataIndex: 'caozuo',
        key: 'caozuo',
      },
    ],
    dataList:[],
    length:10,
    total: '',
    current:1,
    info:{
      phonenumber: '', // 手机号/用户id（查询接受）
      userName: '', // 昵称
      realName:'', // 姓名
      minCommission: '', // 最小剩余佣金
      maxCommission: '', // 最大剩余佣金
    },
    totalCommissionSort: ' ', // 总佣金排序（0升序 1降序）
    commissionSort: ' ', // 剩余佣金排序（0升序 1降序）
    totalList:[], // 全部数据
  };
  componentDidMount() {
    document.title = "IST - 佣金列表"
    this.getcommissionList(1)
  }
  getcommissionList(current){
    post(servicePath.getcommissionList,{len:current=='total'?this.state.total:this.state.length,current:current=='total'?1:current,totalCommissionSort:this.state.totalCommissionSort,commissionSort:this.state.commissionSort,...this.state.info})
    .then(res=>{
      console.log('佣金列表',res);
      const List = res.data.data.records
      List.forEach((item,index)=>{
        List[index].key = item.userId
      })
      if(current=='total'){
        List.forEach((item,index)=>{
          // List[index].userExal = `${item.userName}/${item.userId}`
          // List[index].realExal = `${item.realName}/${item.phonenumber}`
          List[index].userCommission = `${item.userCommission}`
          List[index].commission = `${item.commission}`
          List[index].totalCommission = `${item.totalCommission}`
        })
        this.setState({
          totalList: List,
        },()=>{
          qee(this.state.tableColumns, this.state.totalList, '佣金列表')
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
  getselectMore=(e)=>{
    console.log(e);
    this.props.history.push(process.env.pathConstants+'/index/commdetails/'+e);
  }
  handleChange=(e,item)=>{
    console.log(e,item);
    this.setState({
      totalCommissionSort:item==='zong'?e:' ',
      commissionSort: item==='sheng'?e:' ',
    })
  }
  onInputChange(e,item){
    console.log(e.target.value,item);
    const newInfo = this.state.info
    newInfo[item] = e.target.value
    this.setState({
      info:newInfo
    })
    console.log(this.state.info);
  }
  onChange=(e)=>{
    console.log('radio checked', e);
    this.setState({
      current:e,
    },()=>{
      this.getcommissionList(e)
    })
  }
  onShowSizeChange=(e,size)=>{
    console.log('onShowSizeChange', e,size);
    this.setState({
      length:size,
    })
  }
  onSubmit=()=>{
    const newInfo = this.state.info
    if(Number(this.state.info.price1)>Number(this.state.info.price2)){
      newInfo.maxCommission = this.state.info.price1
      newInfo.minCommission = this.state.info.price2
    } else {
      newInfo.maxCommission = this.state.info.price2
      newInfo.minCommission = this.state.info.price1
    }
    // delete newInfo.price2
    // delete newInfo.price1
    this.setState({
      info:newInfo
    },()=>{
      this.getcommissionList(1)
    })
  }
  onClear=()=>{
    const newInfo = this.state.info
    for(let key in newInfo){
      newInfo[key] = ''
    }
    this.setState({
      info:newInfo,
      totalCommissionSort:' ',
      commissionSort:' ',
    },()=>{
      this.getcommissionList(1)
    })
  }
  onTotal=()=>{
    this.getcommissionList('total')
    
  }
  render() {
    const {columns,dataList,total,current,length,info,commissionSort,totalCommissionSort} = this.state
    return (
      <div className='commission'>
        <div className='inp-div'>
          <div className='text'>手机号/ID:</div><Input type='number' placeholder="手机号/ID" value={info.phonenumber} onChange={(e)=>this.onInputChange(e,'phonenumber')}/>
        </div>
        <div className='inp-div'>
          <div className='text'>昵称:</div><Input placeholder="账号" value={info.userName} onChange={(e)=>this.onInputChange(e,'userName')}/>
        </div>
        <div className='inp-div'>
          <div className='text'>总佣金排序:</div>
          <Select defaultValue={totalCommissionSort} value={totalCommissionSort}  onChange={(e)=>this.handleChange(e,'zong')}>
            <Option value=" ">请选择</Option>
            <Option value="1">降序</Option>
            <Option value="0">升序</Option>
          </Select>
        </div>
        <div className='inp-div'>
          <div className='text'>姓名:</div><Input placeholder="姓名" value={info.realName} onChange={(e)=>this.onInputChange(e,'realName')}/>
        </div>
        <div className='inp-div long'>
          <div className='text'>剩余佣金:</div><Input type='number' value={info.price1} className='inp' placeholder="剩余佣金" onChange={(e)=>this.onInputChange(e,'price1')}/>至<Input className='inp' type='number' value={info.price2} placeholder="剩余佣金" onChange={(e)=>this.onInputChange(e,'price2')}/>
        </div>
        <div className='inp-div'>
          <div className='text'>剩余佣金排序:</div>
          <Select defaultValue={commissionSort} value={commissionSort}  onChange={(e)=>this.handleChange(e,'sheng')}>
            <Option value=" ">请选择</Option>
            <Option value="1">降序</Option>
            <Option value="0">升序</Option>
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

export default Commission;