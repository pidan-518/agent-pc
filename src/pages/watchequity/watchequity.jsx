import React, { Component } from 'react'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import './watchequity.less'

export class Watchequity extends Component {
  constructor(...args) {
    super(...args)

    this.state = {
      levelName: '', // 等级名字
      levelequity: [], // 权益列表
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

  render() {
    const { levelName, levelequity } = this.state
    return (
      <div id="watchequity">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">查看权益</span>
        </div>
        <div>
          <h3 className="levelName">{levelName}权益</h3>
          <div className="equityList">
            {levelequity.map((item, index) => {
              return <p key={item.id}>{index + 1}、{item.rightInterestsName}</p>
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default Watchequity
