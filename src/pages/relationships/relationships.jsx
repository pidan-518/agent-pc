import React from "react";
import "./relationships.less";
import "../../common/globalstyle.less";
import { Button, DatePicker, Table, Descriptions } from 'antd';
import { Form, Row, Col, Input, Select,Spin } from 'antd';
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
import qee from 'qf-export-excel'

let  data = [];

let columns = [
  {
    align:'center',
    ellipsis:true,
    title: '代理人ID',
    dataIndex: 'userId',
    key: 'userId',
    render: (text, record, index) => {
      // console.log(text, record, index,'123')
      return (<div className='nickname'>
      {text}
    </div>)
    }   

  },
  {
    align:'center',
    ellipsis:true,
    title: '昵称',
    dataIndex: 'userName',
    key: 'userName',
    render: (text, record, index) =>{
     return (
      <div>     
           <div>{text}</div> 
    </div>
     )
    }
  },
  {
    align:'center',
    ellipsis:true,
    title: '级别',
    dataIndex: 'levelName',
    key: 'levelName',
    render: text => <div>
      <div>{text}</div>
    </div>,
  },
  {
    // align:'center',
    // ellipsis:true,
    title: '组织关系图',
    dataIndex: 'relationNum',
    key: 'relationNum',
    width: 230,
    render: text => (
      <div style={{paddingLeft :(text.relationNum<=5 ? text.relationNum*10 :50 ) }}>
        <div>
          {text.relationNum == 0 ? '':<span>{text.relationNum}<span>-</span></span>}<span>{text.loginName}</span>
          </div>  
      </div>
    )
  },
  {
    align:'center',
    // ellipsis:true,
    title: '成为代理人时间',
    dataIndex: 'toAgentDateStr',
    key: 'toAgentDateStr',
    width: 120,
    render: text => <div>
      <div>{text}</div>
    </div>,
  },

  {
    align:'center',
    // ellipsis:true,
    title: '个人消费额',
    key: 'itemOrderAmount',
    dataIndex: 'itemOrderAmount',
    render: text =>
    <div>{text}</div>
  },
  {
    align:'center',
    // ellipsis:true,
    title: '直属消费者会员业绩',
    key: 'directJuniorAmount',
    dataIndex: 'directJuniorAmount',
    render: text =>
    <div>{text}</div>
  },
  {
    align:'center',
    // ellipsis:true,
    title: '非直属消费者会员业绩',
    key: 'notDirectJuniorAmount',
    dataIndex: 'notDirectJuniorAmount',
    render: text =>
    <div>{text}</div>
  },
  {
    align:'center',
    // ellipsis:true,
    title: '本月团队业绩',
    key: 'teamOrderAmountByMonth',
    dataIndex: 'teamOrderAmountByMonth',
    render: text =>
    <div>{text}</div>
  },
  {
    align:'center',
    // ellipsis:true,
    title: '团队累计业绩',
    key: 'teamOrderAmount',
    dataIndex: 'teamOrderAmount',
    render: text =>
    <div>{text}</div>
  },
  // {
  //   align:'center',
  //   ellipsis:true,
  //   title: '操作',
  //   key: 'userId',
  //   dataIndex: 'userId',
  //   render: text => <div className='action'>
  //     <div className='details'><Link to={'/index/agentsetup/' + `${text}`}>查看详情</Link></div>
  //     <div className='relation'><Link to={'/agentsetup/' + '6'}>查看关系</Link></div>
  //     <div className='setting'><Link to={'/index/agentsetup/' + `${text}`}>设置</Link></div>

  //   </div>

  // },
];



class Relationships extends React.Component {
  state = {
    pageSize: 10,//每页显示数
    current: 1,//请求页数
    total: null,//总条数
    from:{},//表单数据

    loading: false,
    userId:this.props.match.params.id,
    detailData:{}, //详情数据
    data:{},
    exportEnable:false//是否显示导出
  };
  componentDidMount() {
    document.title = "IST - 代理人详情"
    this.exportEnable()
    this.agentUserDetail()
    this.getList()
  }
   //导出显示隐藏
   exportEnable=()=>{
    post(servicePath.exportEnable, {})
    .then(response => {
      console.log(response, 'responshgfje')
      this.setState({
        exportEnable:response.data.data.info
      })
    }
    )
  }

