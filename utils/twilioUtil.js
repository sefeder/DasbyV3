const Chat = require('twilio-chat')

import { resolve } from 'url';
import config from "../config.json";

createChannel = (chatClient, userUpi) => {
    const channelName = userUpi;
    return new Promise((resolve,reject) => {
                chatClient
                    .createChannel({
                        uniqueName: channelName, 
                        friendlyName: channelName
                    })
                    .then(channel => {
                        console.log('newly created channel: ', channel)
                        resolve(channel)
                    })
                    .catch(err => console.log(err))  
    })
}

getTwilioToken = upi => { 
    console.log("hitting getTwilioToken")
    return new Promise((resolve, reject) => {
        console.log("inside getTwilioToken -- just before fetch. config.apiUrl:", config.apiUrl)
        fetch(`${config.apiUrl}/services/get-twilio-jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ identity: upi })
        })
        .then(res => res.json())
        .then((token) => {
            resolve(token)
        })
        .catch(() => {
            reject(Error("Failed to connect."))
        })
    })
}

createChatClient = token => {
    return new Promise((resolve, reject) => {
        resolve(Chat.Client.create(token.jwt))
    })
}

findChannel = (chatClient, channelName) => {
    return new Promise((resolve, reject) => {
        chatClient.getChannelByUniqueName(channelName)
        .then(channel => {
            console.log('newly found channel: ', channel)
            resolve(channel)
        })
    })
}

joinChannel = channel => {
    console.log('joinChannel is hitting')
    return channel.join()
    
}

getAllChannels = chatClient => {
    return new Promise((resolve, reject) => {
        resolve(chatClient.getUserChannelDescriptors()) 
    })
}

//--------------------------Comment Out to Create Admin---------------------------------
addAdminToChannel = userUpi => {
    return new Promise((resolve, reject) => {
    // adminUpi is hardcoded for now - will need to find way of doing this progromatically in future and added as parameter to function above
    getTwilioToken("OE08fM64qx")
        .then(createChatClient)
        .then(adminChatClient => {
            findChannel(adminChatClient, userUpi)
            .then(joinChannel)
            .then(channel => {
                console.log('admin successfully joined channel')
                resolve(channel)
            })
        })
    })
}
//--------------------------Comment Out to Create Admin---------------------------------
   

export default {
    createChannel: createChannel,
    getTwilioToken: getTwilioToken,
    createChatClient: createChatClient,
    joinChannel: joinChannel,
    getAllChannels: getAllChannels,
    addAdminToChannel: addAdminToChannel,
    findChannel: findChannel,
}