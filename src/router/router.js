import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "../page/Home";
import Login from "../pages/login/login";

class Main extends Component {
  componentDidMount() {}

  render() {
    const pathConstants = process.env.pathConstants;
    return (
      <Fragment>
        <Router>
          <Switch>
            <Route exact path={`${pathConstants}/`} component={Login}></Route>
            <Route path={`${pathConstants}/index`} component={Home}></Route>
            <Redirect to={`${pathConstants}/`} />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default Main;
