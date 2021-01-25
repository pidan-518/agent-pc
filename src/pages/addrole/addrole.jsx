import React from "react";
import "./addrole.less";
import "../../common/globalstyle.less";

import { Input, Button, message, Tree } from 'antd';
// import Checkbox from './Checkbox'
import servicePath from '../../common/util/api/apiUrl'
import { post } from '../../common/util/axios'




class AddRole extends React.Component {
  state = {
    userId: this.props.match.params.id,
    expandedKeys: '',
    checkedKeys: {},
    selectedKeys: '',
    autoExpandParent: true,
    treeData: [],
    halfCheckedKeys:[],//半勾选
    roleId: this.props.match.params.name ==='null' ? null:this.props.match.params.name,
    defaultChecked:null//默认为true的选项
  }

  componentWillMount() {
    document.title = "IST - 添加角色权限"
    let url = null
    if(this.props.match.params.id !== 'null'){
      url = servicePath.publicRoleMenuTreeData+this.props.match.params.id
    }else{
      url = servicePath.menuTreeData
    }
    post(url,{})
      .then(response => {
        const data = response.data.data;
        let defaultChecked = []
        let expandedKeysAll = []
        data.map((item) => {
          item.key = item.id
          expandedKeysAll.push(item.id)
          if (item.checked) {
            defaultChecked.push(item.id)
            // console.log(item, 'item.checked')
          }
        })
        this.setState({
          defaultChecked 
        })

        const nodeMap = new Map(), treeList = [];

        for (const node of data) {
          node.children = node.children || [];
          nodeMap.set(node.id, node);
        }

        for (const node of data) {
          const parent = nodeMap.get(node.pId);
          (parent ? parent.children : treeList).push(node);
        }


        let leve3 = []
        treeList.map((item)=>{
            item.children.map((item2)=>{
              item2.children.map((item3)=>{
                if(item3.checked){
                  leve3.push(item3.id)
                }
              })
            })
        })  
        this.setState({ treeData: treeList, expandedKeys: expandedKeysAll, checkedKeys: leve3 });
      })
  };

  componentDidMount() {
    setTimeout(() => {
      const treeList = document.querySelector('.ant-tree-list');
      const treeNodes = treeList.querySelectorAll('.ant-tree-treenode');

      for (let i = 0, len = treeNodes.length; i < len; i++) {
        const current = treeNodes[i];
        const indentLength = current.children[0].children.length;

        switch (true) {
          case indentLength === 0:
            current.style.cssText = 'border-bottom: 1px solid #6465667e';
            current.style.marginTop = '30px';
            // current.style.marginBackground='yellow'
            break;

          case indentLength === 1:
            // current.style.cssText = 'border-bottom: 1px solid #000';
            // current.children[2].style.display = 'none';
            break;

          case indentLength === 2:
            current.style.display = 'inline-flex';
            break;
        }
      }
    }, 200);

   
  }

