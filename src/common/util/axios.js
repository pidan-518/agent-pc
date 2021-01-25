import { message } from "antd";
import axios from "axios";

const instance = axios.create();

instance.defaults.withCredentials = true;
instance.defaults.headers.post["Content-Type"] = "application/json"; // post请求头

// 添加请求拦截器
/* instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.common['JWT-Token'] = token;
    } else {
      console.log("进入登录页面");
    }
    return config
  }, 
  err => {
    return Promise.reject(err);
  }
) */
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case 403:
        localStorage.removeItem("userInfo");
        message.error(response.data.msg, 1.5, () => {
          window.location.href = `${process.env.pathConstants}/login`;
        });
        break;
      default:
        break;
    }
    return response;
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 403:
          localStorage.removeItem("userInfo");
          window.location.href = "/";
          break;
        default:
          break;
      }
    }
    return Promise.reject(err);
  }
);
export function post(url, params) {
  return new Promise((resolve, reject) => {
    instance({
      headers: {
        "Content-Type": "application/json",
      },
      url: url,
      data: JSON.stringify(params),
      method: "post",
    })
      .then((res) => {
        resolve(res);
        if (res.data.code === 403) {
          localStorage.removeItem("userInfo");
          window.location.href = `${process.env.pathConstants}/login`;
        }
      })
      .catch((err) => {
        reject(err);
        console.log("catch", err);
      });
  });
}
