import { post } from "./axios";
import ServicePath from "../../common/util/api/apiUrl";

export default {
  /**
   * 绑定、存储代理码
   */
  updateRecommendCode: (shareRecommend) => {
    if (shareRecommend) {
      const registerRecommend = shareRecommend; // 代理码，注册、购物分佣两用
      const recommendTime = Date.now(); // 打开分享链接的时间
      const postData = {
        recommend: registerRecommend,
        recommendTime,
      };
      post(ServicePath.updateRecommendCode, postData);
      localStorage.setItem("registerRecommend", registerRecommend);
      localStorage.setItem("recommendTime", recommendTime);
    }
  },
  /**
   * 获取url参数
   */
  getUrlParam: (param, search) => {
    const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`);
    const value = search.substr(1).match(reg);
    if (value != null) {
      return decodeURIComponent(value[2]);
    }
    return null;
  },

  /**
   * @description: 获取时间
   * @param {obtainMonth可传，默认状态下返回时间格式精确到日。传1则返回时间格式精确到月份}
   * @return {currentdate}
   */
  getNowFormatDate: (obtainMonth = "") => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    if (obtainMonth === 1) {
      return year + seperator1 + month;
    }
    return currentdate;
  },

  /**
   * @description: 获取当前时间--精确到分
   * @param {*}
   * @return {time}
   */
  getNowDaysCanReserveTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes() + 20;
    let plusHours = minutes > 60 ? hours + 1 : hours;
    let plusMin = minutes > 60 ? minutes - 60 : minutes;
    plusHours = plusHours < 10 ? `0${plusHours}` : plusHours;
    plusMin = plusMin < 10 ? `0${plusMin}` : plusMin;
    let time = `${plusHours}:${plusMin}`;
    return time;
  },
};
