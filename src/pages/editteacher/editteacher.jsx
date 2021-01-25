import React, { Component, Fragment } from "react";
import { Button, Calendar, Form, Input, Upload, message, Spin } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import "./editteacher.less";
import moment from "moment";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";
import { periods } from "../addteacher/periods";
import utils from "../../common/util/utils";

const { TextArea } = Input;
const { Item } = Form;
const formRef = React.createRef();

export class EditTeacher extends Component {
  state = {
    calendarValue: moment(new Date()),
    loading: false,
    fileList: [],
    imageUrl: "", // 转base64之后的头像
    avatarUrl: "", // 传到后台的头像url
    reserveTimes: periods, // 时间段
    teacherId: "", // 讲师id
    timeData: [], // 后台返回的可预约数据
    isNowDays: true, // 是否为今天, 默认为今天
    courseId: "", //  讲师课程时间id
    isSpinning: false,
    month: utils.getNowFormatDate(1), // 月份
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

  // 表单提交事件
  handlerSubmit = (value) => {
    const { avatarUrl, reserveTimes, courseId } = this.state;
    let timeFrame = [];
    reserveTimes.forEach((item) => {
      if (item.checkout) {
        timeFrame.push(item.timeText);
      }
    });

    if (timeFrame.length !== 0) {
      this.setState({
        isSpinning: true,
      });
      post(servicePath.getTeacherAndCourseUpdate, {
        teacherId: this.props.location.state.teacherId,
        teacherName: value.teacherName,
        personalProfile: value.teacherIntro,
        courseContent: value.course,
        teacherImg: avatarUrl,
      })
        .then((res) => {
          console.log("修改讲师信息成功", res.data);
          if (res.data.code === 0) {
            if (courseId !== "") {
              this.getSysCourseTimeUpdate(timeFrame.join("-"));
            } else {
              this.setSysCourseTimeInsert(timeFrame.join("-"));
            }
          }
        })
        .catch((err) => {
          console.log("修改讲师信息异常", err);
        });
    } else {
      message.warning("请选择预约时间段");
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

  // 查询讲师信息
  getSysTeacherInfoById() {
    post(servicePath.getSysTeacherInfoById, {
      teacherId: this.props.location.state.teacherId,
    })
      .then((res) => {
        const { code, data } = res.data;
        console.log("查询讲师信息成功", res.data);
        if (code === 0) {
          formRef.current.setFieldsValue({
            teacherImg: data.teacherImg,
            teacherName: data.teacherName,
            teacherIntro: data.personalProfile,
            course: data.courseContent,
          });
          this.setState({
            imageUrl: data.teacherImg,
            avatarUrl: data.teacherImg,
            teacherId: data.teacherId,
          });
        } else {
          message.error(res.data.msg);
        }
      })
      .catch((err) => console.log("查询讲师信息异常", err));
  }

  // 修改讲师课程
  getSysCourseTimeUpdate(timeFrame) {
    const { calendarValue } = this.state;
    const postData = [
      {
        courseId: this.state.courseId,
        teacherId: this.props.location.state.teacherId,
        startTime: calendarValue.format("YYYY-MM-DD"),
        timeFrame: timeFrame,
      },
    ];
    setTimeout(() => {}, 1500);
    post(servicePath.getSysCourseTimeUpdate, postData)
      .then((res) => {
        console.log("修改讲师课程成功", res.data);
        this.setState({
          isSpinning: false,
        });
        if (res.data.code === 0) {
          message.success("修改讲师课程成功");
          this.getSysCourseTimeSelectAll();
        } else {
          message.error("修改讲师课程失败");
        }
      })
      .catch((err) =>
        this.setState(
          {
            isSpinning: false,
          },
          () => {
            console.log("修改讲师课程失败", err);
          }
        )
      );
  }

  // 添加讲师课程预约时间
  setSysCourseTimeInsert(timeFrame) {
    const { calendarValue } = this.state;
    const postData = [
      {
        teacherId: this.props.location.state.teacherId,
        startTime: calendarValue.format("YYYY-MM-DD"),
        timeFrame: timeFrame,
      },
    ];
    post(servicePath.setSysCourseTimeInsert, postData)
      .then((res) => {
        console.log("添加讲师课程预约时间成功", res.data);
        this.setState({
          isSpinning: false,
        });
        if (res.data.code === 0) {
          message.success("添加讲师课程成功");
          this.getSysCourseTimeSelectAll();
        } else {
          message.error("添加讲师课程失败");
        }
      })
      .catch((err) =>
        this.setState(
          {
            isSpinning: false,
          },
          () => {
            console.log("添加讲师课程预约时间失败", err);
          }
        )
      );
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
      <Fragment>
        <div id="edit-teacher">
          <HeaderTitle title="编辑讲师" />
          <Spin tip="Loading..." spinning={isSpinning}>
            <div className="edit-teacher-box">
              <Form
                layout="vertical"
                onFinish={this.handlerSubmit}
                ref={formRef}
                requiredMark="optional"
              >
                <Item
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
                </Item>
                <Item
                  label="讲师姓名"
                  name="teacherName"
                  colon
                  rules={[{ required: true, message: "请输入讲师姓名" }]}
                >
                  <Input maxLength={32} />
                </Item>
                <Item
                  name="teacherIntro"
                  label="个人简介"
                  colon
                  rules={[{ required: true, message: "请填写个人简介" }]}
                >
                  <TextArea rows={6} />
                </Item>
                <Item
                  name="course"
                  label="主讲课程"
                  colon
                  rules={[{ required: true, message: "请填写主讲课程" }]}
                >
                  <TextArea rows={6} />
                </Item>
                <div className="reservation">
                  <div className="reservation-title">预约时间：</div>
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
      </Fragment>
    );
  }
}

export default EditTeacher;
