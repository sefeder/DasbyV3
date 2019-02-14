import { STORE_USER_INFO, STORE_DASBY_UPI, STORE_USER_PRIVATE_KEY, STORE_TWILIO_TOKEN, STORE_SELECTED_PATIENT_UPI, STORE_SELECTED_PATIENT_CHAT } from "../action-types";
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
export function storeTwilioToken(twilioToken) {
    return { type: STORE_TWILIO_TOKEN, twilioToken };
}
export function storeSelectedPatientUpi(selectedPatientUpi) {
    return { type: STORE_SELECTED_PATIENT_UPI, selectedPatientUpi };
}
export function storeSelectedPatientChat(selectedPatientChat) {
    return { type: STORE_SELECTED_PATIENT_CHAT, selectedPatientChat };
}