/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/7 下午3:53:02
 * LastEditor:  your name
 * ModifyTime:  2020/12/24 下午3:57:51
 * Description: 代理人管理--添加代理人
 */
import React, { useState } from 'react'
import { Form, Row, Col, Button, Input, Space, notification, Table } from 'antd'
import { Link, Route } from 'react-router-dom'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import HeaderTitle from '../../components/HeaderTitle/HeaderTitle'
import { AgentpcLink, AgentpcRoute } from '../../components/AgentpcRouter/AgentpcRouter'

import './adminaddagent.less'
import '../../common/globalstyle.less'

class Adminaddagent extends React.Component {
  constructor(...args) {
    super(...args)

    // 表格基础配置
    this.columns = [
      {
        align: 'center',
        title: '昵称',
        dataIndex: 'userName',
        key: 'userName',
        // width: 200,
        ellipsis: true,
        render: data => (
          <>
            <p>{data}</p>
          </>
        ),
      },
      {
        align: 'center',
        title: '账号',
        dataIndex: 'phonenumber',
        key: 'phonenumber',
        // width: 200,
        ellipsis: true,
      },
      {
        align: 'center',
        title: '级别',
        dataIndex: 'levelName',
        key: 'levelName',
        // width: 100,
        ellipsis: true,
      },
      {
        align: 'center',
        title: '新增时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // width: 200,
        ellipsis: true,
      },
      {
        align: 'center',
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Space size="small" direction="vertical" className="btnArea">
            <Button
              ghost
              type="primary"
              size="small"
              onClick={this.handleToUpdate.bind(this, record)}
            >
              修改
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
    }
  }

  componentDidMount() {
    document.title = 'IST - 添加代理人'

    this.getAgentUserList({ current: 1, len: this.state.pageSize })
  }

  // 获取代理人信息列表
  getAgentUserList = data => {
    const dataObj = data
    post(servicePath.getListAdminAgent, dataObj)
      .then(res => {
        if (res.data.code === 0) {
          console.log('新增代理人信息列表', res.data)
          const data = res.data.data.records

          this.setState({
            data,
            current: dataObj.current,
            totalNum: res.data.data.total,
            pageSize: res.data.data.size,
          })
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

  // 表单提交事件
  onFinish = values => {
    console.log('表单输出: ', values)

    let data = values
    // 如果有条件为空，则删除这个属性
    if (data.phonenumber === '') {
      delete data.phonenumber
    } else if (data.userName === '') {
      delete data.userName
    }

    this.setState({
      searchParms: data,
    })

    this.getAgentUserList({ current: 1, len: this.state.pageSize, ...data })
  }

  onReset = () => {
    this.searchform.current.resetFields()
    this.getAgentUserList({ current: 1, len: this.state.pageSize })
  }

  // 当前页面修改
  handleChangePage = (page, pageSize) => {
    console.log('切换页数:', page)
    const params = this.state.searchParms !== {} ? { ...this.state.searchParms } : { skey: '' }
    this.getAgentUserList({
      current: page,
      len: pageSize,
      state: 0,
      ...params,
    })
  }

  // 跳转到修改代理人页面
  handleToUpdate = record => {
    // console.log(record)
    this.props.history.push(
      process.env.pathConstants + '/index/adminAddAgent/updateagent/' + record.userId
    )
  }

  render() {
    this.searchform = React.createRef()

    return (
      <div id="Adminaddagent">
        <HeaderTitle title="添加代理人"></HeaderTitle>

        {/* 添加按钮 */}
        <Button type="primary" size="middle" className="addAgentBtn">
          <AgentpcLink to="/index/adminAddAgent/addAgent/">添加代理人</AgentpcLink>
        </Button>

        {/* 筛选 */}
        <Form ref={this.searchform} name="search" className="search" onFinish={this.onFinish}>
          <div className="center">
            <Form.Item name="phonenumber" className="form_item" label="手机号">
              <Input placeholder="代理人手机号" />
            </Form.Item>
            <Form.Item name="userName" className="form_item" label="昵称">
              <Input placeholder="昵称" />
            </Form.Item>
            <div className="form_item2">
              <Button type="primary" className="submit_btn" htmlType="submit">
                查询
              </Button>
              <Button className="reset" htmlType="button" onClick={this.onReset}>
                重置
              </Button>
            </div>
          </div>
        </Form>

        {/* 表格 */}
        <Table
          columns={this.columns}
          className="agentList"
          dataSource={this.state.data}
          rowKey="userId"
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
    )
  }
}

export default Adminaddagent