  // onChange = (pageNumber) => {
  //   console.log('current: ', pageNumber);
  //   this.setState({
  //     current: pageNumber
  //   }, () => {  this.getList(this.state.from) })
  // }
  //  //每页显示代理人数量,组件自带
  //  onShowSizeChange = (current, pageSize) => {
  //   console.log(current, '显示页数', pageSize, '每页显示数量');
  //   this.setState({
  //     current: current,
  //     pageSize: pageSize
  //   }, () => {this.getList(this.state.from)  })
  // }
  // //每页显示代理人数量
  // numClick = (e) => {
  //   console.log(typeof Number(e.target.textContent))
  //   this.setState({
  //     agentNumber: Number(e.target.textContent)
  //   })
  // }
  //请求列表
  getList = (params = {}) => {
    this.setState({ loading: true });
    post(servicePath.selectAgentSelectionPC, {
      // current: this.state.current,
      // len: this.state.pageSize,     
      ...params,
      userId:this.state.userId,
    })
      .then(response => {
        let newList = response.data.data;
        console.log(newList,'response/////')
        // let data1 = newList;
        // let userName = {};
        // let name = {};
        // data1.map((item) => {
        //   return (userName = { avatar: item.avatar, userName: item.userName },
        //           name = {realName:item.realName,phonenumber:item.phonenumber},
        //           item.userName = userName,
        //           item.realName = name,
        //           item.key = item.userId
        //   )
        // });
        let list = []
          
          if(!newList.subRelationList){
            list.unshift(newList)
          }else{
            list = newList.subRelationList
            let listtop = JSON.parse(JSON.stringify(newList))
            list.unshift(listtop)
            delete list[0].subRelationList
          }        
          data = list;      
        let relationNum ={}
        data.map((item,index)=>{
         return( relationNum = {relationNum:item.relationNum,loginName:item.loginName},
          item.relationNum = relationNum,
          item.key = index)
        })
        // console.log( data, '111222')
        this.setState({
          data
        })
        this.setState({ loading: false })
      }
      )
  }


  handleExportExcel=()=>{
    let dataExport = JSON.parse(JSON.stringify(this.state.data))
    dataExport.map((item,index)=>{
          item.relationNum = [item.relationNum.relationNum,'-',item.relationNum.loginName]
    })
    qee(columns,dataExport,'代理人关系')
  }
  //请求代理人详情
  agentUserDetail = ()=>{
    post(servicePath.selectAgentUserDetailPC, {
      "userId":this.state.userId
    })
      .then(response => {
        console.log(response.data,'response')
        this.setState({
          detailData:response.data.data
        })
      }
      )
  }
  //提交表单
  onFinish = (values) => {
    console.log('Received values of form: ', values);
    if(values.userId){
      values.userId = Number(values.userId )
      this.setState({
        userId:values.userId
      },()=>{ this.getList(values)})
    }else{
      this.setState({
        userId:this.props.match.params.id,
      },()=>{  this.getList(values)}) 
    }
   console.log(values)
   
  };
//表单
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
      >
        <Row gutter={26}>
          {/* {getFields()} */}
          <Col span={8} key={0}>
            <Form.Item
              name='phoneNumber'
              label='手机号/ID'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <Input  placeholder="手机号/ID" />
            </Form.Item>
          </Col>
          <Col span={8} key={1}>
            <Form.Item
              className='name'
              name='realName'
              label='姓名'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <Input  placeholder="姓名" />
            </Form.Item>
          </Col>
          
