import React from 'react';
import './agentinformation.less';
import { Button, DatePicker, Pagination, Table } from 'antd';
import { Form, Row, Col, Input, Select, Spin,message } from 'antd';
import "../../common/globalstyle.less";

import { Link } from 'react-router-dom'
import { AgentpcLink, AgentpcRoute } from "../../components/AgentpcRouter/AgentpcRouter";

import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
import qee from 'qf-export-excel'
let data = [];

let columns = [
  {
    align: 'center',
    ellipsis: true,
    title: '头像/昵称/会员ID',
    dataIndex: 'userName',
    key: 'userName',
    render: (text, record, index) => {
      // console.log(text, record, index,'123')
      return (<div className='nickname'>
        <div className='avatar'>
          <img src={text.avatar} alt="" />
        </div>
        <div>{text.userName}</div>
        <div>{record.userId}</div>
      </div>)
    }

  },
  {
    align: 'center',
    ellipsis: true,
    title: '姓名/手机号',
    dataIndex: 'realName',
    key: 'realName',
    render: (text, record, index) => {
      return (
        <div>
          <div>{text.realName}</div>
          <div>{text.phonenumber}</div>
        </div>
      )
    }
  },
  {
    align: 'center',
    ellipsis: true,
    title: '级别',
    dataIndex: 'levelName',
    key: 'levelName',
    render: text => <div>
      <div>{text}</div>
    </div>,
  },
  {
    align: 'center',
    ellipsis: true,
    title: '成为代理人时间',
    dataIndex: 'toAgentDate',
    key: 'toAgentDate',
    render: text => (
      <div>
        {/* <div>{text}</div> */}
        <div>{text.split(' ')[0]}</div>
        <div>{text.split(' ')[1]}</div>
      </div>
    )
  },
  {
    align: 'center',
    ellipsis: true,
    title: '下级人数',
    dataIndex: 'subordinateNums',
    key: 'subordinateNums',
    render: text => <div>
      <div>{text}</div>
    </div>,
  },

  {
    align: 'center',
    ellipsis: true,
    title: '团队消费额',
    key: 'teamOrderAmount',
    dataIndex: 'teamOrderAmount',
    render: text => <div>
      <div>{text}</div>
    </div>,
  },
  {
    align: 'center',
    ellipsis: true,
    title: '操作',
    key: 'userId',
    dataIndex: 'userId',
    render: text => <div className='action'>
      <div className='details'><AgentpcLink to={'/index/agentdetails/' + `${text}`}>查看详情</AgentpcLink></div>
      <div className='relation'><AgentpcLink to={'/index/relationships/' + `${text}`}>查看关系</AgentpcLink></div>
      <div className='setting'><AgentpcLink to={'/index/agentsetup/' + `${text}`}>设置</AgentpcLink></div>
    </div>
  },
];


