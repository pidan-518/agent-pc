/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/4 上午9:31:20
 * LastEditor:  your name
 * ModifyTime:  2020/12/7 下午3:34:41
 * Description: 财务--财务操作
 */
import React, { useRef } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Space,
  Table,
  Radio,
  Popover,
  Modal,
  notification,
} from 'antd'

import qee from 'qf-export-excel'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './cash.less'
import '../../common/globalstyle.less'

class Cash extends React.Component {
  cashTable = React.createRef()

  constructor(...args) {
    super(...args)

    // 表格基础配置
    this.columns = [
      {
        align: 'center',
        title: '昵称/ID',
        dataIndex: 'nick_ID',
        key: 'nick_ID',
        // width: 200,
        ellipsis: true,
        render: data => (
          <>
            {data.map(content => {
              return <p key={content}>{content}</p>
            })}
          </>
        ),
      },
      {
        align: 'center',
        title: '姓名/手机号',
        dataIndex: 'name_phone',
        key: 'name_phone',
        // width: 200,
        ellipsis: true,
        render: data => (
          <>
            {data.map(content => {
              return <p key={content}>{content}</p>
            })}
          </>
        ),
      },
      {
        align: 'center',
        title: '申请金额',
        dataIndex: 'amount',
        key: 'amount',
        // width: 100,
        ellipsis: true,
      },
      {
        align: 'center',
        title: '申请时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // width: 200,
        ellipsis: true,
      },
      {
        align: 'center',
        title: '账号类型/收款账号',
        dataIndex: 'type_account',
        key: 'type_account',
        // width: 200,
        ellipsis: true,
        render: data => (
          <>
            {data.map(content => {
              return <p key={content}>{content}</p>
            })}
          </>
        ),
      },
      {
        align: 'center',
        title: '开户行/收款人',
        dataIndex: 'bank_payee',
        key: 'bank_payee',
        // width: 150,
        ellipsis: true,
        render: data => (
          <>
            {data.map((content, index) => {
              return <p key={content + index}>{content}</p>
            })}
          </>
        ),
      },
      {
        align: 'center',
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        // width: 200,
        ellipsis: true,
        render: data => (
          <Popover content={<p>{data}</p>} trigger="hover">
            <p className="note">{data}</p>
          </Popover>
        ),
      },
      {
        align: 'center',
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Space size="small" direction="vertical" className="btnArea">
            <Button
              type="primary"
              className="passbtn"
              size="small"
              onClick={this.handlePass.bind(this, record)}
              ghost
            >
              同意
            </Button>
            <Button type="danger" size="small" ghost onClick={this.handleReject.bind(this, record)}>
              驳回
            </Button>
          </Space>
        ),
      },
    ]

