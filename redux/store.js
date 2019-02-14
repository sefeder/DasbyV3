import { createStore, combineReducers } from 'redux';
import rootReducer from './reducers';
import {persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web, AsyncStorage if react-native

const config = {
    key: 'primary',
    storage
}
const rootPersistReducer = persistCombineReducers(config, {
    rootReducer
});


const configureStore = () => {
    return createStore(rootPersistReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}
export default configureStore;