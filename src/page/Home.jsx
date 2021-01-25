import React from "react";
import "./Home.less";
import { Layout, Menu, ConfigProvider, Select, Dropdown, Badge } from "antd";
import { DesktopOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Link, Route, withRouter } from "react-router-dom";
import "../common/globalstyle.less";
import { DownOutlined } from "@ant-design/icons";
import zhCN from "antd/es/locale/zh_CN"; // 引入中文包

import Cash from "../pages/cash/cash"; // 财务-财务操作--dzk
import SuccesExtraction from "../pages/extraction/success"; // 财务-提现记录--dzk
import FailExtraction from "../pages/extraction/fail"; // 财务-驳回记录--dzk
import Statistics from "../pages/statistics/statistics"; // 财务-财务统计--dzk
import Baseset from "../pages/baseset/baseset"; // 代理人管理-基础设置--dzk
import AddEquity from "../pages/addequity/addequity"; // 代理人管理-基础设置-添加权益--dzk
import Watchequity from "../pages/watchequity/watchequity"; // 代理人管理-基础设置-查看权益--dzk
import Changeequity from "../pages/changeequity/changeequity"; // 代理人管理-基础设置-修改权益--dzk
import Updateequity from "../pages/updateequity/updateequity"; // 代理人管理-基础设置-更新权益--dzk
import AdminAddAgent from "../pages/adminaddagent/adminaddagent"; // 代理人管理-添加代理人--dzk
import AddAgent from "../pages/addagent/addagent"; // 代理人管理-添加代理人-添加--dzk
import Updateagent from "../pages/updateagent/updateagent"; // 代理人管理-添加代理人-修改--dzk
import Demote from "../pages/demote/demote"; // wq--降级审核
import unDemote from "../pages/undemote/undemote"; // wq--暂不降级
import DemoteDeteils from "../pages/demotedetails/demotedetails"; // wq--降级审核+暂不降级详情
import Message from "../pages/message/message"; // wq--系统消息
import Commission from "../pages/commission/commission"; // wq--佣金记录
import CommDetails from "../pages/commdetails/commdetails"; // wq--佣金记录（单人）

import Index from "../pages/index/index"; //首页 kzh
import AgentInformation from "../pages/agentinformation/agentinformation"; //代理人信息 kzh
import AgentDetails from "../pages/agentdetails/agentdetails"; //代理人详情 kzh
import AgentSetup from "../pages/agentsetup/agentsetup"; //代理人设置 kzh
import StaffMangementSet from "../pages/staffmangementset/staffmangementset"; //职员管理 降级原因 kzh
import AddDownReason from "../pages/adddownreason/adddownreason"; //添加降级原因 kzh
import Marketing from "../pages/marketing/marketing"; //营销 kzh
import AddAdministrator from "../pages/addadministrator/addadministrator"; //添加管理员 kzh
import Jurisdiction from "../pages/jurisdiction/jurisdiction"; //权限 kzh
import AddRole from "../pages/addrole/addrole"; //添加角色 kzh
import AuditList from "../pages/auditlist/auditlist"; //超级管理员 审核 kzh
import AuditHistory from "../pages/audithistory/audithistory"; //超级管理员 审核历史记录 kzh
import Relationships from "../pages/relationships/relationships"; //代理人关系 kzh

