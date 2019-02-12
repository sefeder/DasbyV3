import { AppRegistry } from "react-native";
import React from "react";
import App from "./App";
import { name as appName } from "./app.json";
import MessageQue from "react-native/Libraries/BatchedBridge/MessageQueue.js";

import { Provider } from 'react-redux';
import configureStore from './redux/store';

const store = configureStore()

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);


// to inspect the JS native bridge
// const spyFunction = (msg) => {
//     console.log(msg);
// }
// MessageQue.spy(spyFunction);