/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/8 下午2:23:53
 * LastEditor:  your name
 * ModifyTime:  2020/12/25 上午11:53:18
 * Description: 代理人管理--添加代理人
 */
import React from 'react'
import { Form, Input, Button, Select, message, notification } from 'antd'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './addagent.less'
import '../../common/globalstyle.less'

class Addequity extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      levelList: [],
      equityName: '',
      countdown: 60,
      timeFlag: true,
      send: false,
    }

    this.timeDown = null
    this.control = true // 短信节流控制
  }

  componentDidMount() {
    document.title = 'IST - 添加代理人'

    this.getAgentLevelList()
  }

  // 获取等级列表
  getAgentLevelList = () => {
    post(servicePath.getAgentLevelList)
      .then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          const level = res.data.data.reverse().map(item => {
            return item
          })
          console.log('获取等级列表：', level)

          this.setState({
            levelList: level,
          })
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => console.log(err))
  }

  // 表单提交事件
  onFinish = values => {
    console.log('表单输出: ', values)
    const dataAdd = values

    this.setState({ send: true })

    post(servicePath.getAddAdminAgent, dataAdd)
      .then(res => {
        if (res.data.code == 0) {
          notification['success']({
            message: '添加申请提交成功',
            description: res.data.data,
          })
          // 返回上一级
          setTimeout(() => {
            this.props.history.go(-1)
          }, 1000)
        } else {
          notification['warning']({
            message: '添加异常',
            description: res.data.msg,
          })
          setTimeout(() => {
            this.setState({ send: false })
            this.control = true
          }, 1000)
        }
      })
      .catch(err => console.log(err))
  }

  handleChangeName = e => {
    const v = e.target.value.replace(/\s+/g, '') === '' ? null : e.target.value.replace(/\s+/g, '')
    if (v) this.formRef.current.setFieldsValue({ equityName: v })
  }

  handleChangeProfitRate = e => {
    let v = String(e.target.value)
    // console.log(v)
    if (v.indexOf('.') === -1 && v != '' && v != 100) v = v + '.00'
    if (v) this.formRef.current.setFieldsValue({ profitRate: v })
  }

  // 获取短信
  handleGetSmsCode = () => {
    this.formRef.current
      .validateFields(['phonenumber'])
      .then(values => {
        // console.log('手机号验证通过：', values)
        const phone = values.phonenumber

        console.log('触发节流：', this.control)

        if (this.control) {
          this.control = false // 开启节流
          post(servicePath.checkPhonenumber, { phonenumber: phone })
            .then(res => {
              // console.log(res)
              if (res.data.code == 0) {
                this.handleSendSms(phone) // 发送短信
              } else {
                this.control = true
                message.warn(res.data.msg)
              }
            })
            .catch(err => console.log(err))
        }
      })
      .catch(errorInfo => {
        // console.log(errorInfo)
        message.error('请输入正确的手机号！')
      })
  }

  // 发送短信
  handleSendSms = phone => {
    post(servicePath.getregisterSmsCode, { phonenumber: phone })
      .then(res => {
        // console.log(res)
        if (res.data.code == 0) {
          message.success('短信发送成功')

          // 开始倒计时
          this.handleBeginCountdown()
        } else {
          this.control = true
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => console.log(err))
  }

  // 倒计时
  handleBeginCountdown = () => {
    console.log(this.state.timeFlag)
    if (this.state.timeFlag) {
      this.timeDown = setInterval(() => {
        if (this.state.countdown === 0) {
          this.control = true
          clearInterval(this.timeDown)
          this.setState({
            timeFlag: true,
            countdown: 60,
          })
        } else {
          this.setState({
            timeFlag: false,
            countdown: this.state.countdown - 1,
          })
        }
      }, 1000)
    }
  }

  render() {
    this.formRef = React.createRef()
    const { levelList, send } = this.state

    return (
      <div id="Addagent">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">添加代理人</span>
        </div>

        <Form
          ref={this.formRef}
          name="addFrom"
          layout="horizontal"
          onFinish={this.onFinish}
          className="addFrom"
          initialValues={{
            phonenumber: '',
            // profitAmount: 0.0,
            // profitRate: 0.0,
            // SourceLevel: 0,
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
                message: '昵称不可包含空格',
              },
              {
                max: 32,
                message: '昵称输入过长！',
              },
              {
                min: 1,
                message: '昵称不可为空！',
              },
            ]}
            onChange={this.handleChangeName}
          >
            <Input placeholder="请输入权益名称" />
          </Form.Item>
          <Form.Item
            label="账号"
            name="phonenumber"
            hasFeedback
            validateFirst
            rules={[
              {
                required: true,
                message: '必须输入账号！',
              },
              {
                whitespace: true,
                message: '账号不可包含空格',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/
                  const HKphoneReg = /^([5|6|8|9])\d{7}$/
                  const isPhone = phoneReg.test(value) || HKphoneReg.test(value)
                  if (isPhone) {
                    return Promise.resolve()
                  }
                  return Promise.reject('请输入正确的手机号！')
                },
              }),
            ]}
            // onChange={this.handleChangePhonenumber}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: '必须输入密码！',
              },
              {
                min: 6,
                message: '密码长度为6-16位',
              },
              {
                max: 16,
                message: '密码长度为6-16位',
              },
            ]}
            // onBlur={this.handleChangePassword}
          >
            <Input placeholder="请输入密码" type="password" />
          </Form.Item>
          <div className="form_item">
            <Form.Item
              label="验证码"
              name="smsCode"
              // onBlur={this.handleChangeSmsCode}
              className="Captcha"
              rules={[{ required: true, message: '验证码不能为空!' }]}
            >
              <Input placeholder="请输入验证码" className="inputCaptcha" />
            </Form.Item>
            <Button
              type="primary"
              className="getCaptcha"
              onClick={this.handleGetSmsCode}
              disabled={!this.state.timeFlag}
            >
              {this.state.timeFlag ? '获取验证码' : `请${this.state.countdown}秒后重试`}
            </Button>
          </div>

          <Form.Item
            label="等级"
            name="agentLevelId"
            hasFeedback
            rules={[
              {
                required: true,
                message: '必须选择等级！',
              },
            ]}
          >
            <Select placeholder="请选择" allowClear>
              {levelList.map(item => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="推荐码"
            name="recommendCode"
            // hasFeedback
            // onChange={this.handleChangeRecommendCode}
            rules={[
              {
                max: 6,
                message: '错误的推荐码',
              },
            ]}
          >
            <Input placeholder="请输入推荐码" />
          </Form.Item>
          <Form.Item className="button">
            <Button type="primary" htmlType="submit" disabled={send}>
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Addequity
