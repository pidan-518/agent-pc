import React from "react";
import "./administrator.less";
import servicePath from "../../common/util/api/apiUrl";
import { post } from "../../common/util/axios";
import {
  Layout,
  Menu,
  Icon,
  Form,
  Button,
  Input,
  Select,
  Table,
  Space,
  Modal,
  message,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Link, Route } from "react-router-dom";
import FormItem from "antd/lib/form/FormItem";
import qee from "qf-export-excel";
import {
  AgentpcLink,
  AgentpcRoute,
} from "../../components/AgentpcRouter/AgentpcRouter";
// import "../common/globalstyle.less";

import RegionalDirector from "../../static/scattered/regionalDirector.png";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

class Administrator extends React.Component {
  constructor(...args) {
    super(...args);

    // 表格基础配置
    this.columns = [
      {
        align: "center",
        title: "管理员",
        dataIndex: "admin",
        key: "admin",
        width: 120,
        ellipsis: true,
      },
      {
        align: "center",
        title: "所属角色",
        dataIndex: "role",
        key: "role",
        width: 150,
        ellipsis: true,
        // render: (data) => (
        //   <>
        //     {data.map((content) => {
        //       return <h4 key={content}>{content}</h4>;
        //     })}
        //   </>
        // ),
      },
      {
        align: "center",
        title: "登陆账号",
        dataIndex: "userAccount",
        key: "userAccount",
        width: 100,
        ellipsis: true,
      },
      {
        align: "center",
        title: "状态",
        dataIndex: "condition",
        key: "condition",
        width: 100,
        ellipsis: true,
        render: (data, record) => (
          <>{data === "0" ? <h4>正常</h4> : <h4>冻结</h4>}</>
        ),
      },
      {
        align: "center",
        title: "操作",
        dataIndex: "condition",
        key: "condition",
        width: 120,
        render: (data, record) => (
          <>
            <Space size="middle">
              <AgentpcLink to={"/index/addadministrator/" + record.userId}>
                <Button
                  type="primary"
                  size="small"
                  onClick={this.getId.bind(this, record)}
                >
                  编辑
                </Button>
              </AgentpcLink>
              <Button
                type="danger"
                size="small"
                onClick={this.deleteadmin.bind(this, record)}
              >
                删除
              </Button>
              <AgentpcLink
                to={`/index/jurisdiction/${record.userId}/${record.roleName}`}
              >
                <Button
                  type="primary"
                  size="small"
                  onClick={this.getId.bind(this, record)}
                >
                  权限
                </Button>
              </AgentpcLink>

              {data !== "0" ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={this.onHandle.bind(this, record)}
                >
                  启用
                </Button>
              ) : (
                <Button
                  type="danger"
                  size="small"
                  onClick={this.Handle.bind(this, record)}
                >
                  冻结
                </Button>
              )}
            </Space>
          </>
        ),
      },
    ];

    this.state = {
      collapsed: false,
      data: [], //表格数据
      newBonusList: [], //提交表单数据
      userId: null, //用户id
      visible: false, // 冻结/解冻-模态框默认隐藏
      visible2: false, // 删除-模态框默认隐藏
      actionType: null, //0正常1冻结
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      alldata: [], // 总数据
    };
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    document.title = "管理员";

    this.setState({
      data: this.data,
      userId: null,
    });

