/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/7 上午9:21:07
 * LastEditor:  your name
 * ModifyTime:  2020/12/7 下午4:27:36
 * Description: 财务--财务记录--提现记录
 */

import React from 'react'
import { Form, Input, Button, Select, DatePicker, Table, Popover } from 'antd'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import qee from 'qf-export-excel'

import './extraction.less'
import '../../common/globalstyle.less'

class Success extends React.Component {
  constructor(...args) {
    super(...args)

    this.successTable = React.createRef()

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
        dataIndex: 'applicationTime',
        key: 'applicationTime',
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
        title: '支付时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // width: 200,
        ellipsis: true,
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
    ]

    this.state = {
      data: [], // 表格数据
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      bankList: [], // 银行列表
      alldata: [], // 总数据
      searchParms: {}, // 搜索条件
    }
  }

  componentDidMount() {
    document.title = 'IST - 提现记录'

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
              this.getDrawAdminList({ current: 1, len: 10, state: 1 })
            }
          )
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 导出excel表
  handleExportExcel = () => {
    this.getDrawAdminList(
      { current: 1, len: this.state.totalNum, state: 1, ...this.state.searchParms },
      'all'
    )
  }

  // 请求提现申请列表
  getDrawAdminList = (parms, type = 'page') => {
    post(servicePath.getRecordList, parms)
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
                dataIndex: 'applicationTime',
                key: 'applicationTime',
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
                title: '支付时间',
                dataIndex: 'createTime',
                key: 'createTime',
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
                qee(columns, this.state.alldata, '提现成功')
              }
            )
          } else {
            this.setState({
              data,
              totalNum,
              current: parms.current,
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 修改页面数据长度
  handleChangePageSize = e => {
    const pageSize = e.target.value

    if (pageSize > this.state.pageSize) {
      this.getDrawAdminList({ current: 1, len: pageSize, state: 1, ...this.state.searchParms })
    }

    this.setState({
      pageSize,
    })
  }

  // 当前页面修改
  handleChangePage = (page, pageSize) => {
    console.log('切换页数:', page)
    const params = this.state.searchParms !== {} ? { ...this.state.searchParms } : { skey: '' }
    this.getDrawAdminList({ current: page, len: pageSize, state: 1, ...params })
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
    this.getDrawAdminList({ current: 1, len: this.state.pageSize, state: 1, ...search })
  }

  // 表单重置
  onReset = () => {
    this.searchform.current.resetFields()
    this.getDrawAdminList({ current: 1, len: this.state.pageSize, state: 1 })
    this.setState({
      searchParms: null,
    })
  }

  render() {
    const { Option } = Select
    const { RangePicker } = DatePicker
    const { bankList } = this.state

    this.searchform = React.createRef()

    return (
      <div id="extraction">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">提现记录</span>
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
          <div className="form_item"></div>
          <div className="form_item btn_area"></div>
          <div className="form_item btn_area">
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
            <Radio.Group buttonStyle="solid" defaultValue="10" onChange={this.handleChangePageSize}>
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
      </div>
    )
  }
}

export default Success
