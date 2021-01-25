import React from "react";
import "./newuserdetails.less";
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
  Row,
  Col,
  DatePicker,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Route } from "react-router-dom";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";
import Item from "antd/lib/list/Item";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import qee from "qf-export-excel";
// import "../common/globalstyle.less";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

class Newuserdetails extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      collapsed: false,
      data: [], //表格数据
      userId: "", //用户ID
      records: [], //个人详情数据
      current: 1, // 当前页数
      pagesNum: 10, // 总页数
      pageSize: 10, // 每页条数
      totalNum: 100, // 总数据长度
      alldata: [], // 总数据
    };

    // 表格基础配置
    this.columns = [
      {
        align: "center",
        title: "代理人昵称",
        dataIndex: "userId",
        key: "userId",
        width: 120,
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
        title: "账号",
        dataIndex: "namePhone",
        key: "namePhone",
        width: 120,
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
        title: "奖金金额",
        dataIndex: "sort",
        key: "sort",
        width: 120,
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
        title: "完成时间",
        dataIndex: "finishtime",
        key: "finishtime",
        width: 120,
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
        title: "收益来源",
        dataIndex: "source",
        key: "source",
        width: 120,
        ellipsis: true,
        // render: (data) => (
        //   <>
        //     {data.map((content) => {
        //       return <h4 key={content}>{content}</h4>;
        //     })}
        //   </>
        // ),
      },
    ];
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    document.title = "新人奖金";
    const userId = this.props.match.params.id;
    this.setState(
      {
        data: this.data,
        userId: userId,
      },
      () => {
        console.log(this.state.userId, 789);
      }
    );
    // 接口-新人奖金-个人详情
    post(servicePath.newBonusDetail, {
      userId: userId,
    }).then((res) => {
      console.log("获取详情成功", res);
      const records = res.data.data;
      this.setState(
        {
          records,
        },
        () => {
          this.getNewBonusDetailList({ current: 1, len: 10, state: 0 });
        }
      );
    });
  }

  // 接口-新人奖金-个人详情-具体收益列表
  getNewBonusDetailList = (params, type = "page") => {
    post(servicePath.newBonusDetailList, {
      userId: this.state.userId,
      incomeTimeStart: this.state.incomeTimeStart,
      incomeTimeEnd: this.state.incomeTimeEnd,
      current: this.state.current,
      len: this.state.pageSize,
      current: this.state.current,
      len: this.state.pageSize,
      ...params,
    }).then((res) => {
      // console.log("第二个接口成功", res.data.data, type);

      const records = res.data.data.records;
      const totalNum = res.data.data.total;

      const data = records.map((item, index) => {
        item["key"] = index;
        item["userId"] = item.userName;
        item["namePhone"] = item.phonenumber;
        item["sort"] = item.income;
        item["finishtime"] = item.incomeTime;
        item["source"] = item.profitSharingModeName;
        return item;
      });
      // this.setState({
      //   data,
      // });

      if (type === "all") {
        this.setState(
          {
            alldata: data,
            totalNum,
          },
          () => {
            qee(this.columns, this.state.alldata, "新人奖金详情");
            console.log(this.state.totalNum, "zzz数据");
          }
        );
      } else {
        this.setState({
          data,
          totalNum,
          current: params.current,
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
        this.getNewBonusDetailList({
          // current: page,
          // len: pageSize,
          // state: 0,
          // ...params,
        });
      }
    );
    const params =
      this.state.data !== {} ? { ...this.state.data } : { skey: "" };
  };

  // 修改页面数据长度
  // handleChangePageSize = (e) => {
  //   const pageSize = e.target.value;

  //   if (pageSize > this.state.pageSize) {
  //     this.getNewBonusDetailList({
  //       current: 1,
  //       len: pageSize,
  //       state: 0,
  //       ...this.state.data,
  //     });
  //   }

  //   this.setState({
  //     pageSize,
  //   });
  // };

  // 导出按钮
  handleExportExcel = () => {
    // qee(this.columns, this.data, "导出测试");
    this.getNewBonusDetailList(
      {
        current: 1,
        len: this.state.totalNum,
        state: 0,
        // ...this.state.data,
      },
      "all"
    );
  };

  // 表单提交时间事件
  onFinish = (values) => {
    console.log(
      "提交",
      values.applyTime
      // values.applyTime[0].format("YYYY-MM-DD h:mm:ss"),
      // values.applyTime[1].format("YYYY-MM-DD h:mm:ss")
    );
    if (values.applyTime == undefined || null) {
      console.log("进来了");
      this.setState(
        {
          incomeTimeStart: "",
          incomeTimeEnd: "",
        },
        () => {
          this.getNewBonusDetailList({ current: 1, len: 10, state: 0 });
        }
      );
    } else {
      const incomeTimeStart =
        values.applyTime[0].format("YYYY-MM-DD 00:00:00") || "";
      const incomeTimeEnd =
        values.applyTime[1].format("YYYY-MM-DD 23:59:59") || "";

      this.setState(
        {
          incomeTimeStart,
          incomeTimeEnd,
        },
        () => {
          this.getNewBonusDetailList({ current: 1, len: 10, state: 0 });
        }
      );
    }
  };

  render() {
    const { records } = this.state;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    return (
      <div className="pc-newuserdetails">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">奖金详情</span>
        </div>
        {/* 标题结束 */}
        {/* 头部查询开始 */}
        <div className="content-header">
          <div className="user-item">
            <div className="first">
              <div key="userId" className="userId">
                <text className="name">昵称：</text>
                <text className="content">{records.userName}</text>
              </div>
              <div key="username" className="username">
                <text className="name">姓名：</text>
                <text className="content">{records.realName}</text>
              </div>
              <div key="phonenumber" className="phonenumber">
                <text className="name">手机号：</text>
                <text className="content">{records.phonenumber}</text>
              </div>
            </div>
            <div className="second">
              <div key="totalprice" className="totalprice">
                <text className="name">代理人总佣金：</text>
                <text className="content">{records.totalCommission}</text>
              </div>
              <div key="price" className="price">
                <text className="name">佣金余额：</text>
                <text className="content">{records.commission}</text>
              </div>
              <div key="time" className="time">
                <text className="name">成为代理人时间：</text>
                <text className="content">{records.createTime}</text>
              </div>
            </div>
            <div className="third">
              <div key="userId" className="withdrawal">
                <text className="name">提现金额：</text>
                <text className="content">{records.userCommission}</text>
              </div>
              <div key="userId" className="freeze">
                <text className="name">冻结金额：</text>
                <text className="content">{records.freezeAmount}</text>
              </div>
            </div>
          </div>
          <Form onFinish={this.onFinish}>
            <div className="complete-time">
              <Form.Item name="applyTime" label="完成时间">
                <RangePicker
                  className="datePicker"
                  locale={locale}
                  allowEmpty={true}
                />
              </Form.Item>
            </div>
            <div className="btn">
              <Button type="primary" htmlType="submit" className="submit">
                查询
              </Button>
              <Button className="export" onClick={this.handleExportExcel}>
                导出
              </Button>
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
              // current: this.state.current,
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

export default Newuserdetails;
