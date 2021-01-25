import React from "react";
import "./addadministrator.less";
import "../../common/globalstyle.less";
import {
  Form,
  Input,
  Tooltip,
  message,
  Select,
  Button,
} from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
// console.log(this.props.match.params.id) getAdminList
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
const tailFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
let list = [];
let data = {}
let params = false

class AddAdministrator extends React.Component {
  state = {
    list1: [],
  };
  componentDidMount() {
    document.title = "添加管理员"
    this.getAdminList();
    this.pubList()
  }
  RegistrationForm = () => {
    const [form] = Form.useForm();
    setTimeout(() => {
      form.setFieldsValue({
        userName: data.userName,
        loginName: data.loginName,
        roleId: data.roleId
      });
    }, 100);

    const onFinish = values => {
     console.log(values.password.indexOf(' ')) 
     if(values.loginName.indexOf(' ') !== -1){
      message.warning('账号不能有空格');
      return
     }else if( values.password.indexOf(' ') !== -1){
      message.warning('密码不能有空格');
      return
     }
      if (values.password == values.repeatPassword) {

        if (values.password.length >= 6 && values.password.length <= 21) {
          console.log('Received values of form: ', values);
          if (this.props.match.params.id == 'null') {
            insert(values)
            console.log('values')
          } else {
            if (values.userName == data.userName || values.loginName == data.loginName) {
              values.userName = null;
              values.loginName = null
              sysAdminupdate(values)

            } else {
              sysAdminupdate(values)
            }
          }
        } else {
          message.warning('密码长度在6-21位');
        }
      }
    };
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    //修改
    const sysAdminupdate = (values) => {
      post(servicePath.sysAdminupdate, {
        ...values,
        userId: this.props.match.params.id
      })
        .then(response => {
          console.log(response, 'response')
          if (response.data.code == 0) {
            message.success(response.data.msg);
            setTimeout(() => {
              window.history.back()
            }, 2000);
          } else {
            message.warning(response.data.msg)
          }

        }
        )
    }
    //新增
    const insert = (values) => {
      post(servicePath.insert, {
        ...values,
        // userId: this.props.match.params.id
      })
        .then(response => {
          console.log(response, 'response')
          if (response.data.code == 0) {
            message.success(response.data.msg);
            setTimeout(() => {
              window.history.back()
            }, 2000);
          } else {
            message.warning(response.data.msg)
          }

        }
        )
    }

    return (
      <Form
        {...formItemLayout}

        form={form}
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        // initialValues={{
        //   // 'userName': `${data.userName}`,
        //   // prefix: '86',
        // }}
        scrollToFirstError
      >
        <Form.Item
          name="userName"
          label={
            <span>
              管理员
              {/* &nbsp;
              <Tooltip title="What do you want others to call you?">
                <QuestionCircleOutlined />
              </Tooltip> */}
            </span>
          }
          rules={[ { 
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
           },{ required: true, message: '请输入管理员名称', whitespace: true }]}
           //不能输入空格
        getValueFromEvent={(e)=>{
          return e.target.value.replace(/\s+/g,"");
        }}
        >
          <Input placeholder='管理员名称' />
        </Form.Item>

        <Form.Item
          name="loginName"
          label="账号"
          rules={[{ required: true, message: '请输入你的账号' },
          {
            validator: (_, value) =>
              value !== '' ? Promise.resolve() : Promise.reject(value),
          },
          { 
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
           },
          ]
        }
        //不能输入空格
        getValueFromEvent={(e)=>{
          return e.target.value.replace(/\s+/g,"");
        }}
        >
          <Input
            // addonBefore={prefixSelector} 
            style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              validator: (_, value) =>
                value.length <= 21 ? Promise.resolve() : Promise.reject('密码长度在6-21位'),
            },
            { 
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
             },
          ]}
          //不能输入空格
            getValueFromEvent={(e)=>{
          return e.target.value.replace(/\s+/g,"");
        }}
        // hasFeedback
        // help="The information is being validated..."
        >
          <Input.Password placeholder='密码长度在6-21位' />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          label="重复密码"
          dependencies={['password']}
          hasFeedback
          // help="The information is being validated..."
          rules={[
            {
              required: true,
              message: '输入重复密码',
            },
            {
              validator: (_, value) =>
                value.length <= 21 ? Promise.resolve() : Promise.reject('密码长度在6-21位'),
            },
            { 
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
             },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('您输入的两个密码不匹配！');
              },
            }),
          ]}
          //不能输入空格
          getValueFromEvent={(e)=>{
            return e.target.value.replace(/\s+/g,"");
          }}
        >
          <Input.Password placeholder='密码长度在6-21位' />
        </Form.Item>

        <Form.Item label="选择分组"
          name="roleId"
          rules={[{ required: true, message: '请输入你的选择' }]}>
          <Select>
            {list.map((item, index) => { return <Select.Option key={index} value={item.roleId}>{item.roleName}</Select.Option> })}
          </Select>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  };


  getAdminList = () => {
    if (this.props.match.params.id !== 'null') {
      post(servicePath.getAdminList, {
        userId: this.props.match.params.id
      })
        .then(response => {
          console.log(response, 'getAdminList')
          data = response.data.data.records[0]
          // FieldsValue()
        })
    } else {
      data = {}
    }

  }

  pubList = () => {
    post(servicePath.rolepubList, {
      current: 1,
      len: 50
    })
      .then(response => {
        console.log(response.data.data.records, 'rescccponse')
        list = response.data.data.records
        this.setState({
          list1: response.data.data.records
        })
      }
      )
  }

  render() {
    return (
      <div className='addAdministrator'>
        <h2 className='title'>添加管理员</h2>
        <div className='addForm'>
          <this.RegistrationForm />
        </div>
      </div>
    )
  }
}

export default AddAdministrator;