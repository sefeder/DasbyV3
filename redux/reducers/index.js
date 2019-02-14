import { STORE_USER_INFO, STORE_DASBY_UPI, STORE_USER_PRIVATE_KEY, STORE_TWILIO_TOKEN, STORE_SELECTED_PATIENT_UPI, STORE_SELECTED_PATIENT_CHAT} from "../action-types";
const initialState = {
    user: {}
};
function rootReducer(state, action) {
    if (state === undefined){
        return initialState
    }
    switch (action.type) {
        case STORE_USER_INFO:
            return Object.assign({}, state, {
                user: action.userInfo
            });
        case STORE_DASBY_UPI:
            return Object.assign({}, state, {
                dasbyUpi: action.dasbyUpi
            });
        case STORE_USER_PRIVATE_KEY:
            return Object.assign({}, state, {
                userPrivateKey: action.userPrivateKey
            });
        case STORE_SELECTED_PATIENT_UPI:
            return Object.assign({}, state, {
                selectedPatientUpis: action.selectedPatientUpi
            });
        case STORE_SELECTED_PATIENT_CHAT:
            return Object.assign({}, state, {
                selectedPatientChats: action.selectedPatientChat
            });
        case STORE_TWILIO_TOKEN:
            return Object.assign({}, state, {
                twilioToken: action.twilioToken
            });
        // case:    
        default:
            return state
    }

}
export default rootReducer;