import React from "react";
import "./agentsetup.less";
import "../../common/globalstyle.less";
import {Form, Button,InputNumber,Select,message } from "antd";
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'

class AgentSetup extends React.Component {
        state={
          list: {userName:1},
          userId:this.props.match.params.id
        }
  componentDidMount() {
    document.title = "代理人设置"
    this.getData()
  }
   onFinish = (values) => {
    console.log('Success:', values);
    post(servicePath.updateAgentUserAdmin, {
      userId: this.state.userId,
      frozenAmount: +values.inputNumber,
      status: values.status
    })
      .then(response => {      
       if(response.data.code==0){
        console.log(response.data.msg)   
        message.success(`${response.data.msg}`, 2);
        setTimeout(() => {
          window.history.back()
        }, 2000);
       }else{
        message.warning(`${response.data.msg}`, 2);
       }
      })  
  };

 onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //请求列表
  getData = () => {
    post(servicePath.getAgentUserDetail, 
      { userId: this.state.userId }
    )
      .then(response => {
        const list = response.data.data || {};
        console.log(response.data.data,'respons');
        this.setState({ list:list},()=>{console.log(this.state.list.frozenAmount,'list')});
        // form.setFieldsValue({'input-number':30})
        this.formRef.setFieldsValue({ 'inputNumber': this.state.list.frozenAmount ,
        'status':this.state.list.status === '1' ? '是' : '否'
      });
  })
}
  render() {
   const  {list} = this.state
    return (
      <div className='agentSetup'>
        <div className='title'>
          <div className='icon'></div>
          <div className='headTitle'>代理人设置</div>
        </div>
        <Form
       ref={(e)=>this.formRef=e} 
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 14 }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          initialValues={{
            // ['inputNumber']:null,
            // ['status']:list.selectorChecked === '1' ? '是' : '否' 
          }}
          layout="horizontal"
          // initialValues={{ size: componentSize }}
          // onValuesChange={onFormLayoutChange}
          // size={componentSize}
        >
          <Form.Item label="昵称" > {list.userName} </Form.Item>
          <Form.Item label="姓名">{list.realName} </Form.Item>
          <Form.Item label="手机号码">{list.phonenumber}</Form.Item>
          <Form.Item label="地区">{list.region} </Form.Item>
          <Form.Item label="佣金余额">{list.balanceCommission}</Form.Item>
          <Form.Item label="冻结金额" 
         name='inputNumber'
          >        
          <InputNumber 
          min={0}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="是否冻结账号"        
             name='status'>
            <Select
            style={{ width: 200 }}
            placeholder="是否冻结账号"         
            onChange={this.onChange}
            >
              <Select.Option key='是' value="1">是</Select.Option>
              <Select.Option key ='否' value="0">否</Select.Option>
            </Select>
          </Form.Item> 
        <Form.Item  wrapperCol ={{ offset: 4, span: 8 }}>
        <Button type="primary" htmlType="submit" className='btn'>
          提交
        </Button>
        </Form.Item>

        </Form>
      </div>
    )
  }
}

export default AgentSetup;