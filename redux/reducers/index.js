import { STORE_USER_INFO } from "../action-types";
const initialState = {
    user: {}
};
function rootReducer(state, action) {
    if (typeof state === undefined){
        return initialState
    }
    switch (action.type) {
        case STORE_USER_INFO:
            return Object.assign({}, state, {
                user: action.userInfo
            });
        // case: STORE_TWILIO_TOKEN:
        // case:    
        default:
            return state
    }

}
export default rootReducer;