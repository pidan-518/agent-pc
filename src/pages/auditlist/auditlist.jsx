import React from "react";
import "./auditlist.less";
import "../../common/globalstyle.less";
import { Form, Row, Col, DatePicker, Table, Pagination, Button, Modal, Input, message } from 'antd';


import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'

import qee from 'qf-export-excel'
const { TextArea } = Input
// const { confirm } = Modal
//列表
let data = [];
// let value = ''


class AuditList extends React.Component {
  state = {
    pageSize: 10,//每页显示数
    current: 1,//请求页数
    total: null,//总条数
    from: {},//表单数据
    dataValues:null,

    examinedetail: {},//详情数据   
    isModalVisible: false,//查看详情按钮

    rejectVisible: false,//驳回模态框显示
    reject: false,//驳回模态框
    value: '',//驳回模态框备注值
    rejectId: null,//驳货Id

    agreeVisible:false,//同意模态框显示
    agree: false,//同意模态框
    agreeId:null,//同意Id

    exportEnable:false,//是否显示导出
  };
  componentDidMount() {
    document.title = "IST - 审核列表"
    this.exportEnable()
    this.getList()
  };


  //日期搜索


  //提交表单
  onFinish = (values) => {
    let now = new Date().getTime()
    console.log(typeof values, 'values')
    console.log('Received values of form: ', values);

    if (values && values.toAgentDate) {
      if ( values.toAgentDate[0]._d.getTime() - now > 60 * 60 * 1000) {
        message.warning('日期输入错误')
      } else {
        values.startTime = values.toAgentDate[0].format('YYYY-MM-DD')
        values.endTime = values.toAgentDate[1].format('YYYY-MM-DD')
        let params = {
          startTime: values.startTime,
          endTime: values.endTime
        }
        this.setState({
          dataValues:{params},
          current:1
        },()=>{ this.getList({ params })})      
      }
    } else {
      this.setState({
        current:1
      },()=>{  this.getList()})    
    }
  };
  onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    let params = {
      startTime: dateString[0],
      endTime: dateString[1]
    }
    this.setState({
      dataValues:{params}
    })
  };
