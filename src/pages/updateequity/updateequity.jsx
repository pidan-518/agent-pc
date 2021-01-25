/* File Info
 * Author:      your name
 * CreateTime:  2020/12/8 下午2:23:53
 * LastEditor:  your name
 * ModifyTime:  2020/12/15 上午10:17:34
 * Description: 代理人管理--修改权益
 */
import React, { useState } from 'react'
import { Form, Input, Button, notification, Select, message } from 'antd'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './updateequity.less'
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
      eName: null, // 权益名称
      levelId: 6, // 等级ID
      profitMode: 0, // 分润模式 / 分润来源？
      profitAmount: 0.0, // 分润金额
      profitRate: 0, // 分润比例
      SourceLevel: 0, // 收益来源分销等级
    }
  }

  componentDidMount() {
    document.title = 'IST - 权益修改'

    this.getAgentLevelList()

    const eid = this.props.match.params.id
    this.getInterestsConfigById(eid)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.eName !== this.state.eName && this.state.eName) {
      this.formRef.current.resetFields()
    }
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

  // 根据ID获取权益详情
  getInterestsConfigById = eId => {
    post(servicePath.getInterestsConfigById, { id: eId })
      .then(res => {
        if (res.data.code === 0) {
          console.log('获取权益详情：', res.data.data)
          const eName = res.data.data.rightInterestsName
          const levelId = res.data.data.levelId
          const profitMode = res.data.data.profitSharingMode
          const profitAmount = res.data.data.profitSharingAmount
          const profitRate = res.data.data.profitSharingRate
          const SourceLevel = res.data.data.interestsSourceLevel

          this.setState({
            eName,
            levelId,
            profitMode,
            profitAmount,
            profitRate,
            SourceLevel,
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
    const eid = this.props.match.params.id
    let dataChange = {id: eid, ...values}

    for (var i in values) {
      if (!values[i] || values[i] === '') {
        dataChange[i] = 0
      }
    }
    console.log('整合数据: ', dataChange)

    post(servicePath.getInterestsConfigEdit, dataChange)
      .then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          // 提示框
          notification['success']({
            message: '修改成功',
            description: `您已成功修改了该权益`,
          })
          // 返回上一级
          setTimeout(() => {
            this.props.history.go(-1)
          }, 1000)
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
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
    // console.log(v)
    if (v === '') v = '0'
    if (v) this.formRef.current.setFieldsValue({ profitSharingAmount: v })
  }

  // 分润比例
  handleChangeProfitRate = e => {
    let v = String(e.target.value)
    console.log('分润比例', v)
    if (v === '') v = '0'
    if (v) this.formRef.current.setFieldsValue({ profitSharingRate: v })
  }

  render() {
    this.formRef = React.createRef()
    const {
      levelList,
      eName,
      levelId,
      profitMode,
      profitAmount,
      profitRate,
      SourceLevel,
    } = this.state

    return (
      <div id="updateequity">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">权益修改</span>
        </div>

        <Form
          ref={this.formRef}
          name="addFrom"
          layout="horizontal"
          onFinish={this.onFinish}
          className="addFrom"
          initialValues={{
            rightInterestsName: eName,
            levelId: levelId,
            profitSharingMode: profitMode,
            profitSharingAmount: profitAmount,
            profitSharingRate: profitRate,
            interestsSourceLevel: SourceLevel,
          }}
        >
          <Form.Item
            label="权益名称"
            className="form_item"
            name="rightInterestsName"
            shouldUpdate
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
            <Input placeholder="请输入权益名称" />
          </Form.Item>
          <Form.Item
            label="所属级别"
            name="levelId"
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
                message: '仅支持小数点后两位的正数',
              },
            ]}
            onBlur={this.handleChangeProfitAmount}
          >
            <Input placeholder="请输入分润金额" allowClear />
          </Form.Item>
          <Form.Item
            label="分润比例"
            name="profitSharingRate"
            rules={[
              {
                pattern: /^(100)(\.0{1,2})?$|^((\d|[1-9]\d)(\.\d{1,2})?)$/,
                message: '只能为0-100%，最多支持两位小数！',
              },
            ]}
            onBlur={this.handleChangeProfitRate}
          >
            <Input placeholder="请输入分润比例" suffix="%"/>
          </Form.Item>
          <Form.Item label="分润来源等级" name="interestsSourceLevel">
            <Select placeholder="请选择" allowClear>
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
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Addequity
