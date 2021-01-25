import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.less';
import Main from "./router/router";
import * as serviceWorker from './serviceWorker';

//移动端重定向
var isAndroid = (/android/gi).test(navigator.appVersion);
var isIPadDevice = (/ipad/gi).test(navigator.appVersion);
var isIDevice = (/iphone/gi).test(navigator.appVersion);
var isPlaybook = (/playbook/gi).test(navigator.appVersion);
var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
var isWindowsPhone = (/windows phone/gi).test(navigator.appVersion);
var isHasLinux = (/linux/gi).test(navigator.appVersion);
var isGecko = (/gecko/gi).test(navigator.appVersion);
if (isAndroid || isIDevice || isWindowsPhone || (isHasLinux && isGecko)) {
  window.location.href = 'https://' + document.domain + '/h5';
} 
//PC端
else {
  ReactDOM.render(<Main />, document.getElementById('root'));
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.unregister();