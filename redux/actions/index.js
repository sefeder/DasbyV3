import { STORE_USER_INFO, STORE_DASBY_UPI, STORE_USER_PRIVATE_KEY, STORE_CHAT_CLIENT, CLEAR_STORE, STORE_PATIENT_DATA, STORE_CURRENT_SELECTED_PATIENT_UPI } from "../action-types";
//below is an action creator
export function storeUserInfo(userInfo) {
    return { type: STORE_USER_INFO, userInfo };
}
export function storeDasbyUpi(dasbyUpi) {
    return { type: STORE_DASBY_UPI, dasbyUpi };
}
export function storeUserPrivateKey(userPrivateKey) {
    return { type: STORE_USER_PRIVATE_KEY, userPrivateKey };
}
export function storeChatClient(chatClient) {
    return { type: STORE_CHAT_CLIENT, chatClient };
}
export function storePatientData(selectedPatientData) {
    return { type: STORE_PATIENT_DATA, selectedPatientData };
}
export function storeCurrentSelectedPatientUpi(currentSelectedPatientUpi) {
    return { type: STORE_CURRENT_SELECTED_PATIENT_UPI, currentSelectedPatientUpi };
}
export function clearStore() {
    return { type: CLEAR_STORE };
}