    this.state = {
      data: [], // 表格数据
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      bankList: [{}], // 银行列表
      alldata: [], // 总数据
      actionType: 0, // 0为提现 1为驳回
      visible: false, // 模态框
      drawDetail: {}, // 提现详情
      withdrawId: null, // 申请ID
      reason: '', // 驳回原因
      searchParms: {}, // 搜索条件
    }
  }

  componentDidMount() {
    document.title = 'IST - 财务操作'

    this.getBankList()
  }

  // 请求银行列表
  getBankList = () => {
    post(servicePath.getBankList, { current: 1, len: 50 })
      .then(res => {
        if (res.data.code === 0) {
          const bankList = res.data.data.map(item => {
            let bank = {
              id: item.id,
              name: item.name,
              key: item.id,
            }
            return bank
          })
          console.log('银行列表获取成功：', bankList)
          this.setState(
            {
              bankList,
            },
            () => {
              this.getDrawAdminList({ current: 1, len: 10, state: 0 })
            }
          )
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 请求提现申请列表
  getDrawAdminList = (params, type = 'page') => {
    post(servicePath.getDrawAdminList, params)
      .then(res => {
        if (res.data.code === 0) {
          console.log('提现申请获取成功：', res.data.data, type)

          const records = res.data.data.records
          const totalNum = res.data.data.total

          const data = records.map((item, index) => {
            item['key'] = index
            item['nick_ID'] = [item.nickName, item.agentId]
            item['name_phone'] = [item.realName, item.mobile]
            item['type_account'] = [item.accountType === 0 ? '银行卡' : '支付宝', item.payeeAccount]
            item['type'] = item.accountType === 0 ? '银行卡' : '支付宝'
            let bankName = ''
            this.state.bankList.forEach(value => {
              if (value.id === item.bank) {
                bankName = value.name
              }
            })
            item['bank_payee'] = [bankName, item.payee]
            item['bank_name'] = bankName
            return item
          })

          if (type === 'all') {
            // 表格基础配置
            const columns = [
              {
                title: '昵称',
                dataIndex: 'nickName',
                key: 'nickName',
              },
              {
                title: 'ID',
                dataIndex: 'agentId',
                key: 'agentId',
              },
              {
                align: 'center',
                title: '姓名',
                dataIndex: 'realName',
                key: 'realName',
              },
              {
                align: 'center',
                title: '手机号',
                dataIndex: 'mobile',
                key: 'mobile',
              },
              {
                title: '申请金额',
                dataIndex: 'amount',
                key: 'amount',
              },
              {
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
              },
              {
                title: '账号类型',
                dataIndex: 'type',
                key: 'type',
              },
              {
                title: '收款账号',
                dataIndex: 'payeeAccount',
                key: 'payeeAccount',
              },
              {
                title: '开户行',
                dataIndex: 'bank_name',
                key: 'bank_name',
              },
              {
                title: '收款人',
                dataIndex: 'payee',
                key: 'payee',
              },
              {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
              },
            ]
            this.setState(
              {
                alldata: data,
              },
              () => {
                qee(columns, this.state.alldata, '财务提现申请')
              }
            )
          } else {
            this.setState({
              data,
              totalNum,
              current: params.current,
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 请求申请详情
  getDrawDetail = () => {
    post(servicePath.getDrawDetail, { withdrawId: this.state.withdrawId })
      .then(res => {
        console.log('提现详情获取成功：', res.data.data)
        const drawDetail = res.data.data
        this.setState({
          drawDetail,
          visible: true,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 表单提交事件
  onFinish = values => {
    let search = {}
    for (var i in values) {
      if (values[i]) {
        if (i === 'applyTime') {
          console.log(values[i])
          search['params'] = {
            beginTime: values[i][0],
            endTime: values[i][1],
          }
        } else if (i === 'mobile' && values[i] !== '') {
          search[i] = Number(values[i])
        } else {
          search[i] = values[i]
        }
      }
    }

    this.setState({
      searchParms: search,
    })

    console.log('搜索条件: ', search)
    this.getDrawAdminList({
      current: 1,
      len: this.state.pageSize,
      state: 0,
      ...search,
    })
  }

  // 表单重置
  onReset = () => {
    this.searchform.current.resetFields()
    this.getDrawAdminList({
      current: 1,
      len: this.state.pageSize,
      state: 0,
    })
    // 重置搜索条件，防止导出数据错误
    this.setState({
      searchParms: null,
    })
  }

  // 导出excel表
  handleExportExcel = () => {
    this.getDrawAdminList(
      {
        current: 1,
        len: this.state.totalNum,
        state: 0,
        ...this.state.searchParms,
      },
      'all'
    )
  }

  // 修改页面数据长度
  handleChangePageSize = e => {
    const pageSize = e.target.value

    if (pageSize > this.state.pageSize) {
      this.getDrawAdminList({
        current: 1,
        len: pageSize,
        state: 0,
        ...this.state.searchParms,
      })
    }

    this.setState({
      pageSize,
    })
  }

  // 当前页面修改
  handleChangePage = (page, pageSize) => {
    console.log('切换页数:', page)
    const params = this.state.searchParms !== {} ? { ...this.state.searchParms } : { skey: '' }
    this.getDrawAdminList({
      current: page,
      len: pageSize,
      state: 0,
      ...params,
    })
  }

  // 确认按钮事件
  handlesubmit = () => {
    if (this.state.actionType === 0) {
      this.handlePassApplication()
      return
    }
    if (this.state.actionType === 1) {
      this.handleRejectApplication()
      return
    }
  }

  // 申请批准
  handlePass = item => {
    console.log('获取申请ID：', item.withdrawId)

    this.setState(
      {
        actionType: 0,
        withdrawId: item.withdrawId,
      },
      () => this.getDrawDetail()
    )
  }

  // 批准
  handlePassApplication = () => {
    post(servicePath.getDrawPass, {
      withdrawId: this.state.withdrawId,
      state: 1,
    })
      .then(res => {
        console.log('同意提现：', res.data)

        if (res.data.code === 0) {
          notification['success']({
            message: '通过申请',
            description: '您已同意该提现申请',
          })
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }

        this.getDrawAdminList({
          current: this.state.current,
          len: this.state.pageSize,
          state: 0,
        })

        this.setState({
          visible: false,
          drawDetail: {},
          withdrawId: null,
          actionType: null,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 驳回申请
  handleReject = item => {
    console.log('获取驳回ID：', item.withdrawId)

    this.setState({
      visible: true,
      actionType: 1,
      withdrawId: item.withdrawId,
    })
  }

  // 输入原因
  handleInputReason = e => {
    // console.log(e.target.value)

    this.setState({
      reason: e.target.value,
    })
  }

  // 驳回
  handleRejectApplication = () => {
    post(servicePath.getDrawNotPass, {
      withdrawId: this.state.withdrawId,
      state: 2,
      reason: this.state.reason,
    })
      .then(res => {
        console.log('驳回提现：', res.data)

        if (res.data.code === 0) {
          notification['success']({
            message: '驳回成功',
            description: '您已驳回该提现申请',
          })
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }

        this.getDrawAdminList({
          current: this.state.current,
          len: this.state.pageSize,
          state: 0,
        })

        this.setState({
          withdrawId: null,
          visible: false,
          drawDetail: {},
          actionType: null,
          reason: '',
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 隐藏模态框
  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    const { Option } = Select
    const { RangePicker } = DatePicker
    const { TextArea } = Input
    const { bankList, drawDetail, actionType } = this.state

    this.searchform = React.createRef()

    return (
      <div id="cash">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">提现申请</span>
        </div>
        {/* 搜索框 */}
        <Form
          ref={this.searchform}
          name="search"
          className="search"
          onFinish={this.onFinish}
          // validateMessages={{required: "'${name}' 是必选字段",}}
        >
          <Form.Item className="form_item" name="mobile" label="手机号/ID">
            <Input placeholder="代理人手机号" allowClear />
          </Form.Item>
          <Form.Item className="form_item" name="realName" label="姓名">
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item name="bank" label="开户行" className="form_item">
            <Select placeholder="请选择" allowClear>
              {bankList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item name="nickName" label="昵称" className="form_item">
            <Input placeholder="账号" allowClear />
          </Form.Item>
          <Form.Item name="accountType" label="账号类型" className="form_item">
            <Select onChange={this.handleChange} placeholder="请选择" allowClear>
              <Option value="0">银行卡</Option>
              <Option value="1">支付宝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="applyTime" label="申请时间" className="form_item">
            <RangePicker className="datePicker" allowClear />
          </Form.Item>
          {/* <div className="form_item"></div>
          <div className="form_item btn_area"></div> */}
          <div className=" btn_area">
            <Button type="primary" className="submit" htmlType="submit">
              查询
            </Button>
            <Button className="export" onClick={this.handleExportExcel}>
              导出
            </Button>
            <Button className="reset" htmlType="button" onClick={this.onReset}>
              重置
            </Button>
          </div>
        </Form>

        {/* 表格 */}
        <div className="cashTable" ref={this.cashTable}>
          {/* <div className="pageSizeRadio">
            <span className="optionName">每页显示申请数量：</span>
            <Radio.Group
              buttonStyle="solid"
              defaultValue="10"
              onChange={this.handleChangePageSize}
            >
              <Radio.Button value="10">10</Radio.Button>
              <Radio.Button value="20">20</Radio.Button>
              <Radio.Button value="40">40</Radio.Button>
              <Radio.Button value="50">50</Radio.Button>
            </Radio.Group>
          </div> */}
          <Table
            columns={this.columns}
            className="applyList"
            dataSource={this.state.data}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              current: this.state.current,
              pageSize: this.state.pageSize,
              pageSizeOptions: [10, 20, 40, 50],
              total: this.state.totalNum,
              onShowSizeChange: (current, size) => {
                this.setState({
                  pageSize: size,
                })
              },
              onChange: this.handleChangePage,
              showTotal: total => `每 ${this.state.pageSize} 条，共 ${total} 条记录`,
            }}
          />
        </div>
        {/* 模态框 */}
        <Modal
          title={actionType === 0 ? '提现发放' : '驳回申请'}
          className="modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" className="pass" type="primary" onClick={this.handlesubmit}>
              确定
            </Button>,
            <Button key="back" className="reject" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          {actionType === 0 ? (
            <>
              <div className="detail">
                <div className="item">
                  <span className="Options">申请时间：</span>
                  <span className="content">{drawDetail.createTime}</span>
                </div>
                <div className="item">
                  <span className="Options">申请金额：</span>
                  <span className="content">{drawDetail.amount}</span>
                </div>
                <div className="item">
                  <span className="Options">申请人：</span>
                  <span className="content">{drawDetail.realName}</span>
                </div>
                <div className="item">
                  <span className="Options">账号类型：</span>
                  <span className="content">
                    {drawDetail.accountType === 0 ? '银行卡' : '支付宝'}
                  </span>
                </div>
                <div className="item">
                  <span className="Options">收款账户：</span>
                  <span className="content">{drawDetail.payeeAccount}</span>
                </div>
                <div className="item">
                  <span className="Options">收款人：</span>
                  <span className="content">{drawDetail.payee}</span>
                </div>
              </div>
              <span className="tip">我已经确认对账，正确无误</span>
            </>
          ) : (
            <>
              <div className="reason">
                <span className="title">驳回原因：</span>
                <TextArea
                  className="input"
                  rows={4}
                  value={this.state.reason}
                  onChange={this.handleInputReason}
                />
              </div>
            </>
          )}
        </Modal>
      </div>
    )
  }
}

export default Cash
