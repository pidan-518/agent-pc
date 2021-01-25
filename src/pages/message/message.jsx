import React from "react";
import { Modal,Pagination } from 'antd';
import "./message.less";
import "../../common/globalstyle.less";
import { post } from '../../common/util/axios';
import servicePath from '../../common/util/api/apiUrl';
import GlobalContext from '../../common/util/globalContext';


class Message extends React.Component {
  state = {
    messageList:[],
    length: 10,
    total: '',
    current:1,
  };
  componentDidMount() {
    document.title = "IST - 消息记录"
    this.getagentMessageAdminList(1)
  }
  getselectMore=(e)=>{
    console.log(e);
  }
  getagentMessageAdminList(current){
    post(servicePath.getagentMessageAdminList,{len:this.state.length,current})
    .then(res=>{
      console.log('消息列表',res);
      this.setState({
        messageList: res.data.data.records,
        current:res.data.data.current,
        total:res.data.data.total,
      })
      console.log('222',this.state.messageList);
    })
    .catch(err=>{
      console.log('消息列表接口异常--',err);
    })
  }
  getagentMessageStatus(messageId) {
    post(servicePath.getagentMessageStatus,{messageId})
    .then(res=>{
      console.log('更新消息',res);
      
    })
    .catch(err=>{
      console.log('消息列表接口异常--',err);
    })
  }
  getShowModal=(e, index, updater)=> {
    console.log('eeee',e);
    Modal.success({
      icon:'',
      title:e.title,
      content: (
        <div>
          <p className='content-message'>{e.content}</p>
          <p className='time-message'>{e.createTime}</p>
        </div>
      ),
      onOk:()=> {
        console.log('succ');
        const newArr = this.state.messageList
          newArr[index].readState = 1
          this.setState({
            messageList: newArr
          })
          this.getagentMessageStatus(e.messageId)
          updater();
      },
    });
  }
  onChange=(e)=>{
    console.log('radio checked', e);
    this.setState({
      current:e,
    },()=>{
      this.getagentMessageAdminList(e)
    })
  }
  onShowSizeChange=(e,size)=>{
    console.log('onShowSizeChange', e,size);
    this.setState({
      length:size,
    })
  }
  render() {
    const {messageList,total,length,current} = this.state
    return (
      <GlobalContext.Consumer>
        {({ updateUnreadMessage }) => (
          <div className='message'>
            <div className='title'>系统消息列表</div>
            {
              messageList.map((item,index)=>{
                return <div key={item.messageId} className={item.readState===0?'list':'list on'} onClick={this.getShowModal.bind(this,item,index, updateUnreadMessage)}>
                {item.content}
                <div className='time'>{item.createTime}</div>
                </div>
              })
            }
            
            <Pagination
              total={total}
              current={current}
              showSizeChanger
              showQuickJumper
              showTotal={total => `每页${length}条，共${total}条记录`}
              onChange={this.onChange}
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>
        )}
      </GlobalContext.Consumer>
    )
  }
}

export default Message;