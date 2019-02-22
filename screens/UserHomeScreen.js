import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { storeUserInfo, storeDasbyUpi, storeUserPrivateKey } from "../redux/actions";
import twilio from '../utils/twilioUtil';
import { VirgilCrypto } from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';
import QuickReply from '../components/QuickReply';
import Spinner from 'react-native-loading-spinner-overlay';
import MenuBar from '../components/MenuBar';

const virgilCrypto = new VirgilCrypto();

function mapDispatchToProps(dispatch) {
    return {
        storeUserInfo: info => dispatch(storeUserInfo(info)),
        storeDasbyUpi: dasbyUpi => dispatch(storeDasbyUpi(dasbyUpi)),
        storeUserPrivateKey: userPrivateKey => dispatch(storeUserPrivateKey(userPrivateKey))
    };
}

function mapStateToProps(reduxState) {
    return {
        dasbyUpi: reduxState.mainReducer.dasbyUpi,
        user: reduxState.mainReducer.user,
        userPrivateKey: reduxState.mainReducer.userPrivateKey,
        storedMessages: reduxState.mainReducer.user.messages,
        storedMemberArray: reduxState.mainReducer.user.memberArray
    };
}

class ConnectedUserHomeScreen extends Component {

    state = {
        channel: null,
        userPrivateKey: null,
        messages: [],
        memberArray: [],
        responseArray: [],
        isTyping: false,
        memberTyping: null,
        isQrVisible: true,
        spinnerVisible: true,
        newestStoredMessageIndex: 0,
        channelPrivateKey: null,
        importedPublicKey: null
    }

