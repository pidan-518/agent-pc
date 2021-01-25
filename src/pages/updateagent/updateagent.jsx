/* File Info
 * Author:      your name
 * CreateTime:  2020/12/8 下午2:23:53
 * LastEditor:  your name
 * ModifyTime:  2020/12/25 下午3:26:25
 * Description: 代理人管理--修改代理人
 */
import React, { useState } from 'react'
import { Form, Input, Button, notification, message } from 'antd'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import HeaderTitle from '../../components/HeaderTitle/HeaderTitle'

import './updateagent.less'
import '../../common/globalstyle.less'

class Updateagent extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      userName: '',
      userId: null,
      password: null,
      // agentLevelId: null,
      // realState: null,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userName !== this.state.userName && this.state.userName) {
      this.formRef.current.resetFields()
    }
  }

  componentDidMount() {
    document.title = 'IST - 代理人修改'

    this.getselectAgentUserDetail()
    // console.log(this.props.match.params.id)
  }

  // 请求代理人详情
  getselectAgentUserDetail = () => {
    const userId = this.props.match.params.id
    post(servicePath.selectAgentUserDetail, { userId })
      .then(res => {
        if (res.data.code === 0) {
          const details = res.data.data
          console.log('代理人详情', details)

          this.setState({
            userName: details.userName,
            password: null,
            userId: userId,
            // agentLevelId: details.agentLevelId,
            // phonenumber: details.phonenumber,
            // realState: details.realState,
          })
        } else {
          notification['warning']({
            message: '请求异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => console.log(err))
  }

  // 表单提交事件
  onFinish = values => {
    const addData = {...values, userId: this.state.userId,}
    console.log('表单输出: ', addData)
    post(servicePath.getUpdateAdminAgent, addData)
      .then(res => {
        console.log('修改请求：', res)
        if (res.data.code === 0) {
          notification['success']({
            message: '修改成功',
            description: res.data.msg,
          })
          // 返回上一级
          setTimeout(()=>{
            this.props.history.go(-1)
          }, 1000)
        } else {
          notification['warning']({
            message: '请求异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => alert(err))
  }

  handleChangeName = e => {
    const v = e.target.value.replace(/\s+/g, '') === '' ? null : e.target.value.replace(/\s+/g, '')
    if (v) this.formRef.current.setFieldsValue({ equityName: v })
  }

  render() {
    this.formRef = React.createRef()

    return (
      <div id="Updateagent">
        <HeaderTitle title='代理人修改'></HeaderTitle>

        <Form
          ref={this.formRef}
          name="addFrom"
          layout="horizontal"
          onFinish={this.onFinish}
          className="updateFrom"
          initialValues={{
            userName: this.state.userName,
          }}
        >
          <Form.Item
            label="昵称"
            name="userName"
            hasFeedback
            rules={[
              {
                required: true,
                message: '必须输入昵称！',
              },
              {
                whitespace: true,
                message: '错误的昵称格式',
              },
            ]}
            onChange={this.handleChangeName}
          >
            <Input placeholder="请输入新昵称" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '必须输入密码！',
              },
              {
                max: 16,
                message: '新密码应为6-16位！',
              },
              {
                min: 6,
                message: '新密码应为6-16位！',
              },
            ]}
            // onBlur={this.handleChangeProfitAmount}
          >
            <Input placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item className='button'>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Updateagent
