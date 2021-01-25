import React from "react";
import "./adddownreason.less";
import "../../common/globalstyle.less";
import { Button, message } from "antd";
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
class AddDownReason extends React.Component {
  state = {
    bool: true//防止重复点击
  }
  componentDidMount() {
    document.title = "添加降级原因"
  }

  determine = () => {
    // console.log('ll',this.text.value)  
    if (this.state.bool) {
      this.setState({
        bool: false
      })
      if(this.text.value.length===0){
        message.warning('输入内容不能为空')
        setTimeout(() => {
          this.setState({
            bool: true
          })
        }, 1500);      
        return
      }
     post(servicePath.insertstaff, {
        contentReason: this.text.value
      })
        .then(response => {
          console.log(response,'repspsp')
          if(response.data.code === 0){
            message.success(`${response.data.msg}`, 2)
            // this.setState({
            //   bool: true
            // })
            setTimeout(() => {
              window.history.back()
            }, 2000);
          }else{
            message.warning(`${response.data.msg}`, 2)
            this.setState({
              bool: true
            })
          }
         
        })
    }
  

  }
  render() {
    return (
      <div className='addDownReason'>
        <div className='title'> 添加降级原因</div>
        <div className='reasonBox'>
          <div className='context'>
            <span className='addReason'>添加原因：</span>
            <input type="text" placeholder='输入降级原因' className='inputReason' ref={el => this.text = el} />
          </div>
        </div>
        <div className='button'> <Button type="primary" size='large' onClick={this.determine} >确定 </Button></div>
      </div>
    )
  }
}

export default AddDownReason;