  Demo = () => {
    const onExpand = (expandedKeys) => {
      console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.setState({
        expandedKeys,
        autoExpandParent: false
      })
    };
    const onCheck = (checkedKeys,e) => {
      console.log('onCheck', checkedKeys);
      this.setState({
        checkedKeys,
        halfCheckedKeys:e.halfCheckedKeys,
        defaultChecked:checkedKeys
      })
    };
    // const onSelect = (selectedKeys, info) => {
    //   console.log('onSelect', info);
    //   this.setState({
    //     selectedKeys
    //   })
    // };
const onLoad  = (loadedKeys, {event, node})=>{
  console.log(loadedKeys,event,node,'ljkjohuj')
}
    if (this.state.treeData) {
      console.log(this.state.treeData)
      return (
        <Tree
          checkable
          // onExpand={onExpand}
          expandedKeys={this.state.expandedKeys}
          // autoExpandParent={true}
          onCheck={onCheck}
          checkedKeys={this.state.checkedKeys}
          // onSelect={onSelect}
          // selectedKeys={selectedKeys}
          blockNode={true}
          treeData={this.state.treeData}
          defaultExpandAll
          onLoad={onLoad}
          // checkStrictly={true}
        />
      );
    }

  };
  onBlur = (e) => {
    // if (e.target.value === '' || e.target.value === null) {
    //   message.warning('角色名称不能为空')
    //   if(e.target.value.indexOf(' ') !==-1 ){
    //     message.warning('角色名称存在空格') 
    //   }
    // }  
      this.setState({
        roleId: e.target.value
      }) 
  }
  onChange=(e)=>{
    let  reg = /\s/;
   console.log(reg.test(e.target.value),'ooooo',e.target.value)  
   if(reg.test(e.target.value) ){
    message.warning('角色名称不能存在空格')
   }
  }
  //提交
  onSubmit = () => {
    if (this.state.roleId === '' || this.state.roleId === null) {
      message.warning('角色名称不能为空')
      return
    }
    if(this.state.roleId.indexOf(' ') !== -1 ){
      message.warning('角色名称存在空格') 
      return
    }
    // let data = []
    // for (var i in this.group) {
    //   data.push(...this.group[i])
    //   //  console.log(this.group[i])
    // }
    // console.log(data)
 
    console.log(this.props.match.params.id,'this.props.match.params.id')
    if(this.props.match.params.id == 'null'){
     this.roleinsert()
    console.log('roleinsert')
    }else{
     this.roleupdate()
     console.log('roleupdate')
    } 
    // this.setState(prevState => {
    //   const prevCheckedList = [...prevState.data ,...fore];
    //   console.log(prevCheckedList,'text')
    //   return {
    //     data:prevCheckedList,
    //   };},()=>{console.log(this.state.data)});

  }
  //新增数据角色
  roleinsert=()=>{
    post(servicePath.roleinsert, {
      roleName: this.state.roleId,
      menuIds: [...this.state.checkedKeys,...this.state.halfCheckedKeys].toString().split(",")
    })
      .then(response => {
        // console.log(response, ',,,,,')     
        if(response.data.code == 0){
          message.success(response.data.msg);
          setTimeout(() => {
            window.history.back(-1)
          }, 2000); 
        }else{
          message.error(response.data.msg);
          // setTimeout(() => {
            // window.location.reload()           
          // }, 2000);     
        }      
      })
  }
  //修改数据角色
  roleupdate=()=>{
    console.log(this.state.checkedKeys.length)
    if(!this.state.checkedKeys.length){
      post(servicePath.roleupdate, {
        roleId:this.props.match.params.id,
        roleName: this.state.roleId == this.props.match.params.name ? null :this.state.roleId,
        menuIds: null
      })
        .then(response => {
          console.log(response, ',,,,,')
          message.success(response.data.msg);
          setTimeout(() => {
            window.history.back(-1)
          }, 2000);   
        })
    }else{
      post(servicePath.roleupdate, {
        roleId:this.props.match.params.id,
        roleName: this.state.roleId == this.props.match.params.name ? null :this.state.roleId,
        menuIds: [...this.state.defaultChecked,...this.state.halfCheckedKeys].toString().split(",")
      })
        .then(response => {
          console.log(response, ',,,,,')
          if(response.data.code == 0){
            message.success(response.data.msg);
            setTimeout(() => {
              window.history.back(-1)
            }, 2000); 
          }else{
            message.error(response.data.msg);
            // setTimeout(() => {
              // window.location.reload()           
            // }, 2000);     
          }      
        })
    }
 }
 
  render() {
    return (
      <div className='addRole'>
        <h2 className='title'>管理权限-添加权限角色</h2>
        <div className='roleName'>
          <div>角色名称：</div>
          <div><Input onBlur={this.onBlur} onChange={this.onChange} defaultValue={this.state.roleId} size='small' maxLength={32} /></div>
        </div>
        <div className='checkPower'>
          {this.Demo()}

          {/* <Demo /> */}

        </div >
        <div className='btn'>
          <Button className='btn' type="primary" onClick={this.onSubmit} >确定</Button>
        </div>
      </div >
    )
  }
}

export default AddRole;