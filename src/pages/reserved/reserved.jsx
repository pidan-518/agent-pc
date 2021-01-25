import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Modal,
  message,
} from "antd";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import "./reserved.less";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";

const { RangePicker } = DatePicker;
const formRef = React.createRef();

// 已预约
export class Reserved extends Component {
  state = {
    listData: [], // 预约人数据
    formData: {
      nikeName: null,
      name: null,
      orderStartTime: null,
      orderEndTime: null,
      courseStartTime: null,
      courseEndTime: null,
      teacherName: null,
    },
  };

  // 时间选择器
  handleRangePicker = (date, dateString) => {
    console.log(dateString);
  };

  // 表单提交
  handleSubmit = (value) => {
    const orderStartTime = value.reserve_time
      ? `${value.reserve_time[0].format("YYYY-MM-DD")} 00:00:00`
      : null;
    const orderEndTime = value.reserve_time
      ? `${value.reserve_time[1].format("YYYY-MM-DD")} 23:59:59`
      : null;
    const courseStartTime = value.reserve_teacher_time
      ? `${value.reserve_teacher_time[0].format("YYYY-MM-DD")} 00:00:00`
      : null;
    const courseEndTime = value.reserve_teacher_time
      ? `${value.reserve_teacher_time[1].format("YYYY-MM-DD")} 23:59:59`
      : null;
    this.setState(
      {
        formData: {
          nikeName: value.nikeName || null,
          name: value.name || null,
          orderStartTime: orderStartTime,
          orderEndTime: orderEndTime,
          courseStartTime: courseStartTime,
          courseEndTime: courseEndTime,
          teacherName: value.teacherName || null,
        },
      },
      () => {
        this.getSelectAgentTimeList();
      }
    );
  };

  // 表单重置
  handleFormReset = () => {
    formRef.current.resetFields();
    this.setState(
      {
        formData: {
          nikeName: null,
          name: null,
          orderStartTime: null,
          orderEndTime: null,
          courseStartTime: null,
          courseEndTime: null,
          teacherName: null,
        },
      },
      () => {
        this.getSelectAgentTimeList();
      }
    );
  };

  // 查看详情点击事件
  handleSeeDetails = (data) => {
    this.getSelectAgentTimeDetail(data);
  };

  // 获取代理人预约记录
  getSelectAgentTimeList(current = 1) {
    const { formData } = this.state;
    post(servicePath.getSelectAgentTimeList, {
      current: current,
      len: 10,
      itemIds: [2],
      userName: formData.nikeName,
      realName: formData.name,
      orderStartTime: formData.orderStartTime,
      orderEndTime: formData.orderEndTime,
      courseStartTime: formData.courseStartTime,
      courseEndTime: formData.courseEndTime,
      teacherName: formData.teacherName,
    })
      .then((res) => {
        console.log("获取代理人预约记录成功", res.data);
        if (res.data.code === 0) {
          const { records, total } = res.data.data;
          records.map((item) => {
            item.key = item.planId;
            return item;
          });
          this.setState({
            listData: records,
            total: total,
          });
        }
      })
      .catch((err) => console.log("获取代理人预约记录异常"));
  }

  // 获取预约记录详情
  getSelectAgentTimeDetail(params) {
    post(servicePath.getSelectAgentTimeDetail, {
      agentId: params.agentId,
      planId: params.planId,
    })
      .then((res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          Modal.confirm({
            getContainer: document.getElementById("reserved"),
            icon: "",
            centered: true,
            content: (
              <div className="modal">
                <div className="modal-header">
                  <img className="avatar-img" src={params.avatar} alt="" />
                  <p style={{ marginTop: "10px" }}>
                    <span className="level">{data.levelName}</span>
                  </p>
                </div>
                <div className="modal-content">
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      昵称：
                    </label>
                    <div className="item-text">{params.userName}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      姓名：
                    </label>
                    <div className="item-text">{data.realName}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      手机号：
                    </label>
                    <div className="item-text">{data.phoneNumber}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      成为代理人时间：
                    </label>
                    <div className="item-text">{data.toAgentDate}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      预约讲师：
                    </label>
                    <div className="item-text">{data.teacherName}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      预约时间：
                    </label>
                    <div className="item-text">{data.orderTime}</div>
                  </div>
                  <div className="content-item">
                    <label className="item-label" htmlFor="">
                      预约讲师时间：
                    </label>
                    <div className="item-text">{data.courseTime}</div>
                  </div>
                </div>
              </div>
            ),
          });
        } else {
          message.error(msg);
        }
        console.log("获取预约记录详情成功", res.data);
      })
      .catch((err) => console.log("获取预约记录详情异常", err));
  }

  componentDidMount() {
    document.title = "课程预约 - 已预约";
    this.getSelectAgentTimeList();
  }

  render() {
    const columns = [
      {
        title: "头像/昵称",
        dataIndex: "avatar",
        key: "avatar",
        align: "center",
        render: (text, record) => (
          <>
            <img className="avatar" src={record.avatar} alt="" />
            <div className="nikeName">{record.userName}</div>
          </>
        ),
      },
      {
        title: "预约人",
        dataIndex: "realName",
        key: "realName",
        align: "center",
      },
      {
        title: "预约讲师",
        dataIndex: "teacherName",
        key: "teacherName",
        align: "center",
      },
      {
        title: "预约时间",
        dataIndex: "orderTime",
        key: "orderTime",
        align: "center",
      },
      {
        title: "预约讲师时间",
        align: "center",
        key: "courseTime",
        dataIndex: "courseTime",
      },
      {
        title: "操作",
        align: "center",
        dataIndex: "operating",
        key: "operating",
        render: (text, record) => (
          <>
            <Button
              type="primary"
              size="small"
              onClick={this.handleSeeDetails.bind(this, record)}
            >
              查看详情
            </Button>
          </>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: false, //设置每页显示数据条数
      showQuickJumper: true,
      showTotal: () => `共${this.state.total}条`,
      pageSize: 10,
      position: ["bottomLeft"],
      size: "default",
      total: this.state.total, //数据的总的条数
      onChange: (current) => this.getSelectAgentTimeList(current), //点击当前页码
    };
    const { listData } = this.state;
    return (
      <div id="reserved">
        <HeaderTitle title="课程预约列表" />
        <div className="search-wrap">
          <Form onFinish={this.handleSubmit} ref={formRef}>
            <Row gutter={24}>
              <Col span={3}>
                <Form.Item label="昵称" name="nikeName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label="姓名" name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="预约讲师" name="teacherName">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="预约时间" name="reserve_time">
                  <RangePicker
                    onChange={this.handleRangePicker}
                    format="YYYY-MM-DD"
                    showTime
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="预约讲师时间" name="reserve_teacher_time">
                  <RangePicker
                    onChange={this.handleRangePicker}
                    format="YYYY-MM-DD"
                    showTime
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={4}>
              <Col span={2}>
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
              </Col>
              <Col span={2}>
                <Button onClick={this.handleFormReset}>重置</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="table-wrap">
          <Table
            columns={columns}
            dataSource={listData}
            bordered
            pagination={paginationProps}
            size="middle"
            scroll={{ y: 551, scrollToFirstRowOnChange: true }}
          />
        </div>
      </div>
    );
  }
}

export default Reserved;