    this.searchAdmin({ current: 1, len: 10, state: 0 });
  }

  // 获取userId
  getId = (item) => {
    console.log("userId", item.userId);
    this.setState({
      userId: item.userId,
    });
  };

  // 接口-查询管理员账户列表
  searchAdmin = (params, type = "page") => {
    post(servicePath.getAdminList, {
      loginName: this.state.newBonusList.userAccount,
      userName: this.state.newBonusList.admin,
      status: this.state.newBonusList.condition,
      current: this.state.current,
      len: this.state.pageSize,
      ...params,
    }).then((res) => {
      console.log("获取管理员列表信息", res.data.data);

      const records = res.data.data.records;
      const totalNum = res.data.data.total;

      const data = records.map((item, index) => {
        item["key"] = index;
        item["admin"] = item.userName; //管理员名称
        item["role"] = item.roleName; //所属角色
        item["userAccount"] = item.loginName; //登陆账号
        item["condition"] = item.status; //状态
        return item;
      });

      if (type === "all") {
        this.setState(
          {
            alldata: data,
          },
          () => {
            qee(this.columns, this.state.alldata, "导出测试");
          }
        );
      } else {
        this.setState({
          data,
          totalNum,
          current: params.current,
          records,
        });
      }
    });
  };

  // 当前页面修改
  handleChangePage = (page, pageSize) => {
    console.log("切换页数:", page);
    this.setState(
      {
        current: page,
      },
      () => {
        this.searchAdmin({});
      }
    );
    const params =
      this.state.data !== {} ? { ...this.state.data } : { skey: "" };
  };

  // 表单提交事件
  onFinish = (values) => {
    console.log("查询成功", values);
    const newBonusList = values;
    this.setState(
      {
        newBonusList,
      },
      () => {
        console.log("赋值成功", newBonusList);
        console.log(this.state.current, 8888888);
        this.searchAdmin({
          current: this.state.current,
          len: this.state.pageSize,
          state: 0,
          ...newBonusList,
          // loginName: this.state.newBonusList.loginName,
          // userName: this.state.newBonusList.userName,
          // status: this.state.newBonusList.status,
        });
      }
    );
  };

  // 模态框-确认按钮事件
  handlesubmit = (item) => {
    if (this.state.actionType === 0) {
      console.log(item, 9999999);
      //冻结
      this.onHandleReject(item);
      return;
    }
    this.setState({
      visible: false,
    });
    if (this.state.actionType === 1) {
      //启用
      this.handleReject(item);
      return;
    }
    this.setState({
      visible: false,
    });
  };

  // 启用申请
  onHandle = (item) => {
    console.log("启用id", item.userId, item.status);
    this.setState({
      userId: item.userId,
      status: item.status,
      actionType: 1, //展示"是否解冻"模态框
      visible: true,
    });
  };

  // 冻结申请
  Handle = (item) => {
    console.log("冻结id", item.userId, item.status);
    this.setState({
      userId: item.userId,
      status: item.status,
      actionType: 0, //展示"是否冻结"模态框
      visible: true,
    });
  };

  // 冻结事件
  onHandleReject = (item) => {
    console.log("获取冻结id", item.userId, item.status);
    this.setState(
      {
        userId: item.userId,
        status: item.status,
        visible: false,
      },
      () => {
        post(servicePath.freezeAdmin, {
          userId: this.state.userId,
          status: this.state.status,
        }).then((res) => {
          if (res.data.code === 0) {
            console.log("冻结成功", res);
            this.searchAdmin({ current: 1, len: 10, state: 0 });
            message.success("冻结成功");
          } else {
            console.log("请求错误");
          }
        });
      }
    );
  };

  // 启用事件
  handleReject = (item) => {
    console.log("获取启用id", item.userId, item.status);
    this.setState(
      {
        userId: item.userId,
        status: item.status,
      },
      () => {
        post(servicePath.freezeAdmin, {
          userId: this.state.userId,
          status: this.state.status,
        }).then((res) => {
          if (res.data.code === 0) {
            console.log("启用成功", res);
            this.searchAdmin({ current: 1, len: 10, state: 0 });
            message.success("启用成功");
          } else {
            console.log("请求错误");
          }
        });
      }
    );

    // let userId = [];
    // this.state.data.map((item) => {
    //   userId.push(item.userId);
    // });
    // this.setState(
    //   {
    //     userId,
    //   },
    //   () => {
    //     console.log(userId, 898989);
    //   }
    // );
  };

  // 删除事件
  // deleteAdmin = (item) => {
  //   console.log("获取删除", item.userId);
  //   this.setState({
  //     userId: item.userId,
  //   });
  //   // 接口-删除管理员账户
  //   post(servicePath.deleteAdmin, [item.userId]).then((res) => {
  //     if (res.data.code === 0) {
  //       console.log("删除成功", res);
  //       this.searchAdmin({ current: 1, len: 10, state: 0 });
  //     } else {
  //       console.log("请求错误");
  //     }
  //   });
  // };

  // 删除申请
  deleteadmin = (item) => {
    console.log("获取删除", item.userId);
    this.setState({
      userId: item.userId,
      visible2: true,
    });
  };

  // 删除
  deleteAdimId = (item) => {
    console.log("2获取删除", item.userId);
    this.setState(
      {
        userId: item.userId,
        visible2: true,
      },
      () => {
        // 接口-删除管理员账户
        post(servicePath.deleteAdmin, [item.userId]).then((res) => {
          if (res.data.code === 0) {
            console.log("删除成功", res.data.msg);
            this.searchAdmin({ current: 1, len: 10, state: 0 });
            message.success(res.data.msg);
          } else {
            // console.log("请求错误", res.data.msg);
            message.error(res.data.msg);
          }
        });
        this.setState({
          visible2: false,
        });
      }
    );
  };

  // 模态框确定按钮事件(确定删除)
  handlesubmitDelete = (item) => {
    this.deleteAdimId(item);
    this.setState({
      visible2: false,
    });
  };

  // 隐藏模态框
  handleCancel = () => {
    this.setState({ visible: false, visible2: false });
  };

  render() {
    const { Option } = Select;
    const { collapsed, actionType } = this.state;
    return (
      <div className="pc-administrator">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">管理及权限-管理员</span>
        </div>
        {/* 标题结束 */}
        {/* 头部查询开始 */}
        <div className="content-header">
          <div className="btn">
            <AgentpcLink to={"/index/addadministrator/" + null}>
              <Button>添加管理员</Button>
            </AgentpcLink>
          </div>
          <Form className="inquery" onFinish={this.onFinish}>
            <div className="inquery-item">
              <Form.Item
                className="userId"
                name="userAccount"
                label="登陆账号："
              >
                <Input
                  className="userInput"
                  placeholder="登陆账号"
                  allowClear
                />
              </Form.Item>
              <Form.Item className="adminName" name="admin" label="管理员：">
                <Input
                  className="adminInput"
                  placeholder="管理员名称"
                  allowClear
                />
              </Form.Item>
              <Form.Item className="condition" name="condition" label="状态：">
                <Select placeholder="请选择" allowClear>
                  <Option value={0}>正常</Option>
                  <Option value={1}>冻结</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="btn">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </div>
          </Form>
        </div>
        {/* 头部查询结束 */}
        {/* 表格内容开始 */}
        <div className="content">
          <Table
            columns={this.columns}
            className="adminList"
            dataSource={this.state.data}
            pagination={{
              showSizeChanger: true, //切换器
              showQuickJumper: true, //快速跳转至某页
              current: this.state.current, //当前页数
              pageSize: this.state.pageSize, //每页条数
              pageSizeOptions: [10, 20, 40, 50], //指定每页可以显示多少条
              total: this.state.totalNum, //数据总数
              onShowSizeChange: (current, size) => {
                //pageSize 变化的回调
                this.setState({
                  pageSize: size,
                });
              },
              onChange: this.handleChangePage, //修改当前页面
              showTotal: (total) =>
                `每 ${this.state.pageSize} 条，共 ${total} 条记录`,
            }}
          />
        </div>
        {/* 表格内容结束 */}
        {/* 模态框开始 */}
        <Modal
          className="modal"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="submit"
              className="pass"
              type="primary"
              onClick={this.handlesubmit.bind(this, {
                userId: this.state.userId,
                status: this.state.status,
              })}
            >
              确定
            </Button>,
            <Button key="back" className="reject" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          {actionType === 0 ? (
            <>
              <div className="content">冻结该管理员账号？</div>
            </>
          ) : (
            <div className="content">解冻该管理员账号？</div>
          )}
        </Modal>
        {/* 模态框结束 */}
        {/* 模态框2开始 */}
        <Modal
          className="modal"
          visible={this.state.visible2}
          onOk={this.hideModal}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="submit"
              className="pass"
              type="primary"
              onClick={this.handlesubmitDelete.bind(this, {
                userId: this.state.userId,
              })}
            >
              确定
            </Button>,
            <Button key="back" className="reject" onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <>
            <div className="content">删除该角色？</div>
          </>
        </Modal>
        {/* 模态框2结束 */}
      </div>
    );
  }
}

export default Administrator;