import Newuser from "../pages/newuser/newuser"; //财务管理-新人奖金  ---  cyl
import Newuserdetails from "../pages/newuserdetails/newuserdetails"; //财务管理-新人奖金-奖金详情  ---  cyl
import Install from "../pages/install/install"; //代理人管理-代理人设置  ---  cyl
import Installproxy from "../pages/installproxy/installproxy"; //代理人管理-代理人设置  ---  cyl
import Administrator from "../pages/administrator/administrator"; //权限管理-管理员  ---  cyl
import Permissions from "../pages/permissions/permissions"; //权限管理-权限角色  ---  cyl
import TeacherDetail from "../pages/teacherdetail/teacherdetail"; // 讲师与课程-讲师详情 ---li
import TeacherList from "../pages/teacherlist/teacherlist"; // 讲师与课程-讲师列表 ---li
import AddTeacher from "../pages/addteacher/addteacher"; // 讲师与课程-添加讲师 ---li
import Reserved from "../pages/reserved/reserved";
import HistoryCourse from "../pages/historycourse/historycourse"; // 讲师与课程-历史记录 ---li
import EditTeacher from "../pages/editteacher/editteacher"; // 编辑讲师 ---li
import {
  AgentpcLink,
  AgentpcRoute,
} from "../components/AgentpcRouter/AgentpcRouter";
import servicePath from "../common/util/api/apiUrl";
import Axios from "axios";
import { post } from "../common/util/axios";
import GlobalContext from "../common/util/globalContext";
const { Content, Sider, Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

class Home extends React.Component {
  state = {
    collapsed: false,
    // isAudit: null,
    userId: null,
    visible: {},
    message: null,
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  //horn消息数量
  systemMessage = () => {
    post(servicePath.adminListCounts, {}).then((response) => {
      // console.log(response, "response");
      this.setState({
        message: response.data.data,
      });
    });
  };

  //首页左侧菜单展示权限
  menusVisible = () => {
    post(servicePath.menusVisible + this.state.userId, {})
      .then(response => {
        let list = {}
        response.data.data.map((item) => {
          list[item.key] = item
        })
        this.setState({
          visible: list
        })
        // console.log(list, response, 'responseresponse')
      })
  }

  // 退出登录
  handleLoginOut = () => {
    this.loginOut();
  };

  handleClickArticle = () => { };

  loginOut() {
    Axios({
      url: servicePath.getLogout,
      method: "POST",
      data: {},
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("退出登录成功", res.data);
        window.location.href = `${process.env.pathConstants}/login`;
      })
      .catch((err) => console.log("退出登录失败", err));
  }

  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.setState({ userId: userInfo.userId },
      () => {
        this.menusVisible()
      });
    this.systemMessage();
  }
  //读消息更新数据
  updateUnreadMessage = (id) => {
    // api(id)
    this.systemMessage()
    // this.setState(prev => ({ message: prev.message - 1 }))
  };

  render() {
    const { collapsed, visible } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <div onClick={this.handleLoginOut}>退出登录</div>
        </Menu.Item>
      </Menu>
    );
    return (
      <GlobalContext.Provider
        value={{ updateUnreadMessage: this.updateUnreadMessage }}
      >
        <ConfigProvider locale={zhCN}>
          <Layout className='home'>
            <Header>
              <div className="homeheader">
                <AgentpcLink to="/index/">
                  <span>
                    <img
                      className="homeimg"
                      src={require("../static/home/ist.png")}
                      alt=""
                    />
                  </span>
                </AgentpcLink>
                <div className="headerRight">
                {visible.message &&visible.message.enable?<AgentpcLink to="/index/message/">
                    <div className="homeHorn">
                      <Badge count={this.state.message} overflowCount={99}>
                        <img src={require("../static/home/horn.png")} alt="" />
                        {/* <div className='informationNum'>{this.state.message}</div> */}
                      </Badge>
                    </div>
                  </AgentpcLink>:null}
                  <div style={{ marginRight: "10px" }}>
                    <img src={require("../static/home/admin.png")} alt="" />
                  </div>
                  <span>
                    <Dropdown overlay={menu}>
                      <span className="admin-tag">
                        管理员
                        <DownOutlined />
                      </span>
                    </Dropdown>
                  </span>
                </div>
              </div>
            </Header>
            <Layout style={{ minHeight: "93vh" }}>
              <Sider
                theme="light"
                collapsible
                collapsed={collapsed}
                onCollapse={this.onCollapse}
              >
                <div className="logo" />
                <Menu
                  theme="light"
                  defaultSelectedKeys={["1"]}
                  mode="inline"
                /* selectedKeys={[this.props.history.location.pathname]} */
                >
                  {/* 代理人信息 */}
                <Menu.Item key="index" icon={<DesktopOutlined />}>
                    <AgentpcLink to="/index/">
                      首页
                    </AgentpcLink>
                  </Menu.Item>
                  {visible.agentinformation && visible.agentinformation.enable ? <Menu.Item key="agentinformat" icon={<img className='sideIcon' src={ require('../static/home/agentinformation.png')}/>} >
                    <AgentpcLink to="/index/agentinformation/">
                      代理人信息{" "}
                    </AgentpcLink>
                  </Menu.Item> : ''}
                  {/* 代理人管理 */}
                  {visible.staffmangement&&visible.staffmangement.enable? <SubMenu
                    key="2"
                    title={
                      <span>
                        <img className='sideIcon'  src={require('../static/home/staffmangement.png')}/>
                        <span>代理人管理</span>
                      </span>
                    }
                  >
                    {visible.baseset && visible.baseset.enable ? <Menu.Item key="baseset">
                      <AgentpcLink to="/index/baseset/">基础设置</AgentpcLink>
                    </Menu.Item> : " "}
                    {visible.agentset && visible.agentset.enable ? <Menu.Item key="install">
                      <AgentpcLink to="/index/install/">代理人设置</AgentpcLink>
                    </Menu.Item> : " "}
                    {visible.staffmangement && visible.staffmangement.enable ? <SubMenu key="staffmangement" title={<span>代理人管理</span>}>
                      <Menu.Item key="staffmangementset">
                        <AgentpcLink to="/index/staffmangementset/">
                          基础设置
                        </AgentpcLink>
                      </Menu.Item>
                      <Menu.Item key="demote">
                        <AgentpcLink to="/index/demote/1">降级审核</AgentpcLink>
                      </Menu.Item>
                      <Menu.Item key="">
                        <AgentpcLink to="/index/undemote/2">
                          暂不降级
                        </AgentpcLink>
                      </Menu.Item>
                    </SubMenu> : " "}
                    {visible.addagent && visible.addagent.enable ? <Menu.Item key="addAgent">
                      <AgentpcLink to="/index/adminAddAgent/">
                        添加代理人
                      </AgentpcLink>
                    </Menu.Item> : " "}
                  </SubMenu> : ''}
                  {/* 财务管理 */}
                  {visible.financeMangement && visible.financeMangement.enable
                  ? <SubMenu
                    key="3"
                    title={
                      <span>
                     <img className='sideIcon' src={require('../static/home/finance.png')}/> 
                        <span>财务管理</span>
                      </span>
                    }
                  >
                    {visible.financeOperation && visible.financeOperation.enable ? <Menu.Item key="cash">
                      <AgentpcLink to="/index/cash/">财务操作</AgentpcLink>
                    </Menu.Item> : " "}
                    {visible.financeRecord && visible.financeRecord.enable ? <SubMenu
                      key="cash_record"
                      title={
                        <span>
                          <span>财务记录</span>
                        </span>
                      }
                    >
                      <Menu.Item key="financialrecord">
                        <AgentpcLink to="/index/successExtraction/">
                          提现记录
                        </AgentpcLink>
                      </Menu.Item>
                      <Menu.Item key="vetorecord">
                        <AgentpcLink to="/index/failExtraction/">
                          驳回记录
                        </AgentpcLink>
                      </Menu.Item>
                    </SubMenu> : " "}

                    {visible.financeStatistic && visible.financeStatistic.enable ? <Menu.Item key="statistics">
                      <AgentpcLink to="/index/statistics/">
                        财务统计
                      </AgentpcLink>
                    </Menu.Item> : " "}
                    {visible.commission && visible.commission.enable ? <Menu.Item key="commission">
                      <AgentpcLink to="/index/commission/">
                        佣金记录
                      </AgentpcLink>
                    </Menu.Item> : " "}
                    {visible.newBonus && visible.newBonus.enable ? <Menu.Item key="12">
                      <AgentpcLink to="/index/newuser/">
                        新人奖金
                      </AgentpcLink>
                    </Menu.Item> : " "}
                  </SubMenu> : " "}

                  {/* 营销 */}
                  {visible.marketing && visible.marketing.enable ? <Menu.Item key="4"  icon={<img className='sideIcon' src={require('../static/home/marketing.png')} />}>
                    <AgentpcLink to="/index/marketing/">营销</AgentpcLink>
                  </Menu.Item> : " "}
                  {/* 审核管理 */}
                  {visible.auditMangement&&visible.auditMangement.enable  ?  (
                    <SubMenu
                      key="5"
                      title={
                        <span>
                          <img className='sideIcon' src={require('../static/home/auditMangement.png')} />
                          <span>审核管理</span>
                        </span>
                      }
                    >
                      {visible.auditApply && visible.auditApply.enable ? <Menu.Item key="auditlist">
                        <AgentpcLink to="/index/auditlist">
                          审核列表
                        </AgentpcLink>
                      </Menu.Item>: null}
                      {visible.auditHistory && visible.auditHistory.enable ? <Menu.Item key="audithistory">
                        <AgentpcLink to="/index/audithistory/">
                          历史记录
                        </AgentpcLink>
                      </Menu.Item>: null}
                    </SubMenu>
                  ) : null}
                  {/* 权限管理 */}
                  {visible.permissions&&visible.permissions.enable? <SubMenu
                    key="6"
                    title={
                      <span>
                        <img className='sideIcon' src={require('../static/home/permissions.png')} />
                        <span>权限管理</span>
                      </span>
                    }
                  >
                    {visible.permissionsUser && visible.permissionsUser.enable ? <Menu.Item key="">
                      <AgentpcLink to="/index/administrator/">
                        管理员
                      </AgentpcLink>
                    </Menu.Item> : null}
                    {visible.permissionsRole && visible.permissionsRole.enable ? <Menu.Item key="">
                      <AgentpcLink to="/index/permissions/">
                        权限角色
                      </AgentpcLink>
                    </Menu.Item> : null}
                  </SubMenu> : null}
                  {/* 系统消息 */}
                  {visible.message && visible.message.enable ? <Menu.Item key="7" icon={<img className='sideIcon' src={require('../static/home/message.png')} />}>
                    <AgentpcLink to="/index/message/">
                      系统消息
                    </AgentpcLink>
                  </Menu.Item> : null}
                  {/* 讲师与课程 */}
                  {visible.teacherAndCourse && visible.teacherAndCourse.enable ? <SubMenu
                    key="8"
                    title={
                      <span>
                        <img className='sideIcon' src={require('../static/home/teacherAndCourse.png')} />
                        <span>讲师与课程</span>
                      </span>
                    }
                  >
                    {visible.teacher && visible.teacher.enable ? <SubMenu key="teacher" title={<span>讲师</span>}>
                      <Menu.Item key="teacherlist">
                        <AgentpcLink to="/index/teacherlist/">
                          讲师列表
                        </AgentpcLink>
                      </Menu.Item>
                      {/* <Menu.Item key="teacherdetail">
                        <AgentpcLink to="/index/teacherdetail/">讲师详情</AgentpcLink>
                      </Menu.Item> */}
                      <Menu.Item key="addteacher">
                        <AgentpcLink to="/index/addteacher/">
                          添加讲师
                        </AgentpcLink>
                      </Menu.Item>
                    </SubMenu> : null}
                    {visible.course && visible.course.enable ? <SubMenu key="coursereserved" title={<span>课程预约</span>}>
                      <Menu.Item key="reserved">
                        <AgentpcLink to="/index/reserved/">已预约</AgentpcLink>
                      </Menu.Item>
                      <Menu.Item key="historyCourse">
                        <AgentpcLink to="/index/historycourse/">
                          历史记录
                        </AgentpcLink>
                      </Menu.Item>
                    </SubMenu> : null}
                  </SubMenu> : null}
                </Menu>
              </Sider>
              <Layout>
                <Content style={{ margin: "16px 16px 0px 16px" }}>
                  <div style={{ minHeight: 360 }}>
                    <div>
                      {/* kzh */}
                      <AgentpcRoute path="/index/" exact component={Index} />
                      <AgentpcRoute
                        path="/index/agentinformation/"
                        component={AgentInformation}
                      />
                      <AgentpcRoute
                        path="/index/agentdetails/:id"
                        component={AgentDetails}
                      />
                      <AgentpcRoute
                        path="/index/agentsetup/:id"
                        component={AgentSetup}
                      />
                      <AgentpcRoute
                        path="/index/staffmangementset/"
                        component={StaffMangementSet}
                      />
                      <AgentpcRoute
                        path="/index/adddownreason/"
                        component={AddDownReason}
                      />
                      <AgentpcRoute
                        path="/index/marketing/"
                        component={Marketing}
                      />
                      <AgentpcRoute
                        path="/index/addadministrator/:id"
                        component={AddAdministrator}
                      />
                      <AgentpcRoute
                        path="/index/jurisdiction/:id/:name"
                        component={Jurisdiction}
                      />
                      <AgentpcRoute
                        path="/index/addrole/:id/:name"
                        component={AddRole}
                      />
                      <AgentpcRoute
                        path="/index/auditlist/"
                        component={AuditList}
                      />
                      <AgentpcRoute
                        path="/index/audithistory/"
                        component={AuditHistory}
                      />
                      <AgentpcRoute
                        path="/index/relationships/:id"
                        component={Relationships}
                      />
                      {/* dzk */}
                      <AgentpcRoute path="/index/cash/" component={Cash} />
                      <AgentpcRoute
                        path="/index/successExtraction/"
                        component={SuccesExtraction}
                      />
                      <AgentpcRoute
                        path="/index/failExtraction/"
                        component={FailExtraction}
                      />
                      <AgentpcRoute
                        path="/index/statistics/"
                        component={Statistics}
                      />
                      <AgentpcRoute
                        path="/index/baseset/"
                        exact
                        component={Baseset}
                      />
                      <AgentpcRoute
                        path="/index/baseset/addequity/"
                        component={AddEquity}
                      />
                      <AgentpcRoute
                        path="/index/baseset/watchequity/:id?:name?"
                        component={Watchequity}
                      />
                      <AgentpcRoute
                        path="/index/baseset/changeequity/:id?:name?"
                        component={Changeequity}
                      />
                      <AgentpcRoute
                        path="/index/baseset/updateequity/:id?"
                        component={Updateequity}
                      />
                      <AgentpcRoute
                        path="/index/adminAddAgent/"
                        exact
                        component={AdminAddAgent}
                      />
                      <AgentpcRoute
                        path="/index/adminAddAgent/addAgent/"
                        component={AddAgent}
                      />
                      <AgentpcRoute
                        path="/index/adminAddAgent/updateagent/:id?"
                        component={Updateagent}
                      />
                      {/* wq */}
                      <AgentpcRoute
                        path="/index/undemote/:type"
                        component={unDemote}
                      />
                      <AgentpcRoute
                        path="/index/demote/:type"
                        component={Demote}
                      />
                      <AgentpcRoute
                        path="/index/demotedetails/:id/:type"
                        component={DemoteDeteils}
                      />
                      <AgentpcRoute
                        path="/index/message/"
                        component={Message}
                      />
                      <AgentpcRoute
                        path="/index/commission/"
                        component={Commission}
                      />
                      <AgentpcRoute
                        path="/index/commdetails/:id"
                        component={CommDetails}
                      />
                      {/* li */}
                      <AgentpcRoute
                        path="/index/teacherdetail/"
                        component={TeacherDetail}
                      />
                      <AgentpcRoute
                        path="/index/teacherlist/"
                        component={TeacherList}
                      />
                      <AgentpcRoute
                        path="/index/editteacher/"
                        component={EditTeacher}
                      />
                      <AgentpcRoute
                        path="/index/addteacher/"
                        component={AddTeacher}
                      />
                      {/* cyl */}
                      <AgentpcRoute
                        path="/index/newuser/"
                        exact
                        component={Newuser}
                      />
                      <AgentpcRoute
                        path="/index/newuserdetails/:id"
                        exact
                        component={Newuserdetails}
                      />
                      <AgentpcRoute
                        path="/index/install/"
                        component={Install}
                      />
                      <AgentpcRoute
                        path="/index/installProxy/:id?:name"
                        component={Installproxy}
                      />
                      <AgentpcRoute
                        path="/index/administrator/"
                        component={Administrator}
                      />
                      <AgentpcRoute
                        path="/index/permissions/"
                        component={Permissions}
                      />
                      <AgentpcRoute
                        path="/index/historycourse/"
                        component={HistoryCourse}
                      />
                      <AgentpcRoute
                        path="/index/reserved/"
                        component={Reserved}
                      />
                    </div>
                  </div>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </ConfigProvider>
      </GlobalContext.Provider>
    );
  }
}

export default withRouter(Home);
