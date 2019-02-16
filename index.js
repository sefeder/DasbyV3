import { AppRegistry, YellowBox } from "react-native";
import React from "react";
import App from "./App";
import { name as appName } from "./app.json";
import MessageQue from "react-native/Libraries/BatchedBridge/MessageQueue.js";
import { persistStore } from 'redux-persist';
import { Provider } from 'react-redux';
import configureStore from './redux/store';
import LoadingScreen from "./screens/LoadingScreen";
import {PersistGate} from "redux-persist/lib/integration/react"

const store = configureStore()
const persistor = persistStore(
    store,
    null,
    () => {
        store.getState() // if you want to get restoredState
    }
)

const RNRedux = () => (
    <Provider store={store}>
        <PersistGate loading={<LoadingScreen/>} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);


// to inspect the JS native bridge
// const spyFunction = (msg) => {
//     console.log(msg);
// }
// MessageQue.spy(spyFunction);