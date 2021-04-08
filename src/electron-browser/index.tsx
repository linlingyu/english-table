import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./app";
// 
ReactDOM.render(<App/>, document.body);
if (module.hot) { // require @types/webpack-env
    module.hot.accept();
}