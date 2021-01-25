import React, { Component } from "react";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import "./teacherlist.less";
import "../../common/globalstyle.less";
import { Button, message, Modal, Pagination } from "antd";
import { post } from "../../common/util/axios";
import servicePath from "../../common/util/api/apiUrl";
import { AgentpcLink } from "../../components/AgentpcRouter/AgentpcRouter";

export class TeacherList extends Component {
  state = {
    teacherList: [],
    pages: 1,
    current: 1,
    total: 10,
  };

  // 讲师图片点击事件
  handleTeacherDetail = (item) => {
    this.props.history.push({
      pathname: `${process.env.pathConstants}/index/teacherdetail/`,
      state: { teacherId: item.teacherId },
    });
  };

  // 启用按钮点击事件
  handleEnable = (params) => {
    Modal.confirm({
      title: "提示",
      content: `确认${params.isEnable === 1 ? "不启用" : "启用"}该讲师？`,
      centered: true,
      onOk: () => {
        post(servicePath.getSysTeacherInfoEnable, {
          teacherId: params.teacherId,
          isEnable: params.isEnable,
        })
          .then((res) => {
            console.log("启用/不启用讲师成功", res.data);
            if (res.data.code === 0) {
              this.getTeacherList();
            }
          })
          .catch((err) => {
            console.log("启用/不启用讲师异常", err);
          });
      },
    });
  };

  // 编辑按钮点击事件
  handleTeacherEdit = (item) => {
    if (item.isEnable === 1) {
      return;
    }
    this.props.history.push({
      pathname: `${process.env.pathConstants}/index/editteacher/`,
      state: { teacherId: item.teacherId },
    });
  };

  // 删除按钮点击事件
  handleTeacherDelete = ({ teacherId }, index) => {
    const { teacherList } = this.state;
    Modal.confirm({
      title: "提示",
      content: "确认删除该讲师吗？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      onOk: (e) => {
        teacherList.splice(index, 1);
        this.setState(
          {
            teacherList,
          },
          () => {
            this.deleteTeacher(teacherId);
          }
        );
      },
    });
  };

  // 分页点击事件
  handlePagination = (page, pageSize) => {
    this.getTeacherList(page);
  };

  // 获取讲师列表
  getTeacherList(current = 1) {
    post(servicePath.getSelectTeacherListPC, {
      len: 20,
      current: current,
    })
      .then((res) => {
        console.log("获取讲师列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            teacherList: res.data.data.records,
            pages: res.data.data.pages,
            current: res.data.data.current,
            total: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        console.log("获取讲师列表接口异常", err);
      });
  }

  // 删除讲师
  deleteTeacher(teacherId) {
    post(servicePath.deleteTeacherAndCourse, {
      teacherId: teacherId,
    }).then((res) => {
      Modal.destroyAll();
      if (res.data.code === 0) {
        message.success("删除成功");
        this.getTeacherList();
      } else {
        message.error(res.data.msg);
      }
    });
  }

  componentDidMount() {
    document.title = "讲师 - 讲师列表";
    this.getTeacherList();
  }

  render() {
    const { teacherList, total } = this.state;
    return (
      <div id="teacher-list">
        <HeaderTitle title="讲师管理" />
        <div>
          <ul className="list">
            {teacherList.map((item, index) => (
              <li className="list-item" key={item.teacherId}>
                <div
                  className="item-img"
                  onClick={this.handleTeacherDetail.bind(this, item)}
                >
                  <img src={item.teacherImg} alt="" />
                </div>
                <div className="buttons">
                  <Button
                    type="primary"
                    size="small"
                    onClick={this.handleEnable.bind(this, item)}
                  >
                    {item.isEnable === 1 ? "已启用" : "未启用"}
                  </Button>
                  <Button
                    size="small"
                    disabled={item.isEnable === 1 ? true : false}
                    onClick={this.handleTeacherEdit.bind(this, item)}
                  >
                    编辑
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    danger
                    disabled={item.isEnable === 1 ? true : false}
                    onClick={this.handleTeacherDelete.bind(this, item, index)}
                  >
                    删除
                  </Button>
                </div>
              </li>
            ))}
            {teacherList.length < 30 ? (
              <AgentpcLink to="/index/addteacher/">
                <div className="add-teacher">
                  <img
                    className="add-teacher-icon"
                    src={require("../../static/teacher/add-icon.png")}
                    alt=""
                  />
                </div>
              </AgentpcLink>
            ) : null}
          </ul>
        </div>
        <div className="pagination">
          <Pagination
            onChange={this.handlePagination}
            pageSize="20"
            total={total}
          />
        </div>
      </div>
    );
  }
}

export default TeacherList;
