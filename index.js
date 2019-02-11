import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import MessageQue from "react-native/Libraries/BatchedBridge/MessageQueue.js";
AppRegistry.registerComponent(appName, () => App);
// to inspect the JS native bridge
// const spyFunction = (msg) => {
//     console.log(msg);
// }
// MessageQue.spy(spyFunction);