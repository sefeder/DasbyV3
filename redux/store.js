import { createStore, combineReducers } from 'redux';
import mainReducer from './reducers';
import {CLEAR_STORE} from './action-types'
import {persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web, AsyncStorage if react-native

const config = {
    key: 'primary',
    storage
}
const appReducer = persistCombineReducers(config, {mainReducer: mainReducer} );

const rootReducer = (state, action) => {
    if (action.type === CLEAR_STORE){
        Object.keys(state).forEach(key => {
            storage.removeItem(`persist:${key}`);
        });
        state = undefined;
    }
    return appReducer(state, action);
}


const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;