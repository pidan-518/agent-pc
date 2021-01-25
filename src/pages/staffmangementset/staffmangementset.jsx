import React from "react";
import "./staffmangementset.less";
import "../../common/globalstyle.less";
import { Button, Modal,message } from "antd";
import { Link } from 'react-router-dom';
import { AgentpcLink, AgentpcRoute} from "../../components/AgentpcRouter/AgentpcRouter";
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'
class StaffMangementSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false, //是否显示删除模态框
      isModifyModal: false,//是否显示修改模态框
      list: [],//原因列表
      selection:{},//选中内容

      handleOkModifybtn:true
    }
  }
  componentDidMount() {
    document.title = "基础设置"
    // window.location.reload(true)
    this.postList()
  }
  //------------------删除模块-----------------
  //删除按钮
  cencelClick = (e,index) => {
    this.setState({
      isModalVisible: true,
      selection:e
    })
  };
  //弹框确定按钮
  handleOk = (e) => {
    console.log('确定')
    post(servicePath.delete, { downgradeId: this.state.selection.downgradeId })
      .then(response => {
       
        if(response.data.code!==0){
          this.setState({
            isModalVisible: false,
            selection:{}
          },()=>{message.warning(`${response.data.msg}`, 2);this.postList()});
        }else{
          this.setState({
            isModalVisible: false,
            selection:{}
          },()=>{message.success(`${response.data.msg}`, 2);this.postList()});
        }
      })
  };
  //弹框取消按钮
  handleCancel = () => {
    this.setState({
      isModalVisible: false,
      selection:{}
    });
    console.log('取消')
  };
  //------------------修改模块--------------
  //修改按钮
  modifyClick = (e,index) => {
    
    this.setState({
      isModifyModal: true,
      selection:e
    })
  // this.contentReason = e.contentReason
  }
  content=(event)=>{
    console.log(event.target.value)
     let contentReason = event.target.value
    console.log(this.state.selection)
    this.setState((prev)=>{
        return { selection:{...prev.selection,contentReason : contentReason}}
    })
  }
  //弹框确定按钮
  handleOkModify = () => {
    if(this.state.handleOkModifybtn){
      post(servicePath.update, { contentReason: this.agent.value, downgradeId: this.state.selection.downgradeId })
      .then(response => {
        if(response.data.code === 0){
          this.setState({
            isModifyModal: false,
            selection:{},
            handleOkModifybtn:true
          },()=>{message.success(`${response.data.msg}`, 3);this.postList()});
        }else{
            this.setState({
              isModifyModal: false,
              selection:{},
              handleOkModifybtn:true
            },()=>{message.warning(`${response.data.msg}`, 3);this.postList()});
        }      
        console.log(response) 
      })
      // console.log('确定修改', this.agent.value)
    }else{
      console.log('重复点击')
    }
  }
  //弹框取消
  handleCancelModify = () => {
    this.setState({
      isModifyModal: false,
      selection:{}
    });
    console.log('取消修改',this.agent.value = '')
  }
  // onModifyReasonInput = (e) => { console.log(e, '111') }



  //请求列表
  postList = () => {
    post(servicePath.selectList,
      {}
    )
      .then(response => {
        if(response.data.code == 0){
          this.setState({ list: response.data.data,})
        }else{
          message.warning(response.data.msg)
        }    
      })
  }
  render() {
    return (
      <div className='basicSettings'>
        <div className='title'>降级原因</div>
        <div className='addDownReason'><Button type="primary" size='large' > <AgentpcLink to='/index/adddownreason/'> 添加降级原因</AgentpcLink> </Button></div>

        {/* <ul>
            {list.map((item, idx) => {
              return <li key={item} >
                <p className='listItem'>{item.contentReason}</p>
                <View className='itemRight'>
                  <span onClick={() => this.cencelclick(idx)}><img src={dele} /></span>
                  <span onClick={() => this.addclick(idx)}> <img src={evaluate} /></span>
                </View>
              </li>
            })}
          </ul> */}
        {this.state.list.map((item, index) => {
          return <div className='reason' key={index}>
            <div className='reasonItem'>
              <span className='reasonContext'>{item.contentReason}</span>
              {/* <span className='colon'>:</span> */}
              <span className='cancel' onClick={()=>{this.cencelClick(item,index)}}><span> <img src={require('../../static/staffmangementset/delete.png')} alt="" /> </span>&nbsp;删除</span>
              <span className='modify' onClick={()=>{this.modifyClick(item,index)}}><span> <img src={require('../../static/staffmangementset/evaluate.png')} alt="" /> </span>&nbsp;修改</span>
            </div>
          </div>
        })
        }
        <Modal
          title="Basic Modal"
          okText="确认"
          cancelText="取消"
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>“{this.state.selection.contentReason}”删除后，该条件下代理人降级条件将会发生变动，您确定删除该条件吗？</p>
        </Modal>
        <Modal
          title="修改原因"
          okText="确认"
          cancelText="取消"
          visible={this.state.isModifyModal}
          onOk={this.handleOkModify}
          onCancel={this.handleCancelModify}
          className='staffModal'
        >
          {/* <Input defaultValue='连续两个月不达营业额' className='input'  type="text"
          // style={{borderTop:'none',borderLeft:'none',borderRight:'none'}}
          onChange={(e)=>this.onModifyReasonInput(e)}
          /> */}
          <div className='inputBox'>
            <input type="text" value ={this.state.selection.contentReason} onChange={this.content} className='inputReason' ref={el => this.agent = el} />
          </div>
        </Modal>
      </div>
    )
  }
}

export default StaffMangementSet;