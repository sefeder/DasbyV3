import { STORE_USER_INFO } from "../action-types";
//below is an action creator
export function storeUserInfo(userInfo) {
    return { type: STORE_USER_INFO, userInfo };
}