    componentDidMount() {

        const startTime = Date.now();
        console.log("----------------------------------------------------------")
        console.log("hitting compoenentDidMount at: ", (Date.now()-startTime)/1000)
        console.log("-------props----------")
        console.log(this.props)

        AsyncStorage.getItem('responses', (err, responses) => {
            if (responses !== null) {
                this.setState({ responseArray: JSON.parse(responses).responseArray, isQrVisible: JSON.parse(responses).isQrVisible}) 
            } 
        })

        twilio.getTwilioToken(this.props.user.upi)
        .then(twilio.createChatClient)
        .then(chatClient => {
            console.log("Twilio Chat Client Recieved: ", (Date.now() - startTime) / 1000)
            //chatClient.on('tokenExpired', )
            if (this.props.user.newUser) {
                api.getAdmin()
                    .then(result => {
                        
                        const adminUpiArray = result.admin.map(admin => admin.upi)
                        return twilio.createChannel(chatClient, this.props.user.upi, adminUpiArray)
                            .then(twilio.joinChannel)
                            .then(channel => {
                                console.log("New Twilio Channel Created and Joined Retrieved: ", (Date.now() - startTime) / 1000)
                                const channelPrivateKeyBytes = channel.attributes.privateKey;
                                const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.props.userPrivateKey)
                                const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
                                const importedPublicKey = virgilCrypto.importPublicKey(channel.attributes.publicKey);
                                this.setState({ channel, channelPrivateKey, importedPublicKey })
                                console.log("channel: ", channel)
                                for (let i = 0; i < adminUpiArray.length; i++){
                                    console.log("for loop, i=", i)
                                    channel.add(adminUpiArray[i])
                                    .then(() => {
                                            if (i === adminUpiArray.length-1){
                                                this.getChannelMembers(channel)
                                                this.setState({ spinnerVisible: false })
                                                api.dasbyRead(channel.sid, "0", 0, 0)
                                            }
                                        }
                                    )
                                }
                                this.configureChannelEvents(channel)
                            })
                    })

            }
            else {
                // get messages from asn
                // if not null --> use/ set messages to state
                // AsyncStorage.multiGet(['messages', 'memberArray'], (err, dataAsync) => {
                //     const storedMessages = JSON.parse(dataAsync[0][1]);
                //     const storedMemberArray = JSON.parse(dataAsync[1][1]);
                //     console.log('dataAsync: ', dataAsync)
                //     console.log('messages: ', storedMessages)
                //     console.log('memberArray: ', storedMemberArray)
                //     if (err) {
                //         console.log('error getting messages from async: ', err)
                console.log("this.props.storedMessages: ", this.props.storedMessages)
                if (this.props.storedMessages) {
                    this.setState({ 
                        messages: this.props.storedMessages, 
                        memberArray: this.props.storedMemberArray,
                        newestStoredMessageIndex: this.props.storedMessages[this.props.storedMessages.length - 1].index
                    })
                }
                if(this.props.storedMessages&&this.props.storedMemberArray){
                    this.setState({
                        spinnerVisible: false
                    })
                }
                    
                return twilio.findChannel(chatClient, this.props.user.upi)
                .then(channel => {
                    console.log("Twilio Channel Found: ", (Date.now() - startTime) / 1000)
                    const channelPrivateKeyBytes = channel.attributes.privateKey;
                    console.log("this.props.userPrivateKey: ", this.props.userPrivateKey)
                    const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.props.userPrivateKey)
                    const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
                    const importedPublicKey = virgilCrypto.importPublicKey(channel.attributes.publicKey)
                    this.setState({ channel, channelPrivateKey, importedPublicKey })
                    this.configureChannelEvents(channel)
                    channel.getMessagesCount()
                        .then(channelMessageCount=>{
                        //  console.log("channelMessageCount inside: ", channelMessageCount)

// __________________everything below this line (to the ^^^^^) happens only if there are no stored messages_______________________
                            this.state.newestStoredMessageIndex === 0 ?
                            channel.getMessages(15)
                            .then(result => {
                                console.log("result: ", result)
                                console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                                console.log("----------------------------------------------------------------------------------------")
                                this.setState({
                                    messages: result.items.map((message, i, items) => {
                                        console.log("Messages Map Function - message #", i, " at: ", (Date.now() - startTime) / 1000)
                                        if (message.author === this.props.dasbyUpi) {
                                            return {
                                                author: message.author,
                                                body: this.parseDasbyPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.props.user.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                                index: message.index
                                            }
                                        } else {
                                            return {
                                                author: message.author,
                                                body: this.parseUserPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.props.user.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                                index: message.index
                                            }
                                        }
                                    })

                                }, () => {
                                    //  AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
                                    this.props.storeUserInfo({ ...this.props.user, messages: this.state.messages })
                                    console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                                    this.setState({
                                        spinnerVisible: false
                                    })
                                })
                                this.getChannelMembers(channel)
                            })
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                            :
// __________________everything below this line (to the ^^^^^) happens only if there are stored messages________________________
                            channel.getMessages(channelMessageCount - 1 - this.state.newestStoredMessageIndex, this.state.newestStoredMessageIndex + 1 , 'forward')
                            .then(result => {
                                console.log("result: ", result)
                                console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                                console.log("----------------------------------------------------------------------------------------")
                                result === undefined ?
        // ___________the next line (to the ####### happens only if there were no new messages in twilio_______________
                                this.setState({ messages: this.props.storedMessages, memberArray: this.props.storedMemberArray })
        //##############################################################################################################
                                :
        // __________everything below this line (to the ####) happens only if there were new messages in twilio__________
                                this.setState({
                                    messages: this.props.storedMessages.concat(result.items.map((message, i, items) => {
                                        console.log("Messages Map Function - message #", i, " at: ", (Date.now() - startTime) / 1000)
                                        if (message.author === this.props.dasbyUpi) {
                                            return {
                                                author: message.author,
                                                body: this.parseDasbyPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.props.user.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                                index: message.index
                                            }
                                        } else {
                                            return {
                                                author: message.author,
                                                body: this.parseUserPayloadData(this.decryptMessage(message.body)),
                                                me: message.author === this.props.user.upi,
                                                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                                index: message.index
                                            }
                                        }
                                    })),
                                 memberArray: this.props.storedMemberArray }, ()=> {
                                    //  AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
                                     this.props.storeUserInfo({...this.props.user, messages: this.state.messages})
                                     console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                                     this.setState({
                                         spinnerVisible: false
                                     })
                                 })
        //#############################################################################################################
                            })
                        })
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                })
            }
        })
    }

    getChannelMembers = (channel) => {
        channel.getMembers().then(result => {
            console.log('result: ', result)
            let newMemberArray = []
            for (let i = 0; i < result.length; i++) {
                api.getUser(result[i].identity)
                    .then(dbUser => {
                        newMemberArray.push({
                            upi: dbUser.user.upi,
                            firstName: dbUser.user.first_name,
                            lastName: dbUser.user.last_name
                        })
                        if (i === result.length - 1) {
                            this.setState({
                                memberArray: newMemberArray,
                            }, () => {
                                this.props.storeUserInfo({...this.props.user, memberArray: this.state.memberArray})
                                // AsyncStorage.setItem('memberArray', JSON.stringify(this.state.memberArray))
                            })
                        }
                    })
            }
        })
    }

    decryptMessage = (encrytpedMessage) => {
        const decryptStartTime = Date.now();
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, this.state.channelPrivateKey).toString('utf8')
        console.log("Message Decrypted: ", (Date.now() - decryptStartTime) / 1000)
        return decryptedMessage
    }

    canParseStr = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseDasbyPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (typeof payloadData === 'number') {
                const message = payloadData
                return message
            }
            if (payloadData.payload) {
                this.setState({
                    responseArray: payloadData.payload,
                    isQrVisible: true
                }, () => AsyncStorage.setItem('responses', JSON.stringify({responseArray: this.state.responseArray, isQrVisible: this.state.isQrVisible})))
            } else {
                this.setState({
                    responseArray: []
                }, () => AsyncStorage.setItem('responses', JSON.stringify({ responseArray: this.state.responseArray})))
            }
            if (payloadData.imageURL || payloadData.videoURL) {
                const message = payloadData
                return message
            } else {
                const message = payloadData.message
                return message
            }
            
        } else {
            const message = payloadDataString
            return message
        }
    }

    parseUserPayloadData = payloadDataString => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (typeof payloadData === 'number') {
                const message = payloadData
                return message
            }
            if (payloadData.imageURL || payloadData.videoURL) {
                const message = payloadData
                return message
            } else {
                const message = payloadData.message
                return message
            }
        } else {
            const message = payloadDataString
            return message
        }

    }
    // may not need undefined clause in ternary below
    addMessage = (message) => {
        const messageData = { ...message, me: message.author === this.props.user.upi, sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author, index: message.index }
        this.setState({
            messages: [...this.state.messages, messageData],
        }, () => {
            this.props.storeUserInfo({ ...this.props.user, messages: this.state.messages })
            // AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
        })
    }

    updateTypingIndicator = (memberTyping, isTyping) => {
        if (isTyping) {
            console.log('member typing: ', memberTyping.identity)
            this.setState({ isTyping: true, memberTyping: memberTyping.identity })
        } else {
            console.log("ID " + memberTyping.identity + " has stopped typing")
            this.setState({ isTyping: false, memberTyping: memberTyping.identity })
        }
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body, index }) => {
            if (author === this.props.dasbyUpi) {
                this.addMessage({ author, body: this.parseDasbyPayloadData(this.decryptMessage(body)), index })
            } else {
                this.addMessage({ author, body: this.parseUserPayloadData(this.decryptMessage(body)), index })
            }
        })

        //set up the listener for the typing started Channel event
        channel.on('typingStarted', member => {
            //process the member to show typing
            this.updateTypingIndicator(member, true);
        });

        //set  the listener for the typing ended Channel event
        channel.on('typingEnded', member => {
            //process the member to stop showing typing
            this.updateTypingIndicator(member, false);
        });

        // channel.on('memberJoined', (member) => {
        //     this.addMessage({ body: `${member.identity} has joined the channel.` })
        // })

        // channel.on('memberLeft', (member) => {
        //     this.addMessage({ body: `${member.identity} has left the channel.` })
        // })
    }

    handleNewMessage = (text) => {
        if (this.state.channel) {
            const encryptedMessage = virgilCrypto.encrypt(text, this.state.importedPublicKey)
            this.state.channel.sendMessage(encryptedMessage.toString('base64'))
            setTimeout(() => {
                this.setState({isQrVisible: false})
            }, 500);
        }
    }

    handleNewSurvey = () => {
        this.props.navigation.navigate('SurveyScreen', { upi: this.props.user.upi, channel: this.state.channel }) 
    }

    // componentWillUnmount(){
    //     this.state.channel.removeEventListener(this.configureChannelEvents)
    // }

    componentWillUnmount() {
        this.state.channel.removeListener('messageAdded', ({ author, body, index }) => {
            if (author === this.props.dasbyUpi) {
                this.addMessage({ author, body: this.parseDasbyPayloadData(this.decryptMessage(body)), index })
            } else {
                this.addMessage({ author, body: this.parseUserPayloadData(this.decryptMessage(body)), index })
            }
        });
        this.state.channel.removeListener('typingStarted', member => {
            //process the member to show typing
            this.updateTypingIndicator(member, true);
        });
        this.state.channel.removeListener('typingEnded', member => {
            //process the member to stop showing typing
            this.updateTypingIndicator(member, false);
        });

        this.setState( {
            channel: null,
            userPrivateKey: null,
            messages: [],
            memberArray: [],
            responseArray: [],
            isTyping: false,
            memberTyping: null,
            isQrVisible: true,
            spinnerVisible: true,
            newestStoredMessageIndex: 0,
            channelPrivateKey: null,
            importedPublicKey: null
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Spinner
                    visible={this.state.spinnerVisible}
                    textContent={'Loading Conversation...'}
                    textStyle={{ color: 'rgba(91, 141, 249, 1)'}}
                    cancelable={false}
                    color={'#3377FF'}
                    // animation={'fade'}
                    overlayColor={'rgba(255, 255, 255, 1)'}
                />
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                    <Text>
                        Welcome Home {this.props.user.first_name} {this.props.user.last_name}
                    </Text>
                    {this.state.messages&&this.state.memberArray&&
                    <MessageList memberTyping={this.state.memberTyping} isTyping={this.state.isTyping} upi={this.props.user.upi} messages={this.state.messages} memberArray={this.state.memberArray} 
                    />
                    }

                    {this.state.responseArray.length !== 0 && this.state.isQrVisible &&
                        // <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} /> 
                        <QuickReply ref={ref => this.QuickReply = ref} handleNewSurvey={this.handleNewSurvey} onMessageSend={this.handleNewMessage} responseArray={this.state.responseArray} isQrVisible={this.state.isQrVisible}/>
                    }
                    <MenuBar handleNewSurvey={this.handleNewSurvey} navigation={this.props.navigation} screen={'chat'} />
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }


}
const styles = StyleSheet.create({
    app: {
        backgroundColor: 'white',
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .055,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
    menuButton: {
        backgroundColor: '#99bbff',
        borderRadius: 40,
        width: 60,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12.5
    },
    spinnerTextStyle: {
        color: 'rgba(91, 141, 249, 1)',
    }
})
const UserHomeScreen = connect(mapStateToProps, mapDispatchToProps)(ConnectedUserHomeScreen);
export default UserHomeScreen;