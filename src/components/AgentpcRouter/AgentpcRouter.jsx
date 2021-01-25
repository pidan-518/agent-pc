import React from "react";
import { Link, Route, Redirect } from "react-router-dom";


// 跳转路径拼接pathConstants（项目布署路径）
class AgentpcLink extends React.Component {
  componentDidMount() {}
  render() {
    return(
      <Link 
        to={`${process.env.pathConstants}${this.props.to}`} 
        target={this.props.target}
      >
        {this.props.children}
      </Link>
    )
  }
}

// 路由路径拼接pathConstants（项目布署路径）
class AgentpcRoute extends React.Component {
  componentDidMount() {}
  render() {
    return(
      <Route 
        path={`${process.env.pathConstants}${this.props.path}`} 
        component={this.props.component} 
        exact={this.props.exact}
      >
        {this.props.children}
      </Route>
    )
  }
}

// 重定向路径拼接pathConstants（项目布署路径）
class AgentpcRedirect extends React.Component {
  componentDidMount() {}
  render() {
    return(
      <Redirect to={`${process.env.pathConstants}${this.props.to}`}>
        {this.props.children}
      </Redirect>
    )
  }
}


export { AgentpcLink, AgentpcRoute, AgentpcRedirect };