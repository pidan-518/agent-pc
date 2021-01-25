import React from "react";
import "./permissions.less";
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
import {
  AgentpcLink,
  AgentpcRoute,
} from "../../components/AgentpcRouter/AgentpcRouter";
import { Link, Route } from "react-router-dom";
import FormItem from "antd/lib/form/FormItem";
import qee from "qf-export-excel";
// import "../common/globalstyle.less";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

class Permissions extends React.Component {
  constructor(...args) {
    super(...args);

    // 表格基础配置
    this.columns = [
      {
        align: "center",
        title: "角色名称",
        dataIndex: "role",
        key: "role",
        width: 120,
        ellipsis: true,
        // render: data => (
        //   <>
        //     {data.map(content => {
        //       return <h4 key={content}>{content}</h4>;
        //     })}
        //   </>
        // ),
      },
      {
        align: "center",
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        width: 120,
        render: (data, record) => (
          <>
            <Space size="middle">
              <AgentpcLink
                to={`/index/addrole/${record.roleId}/${record.roleName}`}
              >
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
                onClick={this.deleteRole.bind(this, record)}
              >
                删除
              </Button>
            </Space>
          </>
        ),
      },
    ];

    this.state = {
      collapsed: false,
      data: [], //表格数据
      roleList: {}, //角色列表
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      alldata: [], // 总数据
      roleId: null, //角色id
      visible: false, //模态框状态
    };
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    document.title = "权限角色";

    this.setState({
      data: this.data,
    });

    this.searchRole({ current: 1, len: 10, state: 0 });
  }

  // 获取userId
  getId = (item) => {
    console.log("userId", item.roleId);
    this.setState({
      roleId: item.roleId,
    });
  };

  // 接口-分页查询所有角色列表
  searchRole = (params, type = "page") => {
    post(servicePath.rolepubList, {
      current: this.state.current,
      len: this.state.pageSize,
      ...params,
    }).then((res) => {
      // console.log("获取角色列表成功", res.data.data, type);
      const records = res.data.data.records;
      const totalNum = res.data.data.total;

      const data = records.map((item, index) => {
        item["key"] = index;
        item["role"] = item.roleName;
        item["operation"] = item.roleId;
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
        this.searchRole({});
      }
    );
    const params =
      this.state.data !== {} ? { ...this.state.data } : { skey: "" };
  };

  // 删除申请
  deleteRole = (item) => {
    // console.log("获取删除", item.roleId);
    this.setState({
      roleId: item.roleId,
      visible: true,
    });
  };

  // 删除
  deleteRoleId = (item) => {
    // console.log("获取删除", item.roleId);
    this.setState(
      {
        roleId: item.roleId,
        visible: true,
      },
      () => {
        // 接口-删除管理员账户
        post(servicePath.deleteRole, [item.roleId]).then((res) => {
          if (res.data.code === 0) {
            this.searchRole({ current: 1, len: 10, state: 0 });
            // console.log("删除成功", res);
            message.success("删除成功");
          } else {
            // console.log("请求错误", res);
            message.error(res.data.msg);
          }
        });
        this.setState({
          visible: false,
        });
      }
    );
  };

  // 模态框确定按钮事件(确定删除)
  handlesubmit = (item) => {
    this.deleteRoleId(item);
    this.setState({
      visible: false,
    });
  };

  // 隐藏模态框
  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <div className="pc-permissions">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">管理及权限-管理员</span>
        </div>
        {/* 标题结束 */}
        {/* 头部查询开始 */}
        <div className="btn-header">
          <div className="btn">
            <AgentpcLink to={`/index/addrole/null/null`}>
              <Button>添加角色</Button>
            </AgentpcLink>
          </div>
        </div>
        {/* 头部查询结束 */}
        {/* 表格内容开始 */}
        <div className="content">
          <Table
            columns={this.columns}
            className="roleList"
            dataSource={this.state.data}
            pagination={{
              // current: this.state.current,
              showQuickJumper: true, //快速跳转至某页
              showSizeChanger: true, //切换器
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
                roleId: this.state.roleId,
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
        {/* 模态框结束 */}
      </div>
    );
  }
}

export default Permissions;
