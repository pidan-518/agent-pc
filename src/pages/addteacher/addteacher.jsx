import React, { Component } from "react";
import { Button, Calendar, Form, Input, Upload, message, Spin } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import "./addteacher.less";
import moment from "moment";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";
import { periods } from "./periods";
import utils from "../../common/util/utils";

const { TextArea } = Input;

export class AddTeacher extends Component {
  state = {
    calendarValue: moment(new Date()),
    loading: false,
    fileList: [],
    imageUrl: "", // 转base64之后的头像
    avatarUrl: "", // 传到后台的头像url
    reserveTimes: periods, // 时间段
    timeFrame: [], // 传给后台的时间段
    month: utils.getNowFormatDate(1), // 月份
    isSpinning: false, // 加载中状态
    timeData: [], // 选中的时间
  };

  // 讲师图片上传按钮
  handleUpload = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === "done") {
      const { code, msg, data } = info.file.response;
      if (code === 403) {
        message.error(msg, 1.5, () => {
          this.props.history.push("/login/");
        });
        return;
      } else if (code !== 0) {
        message.error(msg);
        return;
      }
      message.success("上传成功");
      this.getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          avatarUrl: data,
          loading: false,
        });
      });
    }
  };

  // 时间段点击事件
  handleReserveTimeClick = (time) => {
    const { reserveTimes } = this.state;
    reserveTimes.map((item) => {
      if (item.timeId === time.timeId) {
        if (item.checkout) {
          item.checkout = false;
        } else {
          item.checkout = true;
        }
      }
      return item;
    });
    this.setState({
      reserveTimes,
    });
  };

  // 表单提交事件
  handlerSubmit = (value) => {
    const { avatarUrl, reserveTimes, timeData, calendarValue } = this.state;
    let times = reserveTimes.filter((item) => item.checkout === true);
    if (timeData.length === 0) {
      timeData.push({
        startTime: calendarValue.format("YYYY-MM-DD"),
        timeFrame: times.map((item) => item.timeText),
      });
    } else if (timeData.length !== 0 && times.length !== 0) {
      timeData.push({
        startTime: calendarValue.format("YYYY-MM-DD"),
        timeFrame: times.map((item) => item.timeText),
      });
    }

    this.setState({
      isSpinning: true,
    });
    post(servicePath.addTeacherAndCourse, {
      teacherName: value.teacherName,
      personalProfile: value.teacherIntro,
      courseContent: value.course,
      teacherImg: avatarUrl,
    })
      .then((res) => {
        console.log("添加讲师成功", res.data);
        const { code, data } = res.data;
        if (code === 0) {
          this.setSysCourseTimeInsert(data.teacherId);
        }
      })
      .catch((err) => {
        console.log("添加讲师失败", err);
      });
  };

  // 禁用日期
  disabledDate = (date) => {
    if (date.format("YYYY-MM-DD") < utils.getNowFormatDate()) {
      return true;
    }
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

  // 选择日期回调
  calendarSelect = (date) => {
    let calendarTime = date.format("YYYY-MM-DD"); // 选中日期
    let times = utils.getNowFormatDate(); // 今天的日期
    const nowTime = utils.getNowDaysCanReserveTime(); // 当前时间段
    const { timeData, reserveTimes, calendarValue } = this.state;
    const period = reserveTimes.filter((item) => item.checkout === true); // 筛选是否有时间段被选中
    if (period.length !== 0) {
      // timeData.length等于0 证明是首次添加课程
      if (timeData.length === 0) {
        timeData.push({
          startTime: calendarValue.format("YYYY-MM-DD"),
          timeFrame: period.map((item) => item.timeText),
        });
      }

      let daysArr = []; // 储存被选中的日期  用于查询被选中的的日期
      timeData.forEach((item) => {
        daysArr.push(item.startTime);
      });

      // 如果当前选中的日期没有存在daysArr数组，将视为添加日期并且添加时间段
      if (!daysArr.includes(calendarValue.format("YYYY-MM-DD"))) {
        timeData.push({
          startTime: calendarValue.format("YYYY-MM-DD"),
          timeFrame: period.map((item) => item.timeText),
        });
      }

      // 这里是替换被选中过的日期
      for (let i = 0; i < timeData.length; i++) {
        if (timeData[i].startTime === calendarValue.format("YYYY-MM-DD")) {
          timeData.splice(i, 1, {
            startTime: calendarValue.format("YYYY-MM-DD"),
            timeFrame: period.map((item) => item.timeText),
          });
        }
      }
    } else {
      // 如果选中了日期，没有选中时间段被视为删除
      for (let i = 0; i < timeData.length; i++) {
        if (timeData[i].startTime === calendarValue.format("YYYY-MM-DD")) {
          timeData.splice(i, 1);
        }
      }
    }

    // 如果选中的日期等于今天的日期
    if (times === calendarTime) {
      // 展示当前时间段后的时间段
      this.getNowTime();
      // 如果timeData长度不等于0，就从timeData里查询是否存在今天的日期
      if (timeData.length !== 0) {
        let timeArr = [];
        for (let idx of timeData) {
          // 查询timeData里是否有今天的日期，有则展示选中的时间段
          if (idx.startTime === times) {
            timeArr = [];
            for (let perItem of periods) {
              if (perItem.timeText > nowTime) {
                perItem.checkout = idx.timeFrame.includes(perItem.timeText)
                  ? true
                  : false;
                timeArr.push(perItem);
              }
            }
            this.setState({
              reserveTimes: timeArr,
              calendarValue: date,
            });
            return;
          } else {
            // 如果timeData里没有今天的日期，则展示当前时间段后的时间段
            periods.map((item) => {
              if (item.checkout) {
                item.checkout = false;
              }
              return item;
            });
            this.getNowTime();
          }
        }
      }
    } else {
      // 如果没有今天的日期，就相当于选中了其他的日期
      periods.map((item) => {
        if (item.checkout === true) {
          item.checkout = false;
        }
        return item;
      });
      for (let idx of timeData) {
        if (idx.startTime === calendarTime) {
          for (let perItem of periods) {
            perItem.checkout = idx.timeFrame.includes(perItem.timeText)
              ? true
              : false;
          }
        }
      }
      this.setState({
        reserveTimes: periods,
      });
    }
    this.setState({ calendarValue: date, timeData });
  };

  // 添加讲师课程预约时间
  setSysCourseTimeInsert(teacherId) {
    const postData = [];
    for (let idx of this.state.timeData) {
      postData.push({
        teacherId: teacherId,
        startTime: idx.startTime,
        timeFrame: idx.timeFrame.join("-"),
      });
    }
    setTimeout(() => {
      this.setState(
        {
          isSpinning: false,
        },
        () => {
          post(servicePath.setSysCourseTimeInsert, postData)
            .then((res) => {
              console.log("添加讲师课程预约时间成功", res.data);
              if (res.data.code === 0) {
                message.success("添加讲师课程成功");
                setTimeout(() => {
                  this.props.history.push(
                    `${process.env.pathConstants}/index/teacherlist/`
                  );
                }, 500);
              } else {
                message.error("添加讲师课程失败");
              }
            })
            .catch((err) => console.log("添加讲师课程预约时间失败", err));
        }
      );
    }, 1000);
  }

  getNowTime() {
    const { reserveTimes } = this.state;
    const nowTime = utils.getNowDaysCanReserveTime();
    const times = [];
    for (let idx of reserveTimes) {
      if (idx.timeText > nowTime) {
        times.push(idx);
      }
    }
    this.setState({
      reserveTimes: times,
    });
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file, fileList) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("请上传jpeg/png格式的图片");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("请上传小于2MB的图片");
    }
    return isJpgOrPng && isLt2M;
  }

  componentDidMount() {
    document.title = "讲师 - 添加讲师";
    this.getNowTime();
  }

  componentWillUnmount() {
    periods.map((item) => {
      item.checkout = false;
      return item;
    });
  }

  render() {
    const {
      calendarValue,
      loading,
      imageUrl,
      fileList,
      reserveTimes,
      isSpinning,
    } = this.state;
    const uploadButton = (
      <div>
        {loading ? (
          <LoadingOutlined style={{ fontSize: "30px" }} />
        ) : (
          <PlusOutlined style={{ fontSize: "30px" }} />
        )}
      </div>
    );
    return (
      <div id="add-teacher">
        <HeaderTitle title="添加讲师" />
        <Spin tip="Loading..." spinning={isSpinning}>
          <div className="add-teacher-box">
            <Form onFinish={this.handlerSubmit}>
              <Form.Item
                name="teacherImg"
                rules={[{ required: true, message: "请上传讲师图片" }]}
              >
                <div>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={servicePath.getSysTeacherInfoImportUpload}
                    accept="image/png, image/jpeg"
                    method="post"
                    fileList={fileList}
                    withCredentials="true"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleUpload}
                  >
                    {imageUrl ? (
                      <img
                        className="avatar"
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                  <div className="upload-warn">
                    图片大小不超过2M，建议比例1:1
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label="讲师姓名"
                name="teacherName"
                rules={[{ required: true, message: "请输入讲师姓名" }]}
              >
                <Input maxLength={32} />
              </Form.Item>
              <Form.Item
                name="teacherIntro"
                rules={[{ required: true, message: "请填写个人简介" }]}
              >
                <div>
                  <label htmlFor="">个人简介：</label>
                  <TextArea rows={6} />
                </div>
              </Form.Item>
              <Form.Item
                name="course"
                rules={[{ required: true, message: "请填写主讲课程" }]}
              >
                <div>
                  <label htmlFor="">主讲课程：</label>
                  <TextArea rows={6} />
                </div>
              </Form.Item>
              <div className="reservation">
                <div className="reservation-title">预约时间：</div>
                <div className="site-calendar">
                  <Calendar
                    value={calendarValue}
                    fullscreen={false}
                    onSelect={this.calendarSelect}
                    disabledDate={this.disabledDate}
                    dateCellRender={this.dateCellRender}
                  />
                </div>
                <ul className="time-period-list">
                  {reserveTimes.map((item) => (
                    <li
                      className={`list-item ${
                        item.checkout ? "list-item-ac" : ""
                      }`}
                      key={item.timeId}
                      onClick={this.handleReserveTimeClick.bind(this, item)}
                    >
                      <span>{item.timeText}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="submit">
                <Button type="primary" htmlType="submit" block>
                  保存
                </Button>
              </div>
            </Form>
          </div>
        </Spin>
      </div>
    );
  }
}

export default AddTeacher;
