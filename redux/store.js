import { createStore, combineReducers } from 'redux';
import rootReducer from './reducers';

// const rootReducer = combineReducers({

// });

const configureStore = () => {
    return createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

export default configureStore;