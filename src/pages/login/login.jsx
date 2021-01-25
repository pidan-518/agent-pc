import React, { Component, Fragment } from "react";
import { Button, Form, message, Spin } from "antd";
import "./login.less";
import "../../common/globalstyle.less";
import Axios from "axios";
import servicePath from "../../common/util/api/apiUrl";

export class Login extends Component {
  state = {
    isSubmit: false,
  };

  handleLoginSubmit(values) {
    this.setState({
      isSubmit: true,
    });
    const postData = {
      loginName: `${values.account}`,
      password: `${values.password}`,
    };
    this.getLogin(postData);
  }

  getLogin(postData) {
    Axios({
      url: servicePath.getLogin,
      method: "POST",
      data: postData,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const data = res.data;
        this.setState({
          isSubmit: false,
        });
        if (data.code === 0) {
          if (data.data.userType === "00") {
            localStorage.setItem("userInfo", JSON.stringify(data.data));
            message.success("登录成功");
            this.props.history.replace(`${process.env.pathConstants}/index/`);
          } else {
            message.error("您不是管理员");
          }
        } else {
          message.error(data.msg);
        }
      })
      .catch((err) => {
        this.setState({
          isSubmit: false,
        });
        message.error("网络连接失败，请稍后重试");
      });
  }

  componentDidMount() {
    document.title = "登录";
  }

  render() {
    const { isSubmit } = this.state;
    return (
      <Fragment>
        <div id="login">
          <img
            className="bg-img"
            src={require("../../static/login/login-bg.png")}
            alt=""
          />
          <div className="login-box">
            <Spin tip="Loading..." spinning={isSubmit}>
              <div className="log">
                <img
                  className="log-img"
                  src={require("../../static/login/log.png")}
                  alt=""
                />
              </div>
              <Form
                action=""
                onFinish={this.handleLoginSubmit.bind(this)}
                className="login-form"
              >
                <Form.Item
                  name="account"
                  rules={[{ required: true, message: "请输入帐号" }]}
                >
                  <div className="form-item">
                    <input placeholder="请输入账号" className="form-input" />
                  </div>
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "请输入密码" }]}
                >
                  <div className="form-item">
                    <input
                      placeholder="请输入密码"
                      className="form-input"
                      type="password"
                    />
                  </div>
                </Form.Item>
                <div className="btn">
                  <Button
                    className="login-btn"
                    htmlType="submit"
                    type="primary"
                  >
                    登录
                  </Button>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;