class AgentInformation extends React.Component {
  state = {
    pageSize: 10,//每页显示数
    current: 1,//请求页数
    total: null,//总条数
    from: {},//表单数据
    loading: false,
    exportEnable:true,
    agentUserDetail: {
    },//代理人和消费者会员总人数
  };
  componentDidMount() {
    document.title = "IST - 代理人信息"
    this.exportEnable()
    this.agentUserDetail()
    this.getList()
  };
  onChange = (pageNumber) => {
    console.log('current: ', pageNumber);
    this.setState({
      current: pageNumber
    }, () => { this.getList(this.state.from) })
  }
  //每页显示代理人数量,组件自带
  onShowSizeChange = (current, pageSize) => {
    console.log(current, '显示页数', pageSize, '每页显示数量');
    this.setState({
      current: current,
      pageSize: pageSize
    }, () => { this.getList(this.state.from) })

  }
  //每页显示代理人数量
  numClick = (e) => {
    console.log(typeof Number(e.target.textContent))
    this.setState({
      pageSize: Number(e.target.textContent)
    })
  }
  //请求列表
  getList = (params = {}) => {
    this.setState({ loading: true });
    post(servicePath.selectAgentUserListPC, {
      current: this.state.current,
      len: this.state.pageSize,
      ...params
    })
      .then(response => {
        if(response.data.code !== 0 ){
          message.error(response.data.msg);
          return
        }
        let newList = response.data.data.records;
        let data1 = newList;
        let userName = {};
        let name = {};
        data1.map((item) => {
          return (userName = { avatar: item.avatar, userName: item.userName },
            name = { realName: item.realName, phonenumber: item.phoneNumber },
            item.userName = userName,
            item.realName = name,
            item.key = item.userId
          )
        });
        data = data1;
        console.log(data1, data, '111222', response.data.data.total)
        this.setState({
          total: response.data.data.total
        }, () => { console.log(this.state.total, 'total') })
        this.setState({ loading: false })
      }
      )
  }
//导出
  handleExportExcel=()=>{
    // let dataExport = JSON.parse(JSON.stringify(data))
    // dataExport.map((item,index)=>{
    //       item.relationNum = [item.relationNum.relationNum,'-',item.relationNum.loginName]
    // })
    let columnsExport = [
      {
        title: '昵称',
        key: 'userName', 
      },
      {
        title: '会员Id',
        key: 'userId', 
      },
      {  
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName',
      },
      {  
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '级别',
        dataIndex: 'levelName',
        key: 'levelName',
      },
      {
        title: '成为代理人时间',
        dataIndex: 'toAgentDate',
        key: 'toAgentDate',
      },
      {
        title: '下级人数',
        dataIndex: 'subordinateNums',
        key: 'subordinateNums',
      },
    
      {
        title: '团队消费额',
        key: 'teamOrderAmount',
        dataIndex: 'teamOrderAmount',
      },
    ];
    
    post(servicePath.selectAgentUserListPC, {
      current: 1,
      len: this.state.total,
      ...this.state.from
    })
      .then(response => {
        if(response.data.code !== 0 ){
          message.error(response.data.msg);
          return
        }
        let newList = response.data.data.records;
        // let userName = [];
        // let name = [];
        // newList.map((item) => {
        //   return (userName = ['***',item.userName ,item.userId],
        //     name = [item.realName ,item.phoneNumber],
        //     item.userName = userName,
        //     item.realName = name,
        //     item.key = item.userId,
        //     item.userId = null
        //   )
        // });
        // console.log(data1, data, '111222', response.data.data.total)
        
        qee(columnsExport,newList,'代理人列表')
      }
      )
  }
  //表单更新触发回调
  onValuesChange=(changedValues, allValues)=>{
    console.log(changedValues,allValues,'allValues')
    if (allValues.toAgentDate) {
      allValues.toAgentStartDate = allValues.toAgentDate[0].format('YYYY-MM-DD') + ' 00:00:00'
      allValues.toAgentEndDate = allValues.toAgentDate[1].format('YYYY-MM-DD') + ' 23:59:59'
    } else {
      allValues.toAgentStartDate = null
      allValues.toAgentEndDate = null
    }
    allValues.toAgentDate = null
    this.setState({
      from: allValues,
    })
  }
  //查询代理人和消费者会员总人数
  agentUserDetail = () => {
    post(servicePath.selectAgentUserNumsPC, {})
      .then(response => {
        console.log(response.data.data, 'response')
        this.setState({
          agentUserDetail: response.data.data
        })
      }
      )
  }
  //提交表单
  onFinish = (values) => {
    console.log('Received values of form: ', values);
    if (values.toAgentDate) {
      values.toAgentStartDate = values.toAgentDate[0].format('YYYY-MM-DD') + ' 00:00:00'
      values.toAgentEndDate = values.toAgentDate[1].format('YYYY-MM-DD') + ' 23:59:59'
    } else {
      values.toAgentStartDate = null
      values.toAgentEndDate = null
    }
    values.toAgentDate = null
    this.setState({
      from: values,
      current:1
    }, () => { this.getList(values); })

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
        onValuesChange={this.onValuesChange}
      >
        <Row gutter={24} >
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
              <Input placeholder="手机号/ID" />
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
              <Input placeholder="姓名" />
            </Form.Item>
          </Col>
          <Col span={8} key={2}>
            <Form.Item
              name='orderBy'
              label='排序'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <Select
                // defaultValue="toAgentDate"
                placeholder="时间">
                <Select.Option value="toAgentDate">时间</Select.Option>
                <Select.Option value="subordinateNums">下级人数</Select.Option>
                <Select.Option value="teamOrderAmount">团队消费额</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} key={3}>
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
          <Col span={8} key={4}>
            <Form.Item
              className='leve'
              name='agentLevelId'
              label='级别'
            // rules={[
            //   {
            //     required: false,
            //     message: 'Input something!',
            //   },
            // ]}
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
          <Col span={8} key={5}>
            <Form.Item
              className='agentTime'
              name='toAgentDate'
              label='成为代理人时间'
              rules={[
                {
                  required: false,
                  message: 'Input something!',
                },
              ]}
            >
              <RangePicker />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={24}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" style={{
              // margin: '0 8px',
            }} htmlType="submit">
              查询
            </Button>
            {this.state.exportEnable ? <Button  style={{
                marginLeft: '8px',
                background:' #4DB845',
                color:"#fff"
              }} className="export" onClick={this.handleExportExcel}>
              导出
            </Button> :null}
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


  heid = () => {
    let heid = document.querySelector('.massage')
    heid.style.cssText = 'display:none'
  }
  // systemMessage=()=>{
  //  console.log(document.querySelector('.homeheader'),window.top.window.systemMessage())

  // }
  render() {
    const { agentUserDetail } = this.state
    return (
      <div className='agentList'>
        <div className='headTitle'>
          <div className='iconBlock'></div>
          <div className='headContext'>代理人列表</div>
        </div>
        <div className='massage' onClick={this.systemMessage}>
          <div>目前拥有 <span>{agentUserDetail.agentUserAllNums || ''} </span>名代理人，<span>{agentUserDetail.primaryAgentAllNums || ''}</span>名消费者会员。</div>
          <div onClick={this.heid} className='heid'><img src={require("../../static/error.png")} alt="" /></div>
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
              {/* <div className='tableHeader'></div>
                <div className='tableContext'>

                   <div className='tableIteam'>

                   </div>

                </div> */}
              <Spin spinning={this.state.loading}>
                <Table columns={columns} dataSource={data} pagination={false} />
              </Spin>

              <div className='footPagination'>
                <div>每页{this.state.pageSize}条，共{this.state.total}条记录</div>
                <div>

                  <Pagination className='pagination' disabled={false} current={this.state.current} pageSizeOptions={[10, 20, 40, 50]} onShowSizeChange={this.onShowSizeChange} showQuickJumper defaultCurrent={1} total={this.state.total} onChange={this.onChange} showSizeChanger={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default AgentInformation;