/* File Info
 * Author:      your name
 * CreateTime:  2020/12/8 下午2:23:53
 * LastEditor:  your name
 * ModifyTime:  2020/12/8 下午2:25:01
 * Description: 代理人管理--添加权益
 */
import React, { useState } from 'react'
import { Form, Input, Button, Radio, Select, notification } from 'antd'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './addequity.less'
import '../../common/globalstyle.less'

class Addequity extends React.Component {
  constructor(...args) {
    super(...args)

    // 分润模式
    this.profitModeList = [
      '没有分润',
      '介绍费',
      '直推',
      '间推',
      '平级间推',
      '自购分享',
      '直属自购分享',
      '间推自购分享',
      '平级直属自购分享',
      '直播收益',
      '直属直播收益',
      '间推直播收益',
      '平级直播收益',
      '新人奖金直推',
      '新人奖金间推',
      '新人奖金平推',
    ]

    this.state = {
      levelList: [], // 等级列表
      send: false, // 按钮状态
    }
  }

  componentDidMount() {
    document.title = 'IST - 添加权益'

    this.getAgentLevelList()
  }

  // 获取等级列表
  getAgentLevelList = () => {
    post(servicePath.getAgentLevelList)
      .then(res => {
        // console.log(res)
        const level = res.data.data.reverse().map(item => {
          return item
        })
        console.log('获取等级列表：', level)

        this.setState({
          levelList: level,
        })
      })
      .catch(err => console.log(err))
  }

  // 表单提交事件
  onFinish = values => {
    // console.log('表单输出: ', values)

    let dataAdd = {}
    for (var i in values) {
      if (values[i] !== undefined && values[i] !== '') {
        dataAdd[i] = values[i]
      }
    }
    console.log('整合数据: ', dataAdd)

    this.setState({send: true})

    post(servicePath.getInterestsConfigAdd, dataAdd)
      .then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          // 提示框
          notification['success']({
            message: '成功添加',
            description: `您已成功添加一条权益`,
          })
          // 返回上一级
          setTimeout(()=>{
            this.props.history.go(-1)
          }, 1000)
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
          setTimeout(() => {
            this.setState({ send: false })
          }, 1000)
        }
      })
      .catch(err => console.log(err))
  }

  // 权益名称
  handleChangeName = e => {
    const v = e.target.value.replace(/\s+/g, '') === '' ? null : e.target.value.replace(/\s+/g, '')
    if (v) this.formRef.current.setFieldsValue({ rightInterestsName: v })
  }

  // 分润金额
  handleChangeProfitAmount = e => {
    let v = String(e.target.value)
    console.log(v)
    if (v.indexOf('.') === -1 && v != '' && v !== '0') v = v + '.00'
    if (v) this.formRef.current.setFieldsValue({ profitSharingAmount: v })
  }

  // 分润比例
  handleChangeProfitRate = e => {
    let v = String(e.target.value)
    console.log(v)
    if (v.indexOf('.') === -1 && v != '' && v != 100) v = v + '.00'
    if (v) this.formRef.current.setFieldsValue({ profitSharingRate: v })
  }

  render() {
    this.formRef = React.createRef()
    const { levelList, send } = this.state

    return (
      <div id="Addequity">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">添加权益</span>
        </div>

        <Form
          ref={this.formRef}
          name="addFrom"
          layout="horizontal"
          onFinish={this.onFinish}
          className="addFrom"
          initialValues={
            {
              // profitMode: 0,
              // profitAmount: 0.0,
              // profitRate: 0.0,
              // SourceLevel: 0,
            }
          }
        >
          <Form.Item
            label="权益名称"
            className="form_item"
            name="rightInterestsName"
            hasFeedback
            rules={[
              {
                required: true,
                message: '必须输入权益名称！',
              },
              {
                whitespace: true,
                message: '名称不可包含空格',
              },
              {
                max: 32,
                message: '名称输入过长！',
              },
              {
                min: 1,
                message: '名称不可为空！',
              },
            ]}
            onChange={this.handleChangeName}
          >
            <Input placeholder="请输入权益名称" allowClear/>
          </Form.Item>
          <Form.Item
            label="所属级别"
            name="levelId"
            hasFeedback
            rules={[
              {
                required: true,
                message: '必须选择所属级别！',
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
          <Form.Item label="分润模式" name="profitSharingMode">
            <Select placeholder="请选择" allowClear>
              {this.profitModeList.map((item, index) => {
                return (
                  <Select.Option key={index} value={index}>
                    {item}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="分润金额"
            name="profitSharingAmount"
            rules={[
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: '仅支持到小数点后两位',
              },
            ]}
            onBlur={this.handleChangeProfitAmount}
          >
            <Input placeholder="请输入分润金额" type="number" />
          </Form.Item>
          <Form.Item
            label="分润比例"
            name="profitSharingRate"
            rules={[
              {
                pattern: /^(100)$|^((\d|[1-9]\d)(\.\d{1,2})?)$/,
                message: '只能为0-100%！',
              },
            ]}
            onBlur={this.handleChangeProfitRate}
          >
            <Input placeholder="请输入分润比例" suffix="%" type="number" />
          </Form.Item>
          <Form.Item label="分润来源等级" name="interestsSourceLevel">
            <Select placeholder="请选择">
              <Select.Option key="0" value={0}>
              不分等级
              </Select.Option>
              {levelList.map(item => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                )
              })}
            </Select>
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
