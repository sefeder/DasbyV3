import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, Dimensions, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { storeUserInfo, storeDasbyUpi } from "../redux/actions";
import twilio from '../utils/twilioUtil';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import QuickReply from '../components/QuickReply';
import Spinner from 'react-native-loading-spinner-overlay';

function mapDispatchToProps(dispatch) {
    return {
        storeUserInfo: info => dispatch(storeUserInfo(info)),
        storeDasbyUpi: dasbyUpi => dispatch(storeDasbyUpi(dasbyUpi)),
    };
}

function mapStateToProps(reduxState) {
    return {
        dasbyUpi: reduxState.mainReducer.dasbyUpi,
        user: reduxState.mainReducer.user,
        storedMessages: reduxState.mainReducer.user.messages,
        storedMemberArray: reduxState.mainReducer.user.memberArray
    };
}

class ConnectedUserHomeScreen extends Component {

    state = {
        channel: null,
        messages: [],
        memberArray: [],
        responseArray: [],
        isTyping: false,
        memberTyping: null,
        isQrVisible: true,
        spinnerVisible: true,
        newestStoredMessageIndex: 0,
    }

    componentDidMount() {

        AsyncStorage.getItem('responses', (err, responses) => {
            if (responses !== null) {
                this.setState({ responseArray: JSON.parse(responses).responseArray, isQrVisible: JSON.parse(responses).isQrVisible}) 
            } 
        })

        twilio.getTwilioToken(this.props.user.upi)
        .then(twilio.createChatClient)
        .then(chatClient => {
            //chatClient.on('tokenExpired', )
            if (this.props.user.newUser) {
                api.getAdmin()
                    .then(result => {
                        
                        const adminUpiArray = result.admin.map(admin => admin.upi)
                        return twilio.createChannel(chatClient, this.props.user.upi, adminUpiArray)
                            .then(twilio.joinChannel)
                            .then(channel => {
                                this.setState({ channel })
                                for (let i = 0; i < adminUpiArray.length; i++){
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
                    this.setState({ channel })
                    this.configureChannelEvents(channel)
                    channel.getMessagesCount()
                        .then(channelMessageCount=>{
                        //  console.log("channelMessageCount inside: ", channelMessageCount)

                        // __________________everything below this line (to the ^^^^^) happens only if there are no stored messages_______________________
                            if(this.state.newestStoredMessageIndex === 0){
                                this.getChannelMembers(channel)
                                channel.getMessages(15)
                                .then(result => {
                                    this.setState({
                                        messages: this.mapThroughMessages(result, "new")
                                    }, () => {
                                        //  AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
                                        this.props.storeUserInfo({ ...this.props.user, messages: this.state.messages })
                                        this.setState({
                                            spinnerVisible: false
                                        })
                                    })
                                })
                            }
                            // __________________everything below this line (to the ^^^^^) happens only if there are stored messages________________________
                            else{
                                channel.getMessages(channelMessageCount - 1 - this.state.newestStoredMessageIndex, this.state.newestStoredMessageIndex + 1 , 'forward')
                                .then(result => {
                                    result === undefined ?
                                    // ___________the next line (to the ####### happens only if there were no new messages in twilio_______________
                                    this.setState({ messages: this.props.storedMessages, memberArray: this.props.storedMemberArray })
                                    :
                                    // __________everything below this line (to the ####) happens only if there were new messages in twilio__________
                                    this.setState({
                                        messages: this.props.storedMessages.concat(this.mapThroughMessages(result),"new"),
                                     memberArray: this.props.storedMemberArray }, ()=> {
                                        //  AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
                                         this.props.storeUserInfo({...this.props.user, messages: this.state.messages})
                                         this.setState({
                                             spinnerVisible: false
                                         })
                                     })
                                })
                                
                            }
                        })
                })
            }
        })
    }

    mapThroughMessages = (result, condition) => {
        return result.items.map((message, i, items) => {
            let isLastMessage = false
            let messageBody;
            if(condition === "new" && i === items.length-1){
                isLastMessage = true
            }

            if (message.author === this.props.dasbyUpi) {
                messageBody = this.parseDasbyPayloadData(message.body, isLastMessage)
            } else {
                messageBody = this.parseUserPayloadData(message.body)
            }

            return {
                author: message.author,
                body: messageBody,
                me: message.author === this.props.user.upi,
                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                timeStamp: message.timestamp,
                index: message.index
            }
        })
    }

    getChannelMembers = (channel) => {
        channel.getMembers().then(result => {
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

    canParseStr = str => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    parseDasbyPayloadData = (payloadDataString, isLastMessage) => {
        if (this.canParseStr(payloadDataString)) {
            const payloadData = JSON.parse(payloadDataString)
            if (typeof payloadData === 'number') {
                const message = payloadData
                return message
            }
            if(isLastMessage){
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
        const messageData = {
            ...message,
            me: message.author === this.props.user.upi,
            sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author,
            timeStamp: message.timestamp,
            index: message.index
        }
        this.setState({
            messages: [...this.state.messages, messageData],
        }, () => {
            this.props.storeUserInfo({ ...this.props.user, messages: this.state.messages })
            // AsyncStorage.setItem('messages', JSON.stringify(this.state.messages))
        })
    }

    updateTypingIndicator = (memberTyping, isTyping) => {
        if (isTyping) {
            this.setState({ isTyping: true, memberTyping: memberTyping.identity })
        } else {
            this.setState({ isTyping: false, memberTyping: memberTyping.identity })
        }
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body, index }) => {
            if (author === this.props.dasbyUpi) {
                this.addMessage({ author, body: this.parseDasbyPayloadData(body, true), index })
            } else {
                this.addMessage({ author, body: this.parseUserPayloadData(body), index })
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
            this.state.channel.sendMessage(text)
            setTimeout(() => {
                this.setState({isQrVisible: false})
            }, 500);
        }
    }

    handleNewSurvey = () => {
        this.props.navigation.navigate('SurveyScreen', { upi: this.props.user.upi }) 
    }

    getOlderMessages = () => {
        this.setState({loading: true})
        this.state.channel.getMessages(15, this.state.messages[0].index - 1)
            .then(result => {
               if(result){
                   this.setState({
                       messages: this.mapThroughMessages(result,"old").concat(this.props.storedMessages),
                   }, () => {
                       this.setState({loading: false})
                       this.props.storeUserInfo({ ...this.props.user, messages: this.state.messages })
                   })
               }
            })
        
    }

    componentWillUnmount() {

        this.setState( {
            channel: null,
            messages: [],
            memberArray: [],
            responseArray: [],
            isTyping: false,
            memberTyping: null,
            isQrVisible: true,
            spinnerVisible: true,
            newestStoredMessageIndex: 0,
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
                        Welcome Home {this.props.user.first_name}
                    </Text>
                    {this.state.messages&&this.state.memberArray&&
                        <MessageList
                            loading={this.state.loading}
                            getOlderMessages={this.getOlderMessages}
                            memberTyping={this.state.memberTyping}
                            isTyping={this.state.isTyping}
                            upi={this.props.user.upi}
                            messages={this.state.messages}
                            memberArray={this.state.memberArray} 
                        />
                    }

                    {this.state.responseArray.length !== 0 && this.state.isQrVisible &&
                        // <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} /> 
                        <QuickReply ref={ref => this.QuickReply = ref} handleNewSurvey={this.handleNewSurvey} onMessageSend={this.handleNewMessage} responseArray={this.state.responseArray} isQrVisible={this.state.isQrVisible}/>
                    }
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