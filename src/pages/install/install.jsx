import React from "react";
import "./install.less";
import servicePath from "../../common/util/api/apiUrl";
import { post } from "../../common/util/axios";
import { Layout, Menu, Icon } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AgentpcLink,
  AgentpcRoute,
} from "../../components/AgentpcRouter/AgentpcRouter";
import { Link, Route } from "react-router-dom";

import RegionalDirector from "../../static/scattered/regionalDirector.png";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

export class Install extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      collapsed: false,
      items: [], //获取到的等级列表
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  handleClickArticle = () => {};

  // 接口 获取到的等级列表
  getList = () => {
    post(servicePath.getAgentLevelList, {})
      .then((res) => {
        console.log("请求成功了", res.data.data);
        const List = res.data.data;
        List.forEach((item, index) => {
          switch (item.name) {
            case "区域总监":
              List[
                index
              ].img = require("../../static/scattered/regionalDirector.png");
              break;
            case "业务总监":
              List[
                index
              ].img = require("../../static/scattered/salesDirector.png");
              break;
            case "区域经理":
              List[
                index
              ].img = require("../../static/scattered/areamanager.png");
              break;
            case "业务经理":
              List[index].img = require("../../static/scattered/manager.png");
              break;
            case "网红店长":
              List[
                index
              ].img = require("../../static/scattered/shopOrdersToReview.png");
              break;
            case "电商达人":
              List[index].img = require("../../static/scattered/expert.png");
              break;
            default:
              break;
          }
        });
        this.setState({
          items: List,
        });
      })
      .catch((err) => {});
  };

  componentDidMount() {
    document.title = "代理人设置";
    this.getList();
  }

  render() {
    const { collapsed, items } = this.state;
    return (
      <div className="pc-agentInstall">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">代理人设置</span>
        </div>
        {/* 标题结束 */}
        {/* 功能栏开始 */}
        <div className="agentInstall-function">
          <div className="function-list">
            {items.map((item, index) => {
              return (
                <AgentpcLink to={"/index/installProxy/" + item.id + item.name}>
                  <div
                    className="list-item"
                    // onClick={this.goToinstallproxy}
                  >
                    <div className="item-expert">
                      <div className="bgcolor">
                        <img className="bgimage" src={item.img} />
                      </div>
                    </div>
                    <text className="item-text">{item.name}</text>
                  </div>
                </AgentpcLink>
              );
            })}
          </div>
        </div>
        {/* 功能栏结束 */}
      </div>
    );
  }
}

export default Install;