//导出
  handleExportExcel = () => {
    post(servicePath.agentApply, {
      current: 1,
      len: this.state.total,
      status: 0,
      ...this.state.dataValues
    })
      .then(response => {
        console.log(response.data.data.records, 'response')
        let dataExport = JSON.parse(JSON.stringify(response.data.data.records))
        console.log(dataExport,'dataExport')
        dataExport&&dataExport.map((item, index) => {
          item.id = null
        })
        qee(this.columns, dataExport, '审核列表')
      })
  }
  //导出显示隐藏
  exportEnable=()=>{
    post(servicePath.exportEnable, {})
    .then(response => {
      console.log(response, 'responshgfje')
      this.setState({
        exportEnable:response.data.data.applyOperation
      })
    }
    )
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
      >
        <Row>
          <Col span={8} key={0}>
            <Form.Item
              className='toAgentDate'
              name='toAgentDate'
              label='申请时间'
            // rules={[
            //   {
            //     required: false,
            //     message: 'Input something!',
            //   },
            // ]}
            >
              <RangePicker onChange={this.onChangeDate} />
            </Form.Item>
          </Col>
          <Col
            span={8} key={1}
          // style={{
          //   textAlign: 'right',
          // }}
          >
            <Button type="primary" htmlType="submit">
              查询
          </Button>
            {this.state.exportEnable?<Button style={{
              marginLeft: '8px',
              background: ' #4DB845',
              color: "#fff"
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
      align: 'center',
      ellipsis: true,
      title: '申请事项',
      dataIndex: 'content',
      key: 'content',
      render: text => <div className='application'>
        <div>{text}</div>
      </div>,
    },
    {
      align: 'center',
      ellipsis: true,
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
    {
      align: 'center',
      ellipsis: true,
      title: '账号',
      dataIndex: 'mobile',
      key: 'mobile',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
    {
      align: 'center',
      ellipsis: true,
      title: '等级',
      dataIndex: 'levelName',
      key: 'levelName',
      render: text => <div>
        <div>{text}</div>
      </div>,
    },
    {
      align: 'center',
      ellipsis: true,
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <div>
        <div>{text.split(' ')[0]}</div>
        <div>{text.split(' ')[1]}</div>
      </div>,
    },
    {
      align: 'center',
      ellipsis: true,
      dataIndex: 'id',
      title: '操作',
      key: 'id',
      render: text => <div className='action'>
        <div className='details'><Button type="primary" onClick={() => { this.modalDetails(text) }}>查看详情</Button></div>
        <div className='relation'><Button type="primary" onClick={() => { this.agree(text) }}>同意</Button></div>
        <div className='setting'><Button type="primary" width='120px' onClick={() => { this.reject(text) }}>驳回</Button></div>

      </div>

    },
  ];
  /*----------查看详情---------------------*/
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
  /* -----------------查看详情end------- */


  /* ------------驳回------------------*/

  //驳回模态框填写备注
  onChangeText = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  //驳回模态框确定
  rejectOk = () => {
    this.getDateil({ id: this.state.rejectId, status: 2, remark: this.state.value })
    this.setState({
      rejectVisible: false,
      rejectId: null,
      value: null
    })
  }
  //驳回模态框取消
  rejectCancel = () => {
    this.setState({
      rejectVisible: false,
      rejectId: null,
      value: null
    })
  }
  //驳回模态框
  reject = (e) => {
    console.log(e)
    this.setState({
      rejectVisible: true,
      rejectId: e
    })

    // setTimeout(() => {
    //   this.setState({
    //     isModalVisible: true
    //   })
    // }, 20);

    // Modal.info({
    //   title: '您确定驳回该申请吗？',
    //   content: (
    //     <div className='areabox'>
    //       <TextArea
    //         className='TextArea'
    //         //  showCount 
    //         //  width={200}
    //         //  maxLength={100}
    //         //  autoSize
    //         onChange={this.onChangeText}
    //         placeholder="填写备注"
    //       />
    //     </div>
    //   ),
    //   onOk() {
    //     getDateil({ id: e, status: 2, remark: value })
    //   },
    // });
  }

  /*---------驳回end------------------------*/


  /* ---------------同意模态框------------------*/

  //同意模态框
  agree = (e) => {
    console.log(e)
    this.setState({
      agreeVisible: true,
      agreeId: e
    })

    // Modal.info({
    //   // title: '您确定同意该申请吗？',
    //   content: (
    //     <div>
    //       <p> 您确定同意该申请吗？</p>
    //       {/* <p>some messages...some messages...</p> */}
    //     </div>
    //   ),
    //   onOk() {
    //     // this.getDateil({ id: e, status: 1 })
    //   },
    // });
  }
    //同意模态框取消
    agreeCancel = () => {
      this.setState({
        agreeVisible: false,
        agreeId: null,
      })
    }
    //同意模态框确定
    agreeOk = () => {
      this.getDateil({ id: this.state.agreeId, status: 1})
      this.setState({
        agreeVisible: false,
        rejectId: null,
      })
    }
 /* ---------------同意模态框end----------------*/


  //审核同意与驳回
  getDateil = (params = {}) => {
    console.log(params)
    post(servicePath.auditAgent, {
      ...params
    })
      .then(response => {
        console.log(response, 'response')
        if (response.data.code === -1) {
          message.warning(response.data.msg);
        }
        if (response.data.code === 0) {
          message.success(response.data.msg)
          this.onFinish()
        }
      }
      )
  }

  //请求列表
  getList = (params = {}) => {
    post(servicePath.agentApply, {
      current: this.state.current,
      len: this.state.pageSize,
      status: 0,
      ...params
    })
      .then(response => {
        let newList = response.data.data.records;
        console.log(newList, 'newList')
        newList.map((item) => {
          return (item.key = item.id)
        });
        data = newList;
        console.log(data, '111222', response.data.data.total)
        this.setState({
          total: response.data.data.total
        }, () => { console.log(this.state.total, 'total') })
      }
      )
  }

  //请求详情
  postAudit = (params = {}) => {
    post(servicePath.agentApplyDetail, {
      ...params
    })
      .then(response => {
        console.log(response, 'response')
        this.setState({
          examinedetail: response.data.data
        })
      }
      )
  }

  //每页显示代理人数量,组件自带
  onShowSizeChange = (current, pageSize) => {
    console.log(current, '显示页数', pageSize, '每页显示数量');
    this.setState({
      current: current,
      pageSize: pageSize
    }, () => { this.getList(this.state.dataValues) })

  }
  onChange = (pageNumber) => {
    console.log('current: ', pageNumber);
    this.setState({
      current: pageNumber
    }, () => { this.getList(this.state.dataValues) })
  }
  //每页显示代理人数量
  numClick = (e) => {
    console.log(typeof Number(e.target.textContent))
    this.setState({
      agentNumber: Number(e.target.textContent)
    })
  }

  render() {
    const { examinedetail } = this.state
    return (
      <div className='auditlist'>
        <div className='title'>  <div className='iconTitle'></div> 审核列表</div>
        <div className='list'>

          <div className='search'>
            <this.AdvancedSearchForm />
          </div>
          <div className='modal'>
            <Modal className='modalDetails' title="申请详情" visible={this.state.isModalVisible} onOk={this.handleOkDetails} onCancel={this.handleCancelDetails}>
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
                  </div>
                </div>
              </div>
            </Modal>
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
        <div className='rejectModal'>
          <Modal title="您确定驳回该申请吗？"  className='rejectModal' visible={this.state.rejectVisible} onOk={this.rejectOk} onCancel={this.rejectCancel}>
            <div className='areabox'>
              <TextArea
                className='TextArea'
                //  showCount 
                //  width={200}
                //  maxLength={100}
                //  autoSize
                value={this.state.value}
                onChange={this.onChangeText}
                placeholder="填写备注"
              />
            </div>
          </Modal>
        </div>
        <div className='agreeModal'>
          <Modal title="同意"  className='agreeModal' visible={this.state.agreeVisible} onOk={this.agreeOk} onCancel={this.agreeCancel}>
           <div>您确定同意该申请吗？</div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default AuditList;