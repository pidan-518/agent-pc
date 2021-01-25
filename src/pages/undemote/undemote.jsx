import React from "react";
import { Input,DatePicker,Button,Table,Image,Pagination } from 'antd';
import { Link, Route } from 'react-router-dom'
import "./undemote.less";
import "../../common/globalstyle.less";
import { post } from '../../common/util/axios';
import servicePath from '../../common/util/api/apiUrl';
import moment from 'moment'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm'||undefined;
class Demote extends React.Component {
  state = {
    columns: [
      {
        title: '头像/昵称/会员ID',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div className='head-div'>
            <Image className="head" src={record.avatar}></Image>
            <div>{record.userName}</div>
            <div>{record.userId}</div>
          </div>
        ),
      },
      {
        title: '姓名/手机号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
          <div className='head-div'>
            <div>{record.realName}</div>
            <div>{record.phonenumber}</div>
          </div>
        ),
      },
      {
        title: '级别',
        dataIndex: 'levelName',
        key: 'levelName',
      },
      {
        title: '不达标时间',
        dataIndex: 'degradationDate',
        key: 'degradationDate',
      },
      {
        title: '下级人数',
        dataIndex: 'subNumber',
        key: 'subNumber',
      },
      {
        title: '团队消费额',
        dataIndex: 'teamConsumption',
        key: 'teamConsumption',
      },{
        title: '操作',
        dataIndex: 'caozuo',
        key: 'caozuo',
        render: (text, record) => (
          <Button type="primary" onClick={this.getselectMore.bind(this,record.userId)}>查看详情</Button>
        ),
      },
    ],
    peopleList:[],
    type:'',
    length:10,
    total: '',
    current:1,
    startTime:'',
    endTime:'',
    info:{
      phonenumber: null, 
      userName: '',
    },
  };
  componentDidMount() {
    document.title = "IST - 降级审核"
    console.log(this.props.match.params.type,'url');
    this.setState({
      type:this.props.match.params.type
    },()=>{
      if(this.state.type=='1'){
        this.getselectSubstandardStaff(1)
      } else {
        this.getselectNoDemotion(1)
      }
    })
  }
  getselectSubstandardStaff(current) {
    post(servicePath.getselectSubstandardStaff,{
      current,
      len:this.state.length,
      ...this.state.info,
      startTime:this.state.startTime?this.state.startTime+' 00:00:00':'',
      endTime:this.state.endTime?this.state.endTime+' 23:59:59':'',
    })
    .then(res=>{
      console.log('降级审核列表',res);
      const List = res.data.data.records
      List.forEach((item,index)=>{
        List[index].key = index
      })
      this.setState({
        peopleList: List,
        current:res.data.data.current,
        total:res.data.data.total,
      })
    })
    .catch(err=>{
      console.log('降级审核列表接口异常--',err);
    })
  }
  getselectNoDemotion(current) {
    post(servicePath.getselectNoDemotion,{
      current,
      len:this.state.length,
      startTime:this.state.startTime?this.state.startTime+' 00:00:00':'',
      endTime:this.state.endTime?this.state.endTime+' 23:59:59':'',
      ...this.state.info,
    })
    .then(res=>{
      console.log('暂不降级列表',res);
      const List = res.data.data.records
      List.forEach((item,index)=>{
        List[index].key = index
      })
      this.setState({
        peopleList: List,
        current:res.data.data.current,
        total:res.data.data.total,
      })
    })
    .catch(err=>{
      console.log('暂不降级列表接口异常--',err);
    })
  }
  onChange=(e)=>{
    console.log('radio checked', e);
    this.setState({
      current:e,
    },()=>{
      if(this.state.type=='1'){
        this.getselectSubstandardStaff(e)
      } else{
        this.getselectNoDemotion(e)
      }
    })
  }
  onInputChange(e,item){
    const newInfo = this.state.info
    newInfo[item] = e.target.value
    this.setState({
      info:newInfo
    })
  }
  onShowSizeChange=(e,size)=>{
    console.log('onShowSizeChange', e,size);
    this.setState({
      length:size,
    })
  }
  getselectMore=(e)=>{
    console.log(e);
    this.props.history.push(process.env.pathConstants+'/index/demotedetails/'+e+'/2');
  }
  onSubmit=()=>{
    if(this.state.info.phonenumber===''){
      const newInfo = this.state.info
      newInfo.phonenumber = null
      this.setState({
        info:newInfo
      })
    }
    if(this.state.type=='1'){
      this.getselectSubstandardStaff(1)
    } else{
      this.getselectNoDemotion(1)
    }
    
  }
  onClear=()=>{
    const newInfo = this.state.info
    newInfo.phonenumber = null
    newInfo.userName = ''
    this.setState({
      info:newInfo,
      startTime:'',
      endTime:'',
    },()=>{
      this.getselectNoDemotion(1)
    })
  }
  dateChange=(e,string)=>{
    console.log(e,'riqi',string);
    this.setState({
      startTime:string[0],
      endTime:string[1],
    })
  }
  render() {
    const {columns,peopleList,total,current,length,info} = this.state
    return (
      <div className='demote'>
        <div className='inp-div'>
          <div>手机号/ID:</div><Input value={info.phonenumber} placeholder="手机号/ID" onChange={(e)=>this.onInputChange(e,'phonenumber')}/>
        </div>
        <div className='inp-div'>
          <div>昵称/姓名:</div><Input value={info.userName} placeholder="昵称/姓名" onChange={(e)=>this.onInputChange(e,'userName')}/>
        </div>
        <div className='inp-div long'>
          <div>不达标时间:</div><RangePicker onChange={this.dateChange}  value={this.state.startTime===undefined||this.state.endTime===undefined||this.state.startTime===""||this.state.endTime===""?null:[moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
            />
        </div>
        <div className='button-div'>
          <Button type="primary" onClick={this.onSubmit}>查询</Button>
          <Button type="default" onClick={this.onClear}>重置</Button>
        </div>
        <Table columns={columns} dataSource={peopleList} pagination={false}/>
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

export default Demote;