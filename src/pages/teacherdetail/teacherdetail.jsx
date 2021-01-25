import React, { Component, Fragment } from "react";
import { message, Row, Col, Calendar } from "antd";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import "./teacherdetail.less";
import moment from "moment";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";
import { periods } from "../addteacher/periods";
import utils from "../../common/util/utils";

export class TeacherDetail extends Component {
  state = {
    calendarValue: moment(new Date()),
    teacherData: {
      teacherImg: "",
      teacherName: "",
      personalProfile: "",
      courseContent: "",
    },
    reserveTimes: periods, // 时间段
    timeData: [], // 后台返回的可预约数据
    month: utils.getNowFormatDate(1), // 月份
  };

  // 日期选择事件
  calendarSelect = (date) => {
    this.setState(
      {
        calendarValue: date,
        month: date.format("YYYY-MM"),
      },
      () => {
        this.getSysCourseTimeSelectAll(date.format("YYYY-MM"));
        const { timeData } = this.state;
        let calendarTime = date.format("YYYY-MM-DD");
        let times = utils.getNowFormatDate();
        let courseId = "";
        let timesArr = [];
        if (times === calendarTime) {
          if (timeData.length !== 0) {
            this.getNowTime();
          } else {
            for (let item of periods) {
              if (item.timeText > utils.getNowDaysCanReserveTime()) {
                timesArr.push(item);
              }
            }
            this.setState({
              reserveTimes: timesArr,
            });
          }
          this.setState({
            isNowDays: true,
          });
        } else {
          if (timeData.length !== 0) {
            for (let timeIdx of timeData) {
              if (
                date.format("YYYY-MM-DD") ===
                moment(timeIdx.startTime).format("YYYY-MM-DD")
              ) {
                courseId = timeIdx.courseId;
                for (let idx of periods) {
                  idx.checkout = timeIdx.timeFrame
                    .split("-")
                    .includes(idx.timeText)
                    ? true
                    : false;
                }
                this.setState({
                  reserveTimes: periods,
                  courseId,
                  isNowDays: true,
                });
                return;
              } else {
                periods.map((item) => {
                  item.checkout = false;
                  return item;
                });
                this.setState({
                  reserveTimes: periods,
                  isNowDays: false,
                  courseId: "",
                });
              }
            }
          } else {
            periods.map((item) => {
              item.checkout = false;
              return item;
            });
            this.setState({
              reserveTimes: periods,
              isNowDays: false,
              courseId: "",
            });
          }
        }
      }
    );
  };

  // 设置日期单元格
  dateCellRender = (value) => {
    const { timeData } = this.state;
    for (let idx of timeData) {
      if (
        value.format("YYYY-MM-DD") ===
        moment(idx.startTime).format("YYYY-MM-DD")
      ) {
        return <div className="active"></div>;
      }
    }
  };

  // 查询讲师信息
  getSysTeacherInfoById() {
    post(servicePath.getSysTeacherInfoById, {
      teacherId: this.props.location.state.teacherId,
    })
      .then((res) => {
        const { code, data } = res.data;
        console.log("查询讲师信息成功", res.data);
        if (code === 0) {
          this.setState({
            teacherData: data,
          });
        } else {
          message.error(res.data.msg);
        }
      })
      .catch((err) => console.log("查询讲师信息异常", err));
  }

  // 查询指定日期的预约课程记录
  getSysCourseTimeSelectAll(month = this.state.month) {
    const { calendarValue } = this.state;
    post(servicePath.getSysCourseTimeSelectAll, {
      teacherId: this.props.location.state.teacherId,
      startTime: month,
    })
      .then((res) => {
        console.log("查询指定日期预约课程记录成功", res.data);
        const { code, data } = res.data;
        if (code === 0) {
          this.setState(
            {
              timeData: data,
            },
            () => {
              if (
                calendarValue.format("YYYY-MM-DD") ===
                moment(new Date()).format("YYYY-MM-DD")
              ) {
                console.log("进入");
                this.getNowTime();
              }
            }
          );
        }
      })
      .catch((err) => console.log("查询指定日期预约课程记录异常", err));
  }

  getNowTime() {
    periods.map((item) => {
      item.checkout = false;
      return item;
    });
    const { timeData, calendarValue } = this.state;
    const nowTime = utils.getNowDaysCanReserveTime();
    const times = [];
    let courseId = "";
    for (let timeIdx of timeData) {
      if (
        moment(timeIdx.startTime).format("YYYY-MM-DD") ===
        calendarValue.format("YYYY-MM-DD")
      ) {
        courseId = timeIdx.courseId;
        for (let idx of periods) {
          idx.checkout = timeIdx.timeFrame.split("-").includes(idx.timeText)
            ? true
            : false;
          if (idx.timeText > nowTime) {
            times.push(idx);
          }
        }
        this.setState({
          reserveTimes: times,
          courseId,
        });
        return;
      } else {
        periods.map((item) => {
          item.checkout = false;
          return item;
        });
      }
    }
  }

  componentDidMount() {
    document.title = "讲师 - 讲师详情";
    let times = [];
    for (let item of periods) {
      if (item.timeText > utils.getNowDaysCanReserveTime()) {
        times.push(item);
      }
    }
    this.setState(
      {
        reserveTimes: times,
      },
      () => {
        this.getSysCourseTimeSelectAll();
        this.getSysTeacherInfoById();
      }
    );
  }

  componentWillUnmount() {
    periods.map((item) => {
      item.checkout = false;
      return item;
    });
  }

  render() {
    const { calendarValue, reserveTimes, teacherData } = this.state;
    return (
      <Fragment>
        <div id="teacher-detail">
          <HeaderTitle title="讲师详情" />
          <div className="teacher-detail-box">
            <Row gutter={10}>
              <div style={{ marginRight: "68px" }}>
                <img
                  className="teacher-img"
                  src={teacherData.teacherImg}
                  alt=""
                />
              </div>
              <div style={{ maxWidth: "537px" }}>
                <div className="introduction">
                  <p className="teacher-name">{teacherData.teacherName}</p>
                  <p className="teacher-personalProfile">
                    {teacherData.personalProfile}
                  </p>
                </div>
              </div>
            </Row>
            <Row gutter={24} className="course">
              <Col span={24}>
                <h3 className="course-title">主讲课程</h3>
              </Col>
              <Col span={12}>
                <div className="course-content">
                  {teacherData.courseContent}
                </div>
              </Col>
            </Row>
            <Row gutter={24} className="reserve-times">
              <Col span={24}>
                <h3 className="reserve-title">可预约时间</h3>
              </Col>
              <Col span={6}>
                <div className="site-calendar">
                  <Calendar
                    value={calendarValue}
                    fullscreen={false}
                    dateCellRender={this.dateCellRender}
                    onSelect={this.calendarSelect}
                  />
                </div>
                <ul className="time-period-list">
                  {reserveTimes.map((item) => (
                    <li
                      className={`list-item ${
                        item.checkout ? "list-item-ac" : ""
                      }`}
                      key={item.timeId}
                    >
                      <span>{item.timeText}</span>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TeacherDetail;
