import { STORE_USER_INFO, STORE_DASBY_UPI, STORE_USER_PRIVATE_KEY, STORE_CHAT_CLIENT, STORE_PATIENT_DATA, STORE_CURRENT_SELECTED_PATIENT_UPI} from "../action-types";

const initialState = {
    user: {},
    storedPatientData: {}
};

 mainReducer = (state, action) => {
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
        case STORE_CURRENT_SELECTED_PATIENT_UPI:
            return Object.assign({}, state, {
                currentSelectedPatientUpi: action.currentSelectedPatientUpi
            });
        case STORE_PATIENT_DATA:
            let newState = state;
            newState.storedPatientData[action.selectedPatientData.selectedPatientUpi] = action.selectedPatientData
            return newState;
        default:
            return initialState
    }

}


export default mainReducer;