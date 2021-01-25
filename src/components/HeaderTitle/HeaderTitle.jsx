import PropsTypes from "prop-types";
import React, { Component } from "react";
import "./HeaderTitle.less";

import './HeaderTitle.less'

class HeaderTitle extends Component {
  render() {
    return (
      <div id="Title">
        <div className="header">
          <div className="icon"></div>
          <span className="headerName">{this.props.title}</span>
        </div>
      </div>
    );
  }
}

HeaderTitle.PropsTypes = {
  title: PropsTypes.string,
};

export default HeaderTitle;
