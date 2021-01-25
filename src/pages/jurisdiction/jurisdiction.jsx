import React from "react";
import "./jurisdiction.less";
import "../../common/globalstyle.less";
import { Button, message, Tree } from 'antd';
import servicePath from '../../common/util/api/apiUrl'
import { post} from '../../common/util/axios'



class Jurisdiction extends React.Component {
  state = {
    userId:this.props.match.params.id,
    expandedKeys:'',
    checkedKeys:'',
    // defaultChecked:'',
    selectedKeys:'',
    autoExpandParent:true,
    treeData :[],
    halfCheckedKeys:[],//半勾选
    defaultChecked:null//默认为true的选项
  }

  componentDidMount() {
    document.title = "IST - 权限"
    post(servicePath.privateRoleMenuTreeData + this.state.userId,{}
    )
      .then(response => {
        const data = response.data.data;
        let expandedKeysAll = []
        let defaultChecked = []
        data.map((item)=>{
              item.key=item.id             
              expandedKeysAll.push(item.id)           
              if(item.checked){
                defaultChecked.push(item.id)
                // console.log(item,'item.checked')
              }
        })      
        this.setState({
          defaultChecked 
        },()=>{console.log(this.state.defaultChecked,'defaultChecked')})  
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
        // console.log(leve3,'leve3')   
        this.setState({ treeData:treeList,expandedKeys:expandedKeysAll,checkedKeys:leve3});
      })

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
      
  };

  Demo = () => {        
    const onExpand = (expandedKeys) => {
      console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.setState({
        expandedKeys,
        autoExpandParent:false
      })       
    };     
    const onCheck = (checkedKeys, e) => {
      // console.log('onCheck',e.halfCheckedKeys, checkedKeys);
      this.setState({
        checkedKeys,
        halfCheckedKeys:e.halfCheckedKeys,
         defaultChecked:checkedKeys
      })
    }; 
    // function(checkedKeys, e:{checked: bool, checkedNodes, node, event, halfCheckedKeys})
    // const onSelect = (selectedKeys, info) => {
    //   console.log('onSelect', info);
    //   this.setState({
    //     selectedKeys
    //   })
    // };

    if(this.state.treeData){
      // console.log(this.state.treeData)
      return (
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={this.state.expandedKeys}
          // autoExpandParent={true}
          onCheck={onCheck}
          checkedKeys={this.state.checkedKeys}
          // onSelect={onSelect}
          // selectedKeys={selectedKeys}
          blockNode={true}
          treeData={this.state.treeData}
          defaultExpandAll
        />
      );        
    }
  };

  //提交
  onSubmit = () => {
    // console.log(this.state.checkedKeys.toString().split(","),Array.from(new Set([...this.state.checkedKeys,...this.state.leve1,...this.state.leve2])),'ooooooooo')
    // let menuId = Array.from(new Set([...this.state.checkedKeys,...this.state.leve1,...this.state.leve2]))
    let menuId = [...this.state.halfCheckedKeys , ...this.state.defaultChecked]
    // console.log(menuId.toString().split(","),'.toString().split(",")')
    post(servicePath.updateMenus, {
      userId:this.state.userId,
      menuIds:menuId.toString().split(",")
    })
      .then(response => {
        console.log(response,',,,,,')
        if(response.data.code === 0){
          message.success(response.data.msg)
          setTimeout(() => {
            window.history.back(-1)
          }, 2000);  
        }else{
          message.warning(response.data.msg)
        }
     
       })
  }
  render() {
    return (
      <div className='addRole'>
        <h2 className='title'>管理及权限</h2>
        <div className='roleName'>
          <div>角色名称： {this.props.match.params.name}</div>
          {/* <div>
            <Input onBlur={this.onBlur} size='small' />
            </div> */}
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

export default Jurisdiction;