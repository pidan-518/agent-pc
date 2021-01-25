import React, { Component } from 'react'

import { Modal, Button, notification } from 'antd'

import del from '../../static/agent/del.png'
import edit from '../../static/agent/edit.png'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './changeequity.less'

export class Watchequity extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      levelName: '',
      equityName: '',
      visible: false,
      levelequity: [], // 权益列表
      equityId: null, // 权益ID
    }
  }

  componentDidMount() {
    const levelName = this.props.match.params.name
    const levelId = this.props.match.params.id

    this.getInterestsConfigList(levelId)

    this.setState({
      levelName,
    })
  }

  // 获取等级权益
  getInterestsConfigList = levelId => {
    post(servicePath.getInterestsConfigList, { levelId })
      .then(res => {
        if (res.data.code === 0) {
          console.log('等级权益列表获取成功：', res.data.data)
          const newarr = res.data.data

          this.setState({
            levelequity: newarr,
          })
        } else {
          console.log('响应异常:', res.data.msg)
        }
      })
      .catch(err => console.log(err))
  }

  // -------------------------删除---------------------------
  // 显示模态框
  showModal = (index, id) => () => {
    const equityName = this.state.levelequity[index].rightInterestsName
    this.setState({
      visible: true,
      equityName,
      equityId: id,
    })
  }

  // 确认删除
  handleOk = () => {
    const id = this.state.equityId

    post(servicePath.getInterestsConfigDelete, { id })
      .then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          const levelId = this.props.match.params.id

          // 提示框
          notification['success']({
            message: '成功删除',
            description: `您已成功删除 ${this.state.equityName} 权益`,
          })

          this.setState({ visible: false, equityId: null, equityName: '' })
          // 重新请求权益列表
          this.getInterestsConfigList(levelId)
        } else {
          notification['warning']({
            message: '发生异常',
            description: res.data.msg,
          })
        }
      })
      .catch(err => console.log(err))
  }

  // 取消模态框
  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleToUpdate = id => () => {
    this.props.history.push({ pathname: process.env.pathConstants +'/index/baseset/updateequity/' + id })
  }

  render() {
    const { visible, levelequity } = this.state

    return (
      <div id="changeequity">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">权益修改</span>
        </div>
        <div>
          <h3 className="levelName">{this.state.levelName}权益</h3>
          <div className="equityList">
            {levelequity.map((item, index) => {
              return (
                <div className="item" key={item.id}>
                  <div className="equity">
                    {index + 1}、{item.rightInterestsName}
                  </div>
                  <div className="btnView">
                    <Button
                      type="text"
                      className="del_btn"
                      icon={<img className="del_icon" alt='删除' src={del}></img>}
                      size="small"
                      onClick={this.showModal(index, item.id)}
                    >
                      删除
                    </Button>
                    <Button
                      className="edit_btn"
                      icon={<img className="edit_icon" alt='修改' src={edit}></img>}
                      type="text"
                      size="small"
                      onClick={this.handleToUpdate(item.id)}
                    >
                      修改
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* 模态框 */}
        <Modal
          visible={visible}
          title="警告"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              删除
            </Button>,
          ]}
        >
          <p>确认要删除 {this.state.equityName} 吗？</p>
        </Modal>
      </div>
    )
  }
}

export default Watchequity
