import React from "react";
import "./audithistory.less";
import "../../common/globalstyle.less";
import { Form, Table,Pagination, DatePicker, Select, Button, Row, Col,Modal} from 'antd';


import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
import qee from 'qf-export-excel'
let data = [];



class AuditHistory extends React.Component {
  state = {
    pageSize: 10,//每页显示数
    current: 1,//请求页数
    total: null,//总条数
    // from:{},
    fromData:{
      params:{},
      status:null
    },//表单数据

    isModalVisible: false,//查看详情按钮
    examinedetail: {},//详情数据  

    exportEnable:false,//是否显示导出
  };
  componentDidMount() {
    document.title = "IST - 历史记录"
    this.exportEnable()
    this.getList()
  }
///////查询
  onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    let fromData= this.state.fromData
    fromData.params.startTime = dateString[0]
    fromData.params.endTime = dateString[1]
    this.setState({ fromData})
  };
 approvalTimeChange = (date, dateString) => {
  console.log(date, dateString);
  let fromData = this.state.fromData
  fromData.params.checkStartTime = dateString[0]
  fromData.params.startTime = dateString[1]
  this.setState({ fromData})
  };
 onFinish = (values) => {
    console.log('Received values of form: ', values);
    let params= {}
    let  status = null
    if(values.applyTime){
      params.startTime = values.applyTime[0].format('YYYY-MM-DD')
      params.endTime = values.applyTime[1].format('YYYY-MM-DD')
      
    }
    if(values.checkTime){
      params.checkStartTime = values.checkTime[0].format('YYYY-MM-DD')
      params.checkEndTime = values.checkTime[1].format('YYYY-MM-DD')
    }
    if(values.status){
      status = values.status
    }
    this.setState({
      fromData:{params,status}
    })
    this.setState({
      current:1,
      // pageSize:10, 
    },()=>{this.getList({params,status})})
  };
  onValuesChange=({status},{checkTime})=>{
    console.log(status,'statusfff',checkTime)
    // let newTestData=Object.assign(this.state.fromData,{[status]:status});
    let fromData = this.state.fromData
    fromData.status = status
    this.setState({ fromData})
  }
  selectChange=(value)=>{
    console.log(value,'selectChange')
  }
  AdvancedSearchForm = () => {
    // const [expand, setExpand] = useState(false);
    const [form] = Form.useForm();
   
    const { RangePicker } = DatePicker
    return (
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={this.onFinish}
        onValuesChange={this.onValuesChange}
      >
        <Row gutter={32}>
        <Col span={6} key={1}>
            <Form.Item
              className='applyTime'
              name='applyTime'
              label='申请时间'
              // rules={[
              //   {
              //     required: false,
              //     message: 'Input something!',
              //   },
              // ]}
            >
              <RangePicker  onChange={this.onChangeDate}/>
            </Form.Item>
          </Col>
          <Col span={6} key={2}>
            <Form.Item
              className='checkTime'
              name='checkTime'
              label='审批时间'
              // rules={[
              //   {
              //     required: false,
              //     message: 'Input something!',
              //   },
              // ]}
            >
              <RangePicker onChange={this.approvalTimeChange} />     
            </Form.Item>
          </Col>
          <Col span={6} key={3}>
            <Form.Item
              className='leve'
              name='status'
              label='审批意见'
              // rules={[
              //   {
              //     required: false,
              //     message: 'Input something!',
              //   },
              // ]}
            >
              <Select placeholder='审批意见' onChange={this.selectChange}>
                <Select.Option value="1">同意</Select.Option>
                <Select.Option value="2">驳回</Select.Option>
              </Select>
            </Form.Item>
          </Col>
                   
          <Col
            span={6}
            style={{
              textAlign: 'center',
            }}
            key={4}
          >
            <Button type="primary" htmlType="submit">
             查询
            </Button>
            {this.state.exportEnable?<Button  style={{
                marginLeft: '8px',
                background:' #4DB845',
                color:"#fff"
              }} className="export" onClick={this.handleExportExcel}>
              导出
            </Button>:null}
            <Button
              style={{
                marginLeft: '8px',
              }}
              onClick={() => {
                form.resetFields();
              }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
  
 columns = [
    {
      align:'center',
      ellipsis:true,
      title: '申请事项',
      dataIndex: 'content',
      key: 'content',
      render: text => <div className='nickname'>
                        <div>{text}</div>
                      </div>,
    },
     {
      align:'center',
      ellipsis:true,
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
     {
      align:'center',
      ellipsis:true,
      title: '账号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
     {
      align:'center',
      ellipsis:true,
      title: '等级',
      dataIndex: 'levelName',
      key: 'levelName',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
    {
      align:'center',
      ellipsis:true,
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>
         <div>{text.split(' ')[0]}</div>
          <div>{text.split(' ')[1]}</div>
      </div>,
    },
    {
      align:'center',
      ellipsis:true,
      title: '审批时间',
      key: 'auditTime',
      dataIndex: 'auditTime',
      render: text => <div>
      <div>{text.split(' ')[0]}</div>
       <div>{text.split(' ')[1]}</div>
   </div>,
    },
    {
      align:'center',
      ellipsis:true,
      title: '审批意见',
      key: 'status',
      dataIndex: 'status', 
      render: text =>
        <div>
          <div>{text === 1 ? '审核通过' :(text === 2 ? '审核不通过' : '申请中')}  </div>
        </div>
    },
    {
      align:'center',
      ellipsis:true,
      dataIndex: 'id',
      title: '操作',
      key: 'id',
      render: text =><div className='action'>
                 <div className='details'><Button type="primary" onClick={() => { this.modalDetails(text) }}>查看详情</Button></div>
      </div>
     
    },
  ];

  modalDetails = (e) => {
    console.log(e)
    this.postAudit({ id: e })
    setTimeout(() => {
      this.setState({
        isModalVisible: true
      })
    }, 20);
  }
  handleOkDetails = () => {
    this.setState({
      isModalVisible: false
    })
  };

  handleCancelDetails = () => {
    this.setState({
      isModalVisible: false
    })
  };


 //请求列表
getList = (params = {}) => {
  post(servicePath.historyList, {
    current: this.state.current, 
    len: this.state.pageSize,
		...params
		})
    .then(response => {
      let newList = response.data.data.records;
      newList.map((item) => {
        return ( item.key = item.id)
      });
      data = newList;
      console.log( data, '111222',response.data.data.total)
      this.setState({
        total: response.data.data.total
      },()=>{console.log(this.state.total,'total')})
    }
    )
  }
//导出
  handleExportExcel=()=>{
    post(servicePath.historyList, {
      current: 1,
      len: this.state.total,
      ...this.state.fromData
    })
    .then(response=>{
      console.log(response.data.data.records,'response')
      let dataExport = JSON.parse(JSON.stringify(response.data.data.records))
       dataExport.map((item)=>{
          item.status = item.status  === 1 ? '审核通过' :(item.status  === 2 ? '审核不通过' : '申请中')
          item.id = null
    })
       qee(this.columns,dataExport,'历史记录')
    })
  }
//导出显示隐藏
exportEnable=()=>{
  post(servicePath.exportEnable, {})
  .then(response => {
    // console.log(response, 'responshgfje')
    this.setState({
      exportEnable:response.data.data.applyRecord
    })
  }
  )
}


  postAudit = (params = {}) => {
    post(servicePath.agentApplyDetail, {
      ...params
    })
      .then(response => {
        console.log(response, 'response')
        this.setState({
          examinedetail:response.data.data
        })
      }
      )
  }
   onChange = (pageNumber) => {
    console.log('current: ', pageNumber);
      this.setState({
        current: pageNumber
      }, () => { this.getList(this.state.fromData) })
  }
 //每页显示代理人数量,组件自带
   onShowSizeChange = (current, pageSize) => {
    console.log(current, '显示页数', pageSize, '每页显示数量');
    this.setState({
      current: current,
      pageSize: pageSize
    }, () => { this.getList(this.state.fromData) })

  }
  //每页显示代理人数量
  numClick=(e)=>{
    console.log(typeof Number(e.target.textContent))
    this.setState({
      agentNumber: Number(e.target.textContent)
    })
  }

  render() {
    const { examinedetail } = this.state
    return (
      <div className='audithistory'>
        <div className='title'>  <div className='iconTitle'></div>历史记录</div>
        <div className='list'>
          <div className='search'>
            <this.AdvancedSearchForm />
          </div>
          <div className='modal'>
            <Modal className='modalDetails' title="申请详情"  visible={this.state.isModalVisible} onOk={this.handleOkDetails} onCancel={this.handleCancelDetails}>
              <div className='content'>
                <div className='applyContent'>
                  <div className='title'>申请内容：</div>
                  <div className='contenttop'>
                    <div className='item'><span>申请事项 </span><span>:</span><span>{examinedetail.content}</span></div>
                    <div className='item'><span>昵称 </span><span>:</span> <span>{examinedetail.nickName}</span></div>
                    <div className='item'><span>账号 </span><span>:</span> <span>{examinedetail.mobile}</span></div>
                    <div className='item'><span>等级 </span><span>:</span> <span>{examinedetail.levelName}</span></div>
                  </div>
                </div>
                <div className='applicant'>
                  <div className='title'>申请人：</div>
                  <div className='contentbottom'>
                    <div className='item'><span>申请人 </span><span>:</span> <span>{examinedetail.addName}</span></div>
                    <div className='item'><span>所属角色</span><span>:</span> <span>{examinedetail.addRoleName}</span></div>
                    <div className='item'><span>申请时间 </span><span>:</span> <span>{examinedetail.createTime}</span></div>
                    <div className='item'><span>审批意见 </span><span>:</span> <span>{examinedetail.status === 1 ? '审核通过' : (examinedetail.status === 2 ? '审核不通过' : '申请中')}</span></div>
                    <div className='item'><span>审批时间 </span><span>:</span> <span>{examinedetail.auditTime}</span></div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          <div className="search-result-list">
            {/* <div className='agentNumber'>
              <div>每页显示代理人数量：</div>
              <div className='number' onClick={this.numClick}>
                <div className={this.state.agentNumber === 10 ? 'itemNumber itemNumber-active' :'itemNumber'}>10</div>
                <div className={this.state.agentNumber === 20 ? 'itemNumber itemNumber-active' :'itemNumber'}>20</div>
                <div className={this.state.agentNumber === 40 ? 'itemNumber itemNumber-active' :'itemNumber'}>40</div>
                <div className={this.state.agentNumber === 50 ? 'itemNumber itemNumber-active' :'itemNumber'}>50</div>
              </div>
            </div> */}
            <div className='table'>
              <Table columns={this.columns} dataSource={data} pagination={false} />
              <div className='footPagination'>
                <div>每页{this.state.pageSize}条，共{this.state.total}条记录</div>
                <div>
                  <Pagination className='pagination' disabled={false} pageSizeOptions={[10, 20, 40, 50]} onShowSizeChange={this.onShowSizeChange} showQuickJumper /*defaultCurrent={2}*/ total={this.state.total} onChange={this.onChange} showSizeChanger={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AuditHistory;