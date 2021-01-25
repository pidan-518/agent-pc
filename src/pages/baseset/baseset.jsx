/* File Info
 * Author:      dzk
 * CreateTime:  2020/12/7 下午3:53:02
 * LastEditor:  your name
 * ModifyTime:  2020/12/28 上午9:48:37
 * Description: 代理人管理--基础设置
 */

import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

import watch from '../../static/agent/watch.png'
import edit from '../../static/agent/edit.png'

import { post } from '../../common/util/axios'
import servicePath from '../../common/util/api/apiUrl'

import { AgentpcLink, AgentpcRoute} from "../../components/AgentpcRouter/AgentpcRouter";

import './baseset.less'
import '../../common/globalstyle.less'

class Baseset extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      levelList: [], // 表格数据
    }
  }

  componentDidMount() {
    document.title = 'IST - 基础设置'

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
    console.log('表单输出: ', values)
  }

  handleToWatch = item => {
    this.props.history.push(process.env.pathConstants +`/index/baseset/watchequity/${item.id}${item.name}`)
  }

  handleToChange = item => {
    this.props.history.push(process.env.pathConstants +`/index/baseset/changeequity/${item.id}${item.name}`)
  }

  render() {
    return (
      <div id="Baseset">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">等级权益</span>
        </div>

        <Button type="primary" size="middle" className="addEquityBtn">
          <AgentpcLink to="/index/baseset/addequity/">添加等级权益</AgentpcLink>
        </Button>

        <div className="levelView">
          {this.state.levelList.map(item => {
            return (
              <div className="levelItem" key={item.id}>
                <span className="levelTitle">{item.name}:</span>
                <Button
                  type="text"
                  onClick={this.handleToWatch.bind(this, item)}
                  className="checkBtn"
                  icon={<img className="watch_icon" src={watch}></img>}
                >
                  查看
                </Button>
                <Button
                  type="text"
                  onClick={this.handleToChange.bind(this, item)}
                  className="changeBtn"
                  icon={<img className="edit_icon" src={edit}></img>}
                >
                  修改
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Baseset
