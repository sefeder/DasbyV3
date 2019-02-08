import config from "../config.json";
import { inspect } from 'util';

export default {
    createUser: newUser => {
       return fetch(`${config.apiUrl}/database/users/createNewUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
    },
    getAllUsers: () => {
        return fetch(`${config.apiUrl}/database/users/get-all-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    },
    logIn: userInfo => {
       return fetch(`${config.apiUrl}/database/users/logIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(userInfo)
        })
            .then(res => res.json())
    },
    getAdmin: () => {
        return fetch(`${config.apiUrl}/database/users/get-admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    },
    getUser: userUpi => {
        return fetch(`${config.apiUrl}/database/users/get-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ upi: userUpi })
        })
            .then(res => res.json())
    },
    getDasbyUpi: () => {
        return fetch(`${config.apiUrl}/database/users/get-dasby-upi`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
            .then(res => res.json())
    },
    getCatmhSurvey: (surveyType, userUpi) => {
        return fetch(`${config.apiUrl}/services/get-catmh-survey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(
                {
                    surveyType: surveyType,
                    userUpi: userUpi 
                }
            )
        })
            .then(res => res.json())
    },
    getNextQuestion: (userUpi, choice, currentQuestion) => {
        return fetch(`${config.apiUrl}/services/get-next-question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(
                {
                    userUpi: userUpi,
                    choice: choice,
                    currentQuestion: currentQuestion 
                }
            )
        })
            .then(res => res.json())
    },
    dasbyRead: (channelSid, chapter, section, block) => {
        return fetch(`${config.apiUrl}/dasby/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(
                {
                    channelSid: channelSid,
                    chapter: chapter,
                    section: section,
                    block: block 
                }
            )
        })
    },
    getResults: (upi, testType) => {
        return fetch(`${config.apiUrl}/database/results/get-all-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(
                {
                    upi: upi,
                    testType: testType,
                }
            )
        })
            .then(res => res.json())
    },
} 