          <Col span={8} key={2}>
            <Form.Item
              name='userName'
              label='昵称'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="昵称" />
            </Form.Item>
          </Col>
          <Col span={8} key={3}>
            <Form.Item
              name='selectRelation'
              label='关系'
              // rules={[
              //   {
              //     required: false,
              //     message: 'Input something!',
              //   },
              // ]}
            >
              <Select    placeholder="请选择关系">
                <Select.Option value="direct">直属</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} key={4}>
            <Form.Item
              className='leve'
              name='agentLevelId'
              label='级别'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <Select
              placeholder="请选择级别"
              >
                <Select.Option value="6">电商达人</Select.Option>
                <Select.Option value="5">网红店长</Select.Option>
                <Select.Option value="4">业务经理</Select.Option>
                <Select.Option value="3">区域经理</Select.Option>
                <Select.Option value="2">业务总监</Select.Option>
                <Select.Option value="1">区域总监</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col
            span={5} key={5}
            style={{
              textAlign: 'right',
            }}
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
  
  render() {
    const {detailData} = this.state
    return (
      <div className='relationships'>
        <div className='agentTitle'>
          {/* <h3>代理人详情</h3> */}
          <div className='descriptions'>
            <Descriptions title="代理人关系" column={{ xxl: 5, }}>
              <Descriptions.Item label="头像"> <div className='avatarbox'><img src={detailData.avatar} alt=""/></div> </Descriptions.Item>
              <Descriptions.Item label="级别">{detailData.levelName}</Descriptions.Item>
              <Descriptions.Item label="下级人数">{detailData.subordinateNums}</Descriptions.Item>
              <Descriptions.Item label="昵称">{detailData.userName}</Descriptions.Item>
              <Descriptions.Item label="代理人上级">{detailData.uplevUserName}</Descriptions.Item>
              <Descriptions.Item label="直属下级人数">{detailData.directlySubordinateNums}</Descriptions.Item>
              <Descriptions.Item label="姓名">{detailData.realName}</Descriptions.Item>
              <Descriptions.Item label="代理人总佣金">{detailData.totalCommission}</Descriptions.Item>
              <Descriptions.Item label="非直属下级人数">{detailData.notDirectlySubordinateNums}</Descriptions.Item>
              <Descriptions.Item label="手机号">{detailData.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="佣金余额">{detailData.balanceCommission}</Descriptions.Item>
              <Descriptions.Item label="团队总佣金">{detailData.teamTotalCommission}</Descriptions.Item>
              <Descriptions.Item label="地区">{detailData.region}</Descriptions.Item>
              <Descriptions.Item label="提现金额">{detailData.withdrawalAmount}</Descriptions.Item>
              <Descriptions.Item label="团队消费额">{detailData.teamOrderAmount}</Descriptions.Item>
              <Descriptions.Item label="成为代理人时间">{detailData.toAgentDate}</Descriptions.Item>
              <Descriptions.Item label="冻结金额">{detailData.frozenAmount}</Descriptions.Item>
              <Descriptions.Item label="团队订单数">{detailData.teamOrderNums}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className='formList'>
          <div className='form'>
            <this.AdvancedSearchForm />
          </div>
          <div className="search-result-list">
            {/* <div className='agentNumber'>
              <div>每页显示代理人数量：</div>
              <div className='number' onClick={this.numClick}>
                <div className={this.state.agentNumber === 10 ? 'itemNumber itemNumber-active' : 'itemNumber'}>10</div>
                <div className={this.state.agentNumber === 20 ? 'itemNumber itemNumber-active' : 'itemNumber'}>20</div>
                <div className={this.state.agentNumber === 40 ? 'itemNumber itemNumber-active' : 'itemNumber'}>40</div>
                <div className={this.state.agentNumber === 50 ? 'itemNumber itemNumber-active' : 'itemNumber'}>50</div>
              </div>
            </div> */}
            <div className='table'>
            <Spin spinning={this.state.loading}>
              <Table columns={columns} dataSource={data} pagination={false} />
              </Spin>
              <div className='footPagination'>
              {/* <div>每页{this.state.pageSize}条，共{this.state.total}条记录</div> */}
                {/* <div>
                  <Pagination className='pagination' disabled={false} pageSizeOptions={[10, 20, 40, 50]} onShowSizeChange={this.onShowSizeChange} showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} showSizeChanger={true} />
                </div> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default Relationships;