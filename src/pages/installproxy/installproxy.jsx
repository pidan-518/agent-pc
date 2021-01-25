import React from "react";
import "./installproxy.less";
import servicePath from "../../common/util/api/apiUrl";
import { post } from "../../common/util/axios";
import {
  Layout,
  Menu,
  Icon,
  Select,
  InputNumber,
  Button,
  Form,
  Input,
  message,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Route } from "react-router-dom";
import FormItem from "antd/lib/form/FormItem";
// import "../common/globalstyle.less";

const { Content, Footer, Sider, Header } = Layout;
const { SubMenu } = Menu;

export class Installproxy extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      collapsed: false,
      userName: "", //路由传参-代理人等级名称
      userId: "", //路由传参-代理人id
      userLevle: "", //路由传参-代理人等级
      code: "", //后台返回的请求状态
      getInfo: {
        name: "", //级别名称
        level: "", //级别 数字越大级别越低
        isDowngrade: 0, //是否可降级 0否1是
        isCompany: 0, //是否属于企业内部员工  0否1是
        isAutoUpgrade: 0, // 是否自动升级  0否1是
        isAutoDowngrade: 0, // 是否自动降级  0否1是
        conditionShow: 0, // 条件展示配置  0不展示 1在所有代理人界面展示  2在未达到该等级的代理人界面展示
        upgradeFee: "", //升级费用
        upgradeNumSub: "", //升级需要第一下级人数
        upgradeNumTeam: "", //升级需要团队人数
        upgradeTurnover: "", //升级需要单月营业额
        upgradeMonth: "", //升级需要连续达标月数
        trialMonth: "", //试用期月数
      },
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  // 是否可降级-选择器赋值
  onChange = (e) => {
    console.log(e, "选择器");
    this.setState({
      getInfo: { ...this.state.getInfo, isDowngrade: e },
    });
  };

  componentDidMount() {
    document.title = "代理人设置";
    const levelId = this.props.match.params.id;
    console.log("用户id", levelId);
    const username = this.props.match.params.name;
    this.onChange();
    // 接口-根据ID查询等级详情
    post(servicePath.getById, {
      id: levelId,
    })
      .then((res) => {
        this.setState({
          userName: res.data.data.name,
          userId: res.data.data.id,
          userLevle: res.data.data.level,
          getInfo: res.data.data,
        });
        this.formRef.setFieldsValue({
          upgradeFee: this.state.getInfo.upgradeFee,
          upgradeNumSub: this.state.getInfo.upgradeNumSub,
          upgradeNumTeam: this.state.getInfo.upgradeNumTeam,
          upgradeTurnover: this.state.getInfo.upgradeTurnover,
          upgradeMonth: this.state.getInfo.upgradeMonth,
          trialMonth: this.state.getInfo.trialMonth,
          isDowngrade: this.state.getInfo.isDowngrade,
          isCompany: this.state.getInfo.isCompany,
          isAutoUpgrade: this.state.getInfo.isAutoUpgrade,
          isAutoDowngrade: this.state.getInfo.isAutoDowngrade,
          conditionShow: this.state.getInfo.conditionShow,
        });
      })
      .catch((err) => {});
    this.setState(
      {
        userId: levelId,
        userName: username,
      }
      // () => console.log(this.state.userId, 1111111)
    );
  }

  // 表单提交事件
  onFinish = (values) => {
    console.log("表单输出: ", values);
    post(servicePath.getAgentLevelEdit, {
      id: this.state.userId, //路由传的-id
      name: this.state.userName, //路由传的-等级名称
      level: this.state.userId, //设置的-等级
      isAutoDowngrade: values.isAutoDowngrade, //是否自动降级 1是 0否
      isCompany: values.isCompany, //是否属于企业内部员工： 0不是 1是
      isAutoUpgrade: values.isAutoUpgrade, //是否自动升级  0否 1是
      isDowngrade: values.isDowngrade, //是否可降级  0否 1是
      conditionShow: values.conditionShow, //条件展示配置：0不展示 1在所有代理人界面展示  2在未达到该等级的代理人界面展示
      upgradeFee: values.upgradeFee, //升级费用
      upgradeNumSub: values.upgradeNumSub, //升级需要第一下级人数
      upgradeNumTeam: values.upgradeNumTeam, //升级需要团队人数
      upgradeTurnover: values.upgradeTurnover, //升级需要单月营业额
      upgradeMonth: values.upgradeMonth, //升级需要连续达标月数
      trialMonth: values.trialMonth, //试用期月数
    }).then((res) => {
      console.log("保存成功");
    });

    this.setState({
      getInfo: values,
    });
    window.history.back(-1);
    message.success("保存成功");
  };

  render() {
    const { Option } = Select;
    const { collapsed, getInfo } = this.state;
    return (
      <div className="pc-installproxy">
        {/* 标题开始 */}
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">代理人设置</span>
        </div>
        {/* 标题结束 */}
        <Form
          ref={(e) => {
            this.formRef = e;
          }}
          onFinish={this.onFinish}
          // onValuesChange={this.onChange}
          initialValues={{
            upgradeFee: null,
            upgradeNumSub: null,
            upgradeNumTeam: null,
            upgradeTurnover: null,
            upgradeMonth: null,
            trialMonth: null,
            isDowngrade: null,
            isCompany: null,
            isAutoUpgrade: null,
            isAutoDowngrade: null,
            conditionShow: null,
          }}
        >
          {/* 内容开始 */}
          <div className="content">
            <Form.Item
              className="content-levelName"
              name="levelName"
              label="等级名称："
            >
              {/* <text className="levelName-title">等级名称：</text> */}
              <text className="levelName-content">{this.state.userName}</text>
            </Form.Item>
            <Form.Item className="content-level" name="username" label="等级：">
              {/* <text>等级：</text> */}
              <text className="number">{this.state.userId}</text>
            </Form.Item>
            <Form.Item
              className="content-upgrade-cost"
              name="upgradeFee"
              label="升级费用："
              rules={[
                {
                  required: true,
                  message: "请输入升级费用",
                },
              ]}
            >
              {/* <text>升级费用：</text> */}
              <Input
                type="number"
                placeholder="请输入升级费用"
                min={0}
                allowClear
              />
            </Form.Item>
            <Form.Item
              className="content-upgrade-firstNum"
              name="upgradeNumSub"
              label="升级需要第一下级人数："
              rules={[
                {
                  required: true,
                  message: "请设置升级人数",
                },
              ]}
            >
              {/* <text>升级需要第一下级人数：</text> */}
              <Input
                type="number"
                placeholder="请设置升级人数"
                min={0}
                allowClear
              />
            </Form.Item>
            <Form.Item
              className="content-upgrade-teamNum"
              name="upgradeNumTeam"
              label="升级需要团队人数："
              rules={[
                {
                  required: true,
                  message: "请设置需升级团队人数",
                },
              ]}
            >
              {/* <text>升级需要团队人数：</text> */}
              <Input
                type="number"
                placeholder="请设置需升级团队人数"
                min={0}
                allowClear
              />
            </Form.Item>
            <Form.Item
              className="content-upgrade-monthTurnover"
              name="upgradeTurnover"
              label="升级需要单月营业额："
              rules={[
                {
                  required: true,
                  message: "请设置升级需要单月营业额",
                },
              ]}
            >
              {/* <text>升级需要单月营业额：</text> */}
              <Input
                type="number"
                placeholder="请设置需单月营业额"
                min={0}
                allowClear
              />
            </Form.Item>
            <Form.Item
              className="content-upgrade-continuousMonth"
              name="upgradeMonth"
              label="升级需要连续达标月数："
              rules={[
                {
                  required: true,
                  message: "请设置需连续达标月数",
                },
              ]}
            >
              {/* <text>升级需要连续达标月数：</text> */}
              <Input
                type="number"
                placeholder="请设置需连续达标月数"
                min={0}
                allowClear
              />
            </Form.Item>
            <Form.Item
              className="content-month"
              name="trialMonth"
              label="试用月数："
              rules={[
                {
                  required: true,
                  message: "请设置试用月数",
                },
              ]}
            >
              {/* <text>试用月数：</text> */}
              <Input
                type="number"
                placeholder="请输入试用时间"
                min={0}
                allowClear
              />
            </Form.Item>
            {/* 下拉列表开始 */}
            <Form.Item
              className="select-item"
              name="isDowngrade"
              label="是否可降级："
              rules={[
                {
                  required: true,
                  message: "请设置是否可降级",
                },
              ]}
              onChange={this.onChange}
            >
              {/* <text>是否可降级：</text> */}
              <Select
                // showSearch
                placeholder="请选择"
                onChange={this.onChange}
                allowClear
              >
                {/* <Option>请选择</Option> */}
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="select-item"
              name="isCompany"
              label="是否为内部员工："
              rules={[
                {
                  required: true,
                  message: "请设置是否为内部员工",
                },
              ]}
            >
              {/* <text>是否内部员工：</text> */}
              <Select placeholder="请选择" allowClear>
                <Option value={0}>否</Option>
                <Option value={1}>是</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className="select-item"
              name="isAutoUpgrade"
              label="升级设置："
              rules={[
                {
                  required: true,
                  message: "请设置升级设置",
                },
              ]}
            >
              {/* <text>升级设置：</text> */}
              <Select placeholder="请选择" allowClear>
                <Option value={0}>达标后手动申请升级</Option>
                <Option value={1}>达标后自动升级</Option>
              </Select>
            </Form.Item>
            {getInfo.isDowngrade === 1 ? (
              <Form.Item
                className="select-item"
                name="isAutoDowngrade"
                label="降级设置："
                rules={[
                  {
                    required: true,
                    message: "请设置降级设置",
                  },
                ]}
              >
                {/* <text>升级设置：</text> */}
                <Select placeholder="请选择" allowClear>
                  <Option value={0}>达到条件后管理员审核降级</Option>
                  <Option value={1}>达到条件后自动降级</Option>
                </Select>
              </Form.Item>
            ) : (
              ""
            )}
            <Form.Item
              className="select-item"
              name="conditionShow"
              label="展示设置："
              rules={[
                {
                  required: true,
                  message: "请设置展示设置",
                },
              ]}
            >
              {/* <text>展示设置：</text> */}
              <Select placeholder="请选择" allowClear>
                <Option value={0}>不展示</Option>
                <Option value={1}>展示</Option>
              </Select>
            </Form.Item>
            {/* 下拉列表结束 */}
          </div>
          {/* 内容结束 */}
          {/* 确定按钮开始 */}
          <div className="installProxy-btn">
            <div className="btn-div">
              <Button type="primary" htmlType="submit" className="btn">
                <text className="btn-content">确定</text>
              </Button>
            </div>
            <div className="null"></div>
          </div>
          {/* 确定按钮结束 */}
        </Form>
      </div>
    );
  }
}

export default Installproxy;
