import React from "react";
import "./newuser.less";
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
import qee from "qf-export-excel";

// import "../common/globalstyle.less";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

class Newuser extends React.Component {
  constructor(...args) {
    super(...args);

    // 表格基础配置
    this.columns = [
      {
        align: "center",
        title: "昵称/会员ID",
        dataIndex: "user",
        key: "user",
        width: 120,
        ellipsis: true,
        render: (data) => (
          <>
            {data.map((content) => {
              return <h4 key={content}>{content}</h4>;
            })}
          </>
        ),
      },
      {
        align: "center",
        title: "姓名/手机号",
        dataIndex: "namePhone",
        key: "namePhone",
        width: 120,
        ellipsis: true,
        render: (data) => (
          <>
            {data.map((content) => {
              return <h4 key={content}>{content}</h4>;
            })}
          </>
        ),
      },
      {
        align: "center",
        title: "新人奖金总额",
        dataIndex: "bonusSort",
        key: "bonusSort",
        width: 120,
        ellipsis: true,
        render: (data) => (
          <>
            {data.map((content) => {
              return <h4 key={content}>{content}</h4>;
            })}
          </>
        ),
      },
      {
        align: "center",
        title: "操作",
        dataIndex: "user",
        key: "user",
        width: 120,
        render: (data, record) => (
          <Space size="middle">
            <AgentpcLink to={"/index/newuserdetails/" + record.user[1]}>
              <Button
                type="primary"
                size="small"
                onClick={this.getId.bind(this, record)}
              >
                详情
              </Button>
            </AgentpcLink>
          </Space>
        ),
      },
    ];

    this.state = {
      collapsed: false,
      data: [], //表格数据
      newBonusList: [], //提交表单数据
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      alldata: [], // 总数据
      userId: null, //用户id
      searchParms: {}, // 搜索条件
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  handleClickArticle = () => {};

  componentDidMount() {
    document.title = "新人奖金";
    this.setState({
      data: this.data,
    });

    this.searchNewBonusList({ current: 1, len: 10, state: 0 });
  }

  // 获取userId
  getId = (item) => {
    // console.log(999, "userId", item.userId);
    this.setState({
      userId: item.userId,
    });
  };

  // 接口-新人奖金列表
  searchNewBonusList = (params, type = "page") => {
    post(servicePath.newBonusList, {
      phonenumber: this.state.newBonusList.userId, //手机号/用户id
      realName: this.state.newBonusList.realName, //姓名
      bonusSort: this.state.newBonusList.bonusSort, //排序
      userName: this.state.newBonusList.nickName, //昵称
      current: this.state.current,
      len: this.state.pageSize,
      ...params,
    })
      .then((res) => {
        // console.log("获取新人奖金列表成功", res.data.data, type);

        const records = res.data.data.records;
        const totalNum = res.data.data.total;
        console.log(res.data.data.total, "总数据");

        const data = records.map((item, index) => {
          item["key"] = index;
          item["user"] = [item.userName, item.userId];
          item["namePhone"] = [item.realName, item.phonenumber];
          item["bonusSort"] = [item.income];
          return item;
        });

        if (type === "all") {
          // 表格基础配置
          const columns = [
            {
              title: "昵称",
              dataIndex: "userName",
              key: "userName",
            },
            {
              title: "会员ID",
              dataIndex: "userId",
              key: "userId",
            },
            {
              align: "center",
              title: "姓名",
              dataIndex: "realName",
              key: "realName",
            },
            {
              align: "center",
              title: "手机号",
              dataIndex: "phonenumber",
              key: "phonenumber",
            },
            {
              title: "新人奖金总额",
              dataIndex: "income",
              key: "income",
            },
          ];
          this.setState(
            {
              alldata: data,
              totalNum,
            },
            () => {
              qee(columns, this.state.alldata, "新人奖金");
              // console.log(this.state.totalNum, "zzz数据");
            }
          );
        } else {
          this.setState(
            {
              data,
              totalNum,
              current: params.current,
            },
            () => {
              // console.log(this.state.totalNum, "粽粽粽数据");
            }
          );
        }
      })
      .catch((err) => {});
  };

  // 当前页面修改
  handleChangePage = (page, pageSize) => {
    // console.log("切换页数:", page);
    this.setState(
      {
        current: page,
      },
      () => {
        this.searchNewBonusList({
          // current: this.state.current,
          // len: pageSize,
          // state: 0,
          // ...params,
        });
      }
    );
    // console.log("当前页面", this.state.current);
    const params =
      this.state.data !== {} ? { ...this.state.data } : { skey: "" };
  };

  // 导出按钮
  handleExportExcel = () => {
    // qee(this.columns, this.data, "导出测试");
    this.searchNewBonusList(
      {
        current: 1,
        len: this.state.totalNum,
        state: 0,
        // ...this.state.data,
      },
      "all"
    );
  };

  // 提交表单事件
  onFinish = (values) => {
    console.log("查询成功", values);
    const newBonusList = values;
    this.setState(
      {
        newBonusList,
      },
      () => {
        // console.log("赋值成功", newBonusList);
        // console.log(this.state.current, 7878);
        this.searchNewBonusList({
          current: this.state.current,
          len: this.state.pageSize,
          state: 0,
          ...newBonusList,
        });
      }
    );
  };

  // // 表单重置
  formRef = React.createRef();
  onReset = () => {
    this.formRef.current.resetFields();
  };

  render() {
    const { Option } = Select;
    const { collapsed } = this.state;

    this.newBonusList = React.createRef();

    return (
      <div className="pc-newuser">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">奖金列表</span>
        </div>
        {/* 标题结束 */}
        {/* 头部查询开始 */}
        <div className="content-header">
          <Form className="user" ref={this.formRef} onFinish={this.onFinish}>
            <div className="user-item">
              <div className="item">
                <Form.Item
                  className="userId"
                  name="userId"
                  label="手机号/ID："
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input
                    type="number"
                    min={0}
                    className="userInput"
                    placeholder="手机号/ID"
                    allowClear
                  />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item
                  className="userName"
                  name="realName"
                  label="姓名："
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input className="userInput" placeholder="姓名" allowClear />
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item
                  className="bonusSort"
                  name="bonusSort"
                  label="新人奖金排序："
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Select placeholder="请选择" allowClear>
                    <Option value={0}>降序</Option>
                    <Option value={1}>升序</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="item">
                <Form.Item
                  className="nickName"
                  name="nickName"
                  label="昵称："
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input className="userInput" placeholder="账号" allowClear />
                </Form.Item>
              </div>
              <div className="btn">
                <Space>
                  <Button type="primary" htmlType="submit" className="submit">
                    查询
                  </Button>
                  <Button className="export" onClick={this.handleExportExcel}>
                    导出
                  </Button>
                  <Button
                    className="reset"
                    htmlType="button"
                    onClick={this.onReset}
                  >
                    重置
                  </Button>
                </Space>
              </div>
            </div>
          </Form>
        </div>
        {/* 头部查询结束 */}
        {/* 表格内容开始 */}
        <div className="content">
          <Table
            columns={this.columns}
            className="bonusList"
            dataSource={this.state.data}
            pagination={{
              showQuickJumper: true, //快速跳转至某页
              showSizeChanger: true, //切换器
              current: this.state.current, //当前页数
              pageSize: this.state.pageSize, //每页条数
              pageSizeOptions: [10, 20, 40, 50], ////指定每页可以显示多少条
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
      </div>
    );
  }
}

export default Newuser;
