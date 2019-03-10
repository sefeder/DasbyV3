import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions } from 'react-native';
import twilio from '../utils/twilioUtil';
import { connect } from "react-redux";
import { storePatientData } from "../redux/actions";
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import MenuBar from '../components/MenuBar';
import Spinner from 'react-native-loading-spinner-overlay';


function mapDispatchToProps(dispatch) {
    return {
        storePatientData: selectedPatientData => dispatch(storePatientData(selectedPatientData)),
    };
}

function mapStateToProps(reduxState) {
    return {
        adminInfo: reduxState.mainReducer.user,
        storedPatientData: reduxState.mainReducer.storedPatientData,
    };
}

class ConnectedAdminChatScreen extends Component {

    state = {
    
        channelDescriptor: this.props.navigation.state.params.channelDescriptor,
        selectedPatientUpi: this.props.navigation.state.params.channelDescriptor.uniqueName,
        channel: null,
        messages: [],
        memberArray: [],
        isTyping: false,
        memberTyping: null,
        spinnerVisible: true,
        newestStoredMessageIndex: 0,
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.navigation.state.params.channelDescriptor !== this.props.navigation.state.params.channelDescriptor) {
            
            
    //         this.setState({ 
    //             channelDescriptor: nextProps.navigation.state.params.channelDescriptor,
    //             selectedPatientUpi: nextProps.navigation.state.params.channelDescriptor.uniqueName
    //         })
    //     }
    // }
    // componentDidUpdate(prevProps, prevState){
    //     if (prevState !== this.state){
            
    //     }
    // }

    componentDidMount() {
        const startTime = Date.now();
        let patientUpi = this.props.navigation.state.params.channelDescriptor.uniqueName
        this.state.channelDescriptor.getChannel()
        .then(channel => {
            this.configureChannelEvents(channel)
            this.setState({ channel })
            channel.getMessagesCount()
            .then(channelMessageCount => {
                if (this.props.storedPatientData.hasOwnProperty(patientUpi)) {
                    //this determines if this is first time openning this patient chat, if it is, continue, if not, see line ~135
                    const newestStoredMessageIndex = this.props.storedPatientData[patientUpi].messages[this.props.storedPatientData[patientUpi].messages.length - 1].index
                        channel.getMessages(channelMessageCount - 1 - newestStoredMessageIndex, newestStoredMessageIndex + 1, 'forward')
                        .then(result => {
                            if(result === undefined){
                                // if no new messages since last time selecting this patient
                                this.setState({ messages: this.props.storedPatientData[patientUpi].messages, memberArray: this.props.storedPatientData[patientUpi].memberArray }, () => {
                                    this.setState({
                                        spinnerVisible: false
                                    })
                                })
                            } else {
                                // if new messages since last time selecting this patient
                                this.setState({
                                    messages: this.props.storedPatientData[patientUpi].messages.concat(this.mapThroughMessagesAdmin(result)),
                                    memberArray: this.props.storedPatientData[patientUpi].memberArray}, () => {
                                        let objectToStore = {
                                            selectedPatientUpi: this.state.selectedPatientUpi,
                                            messages: this.state.messages,
                                            memberArray: this.state.memberArray
                                        }
                                        this.props.storePatientData(objectToStore)
                                        this.setState({
                                            spinnerVisible: false
                                        })
                                    }
                                )
                            }
                        })
                                 
                } else {
                    channel.getMessages(15).then(result => {
                        this.setState({
                            messages: this.mapThroughMessagesAdmin(result)
                        }, () => {
                                // if (this.state.selectedPatientUpi) {
                                    let objectToStore = {
                                        // channelDescriptor: this.state.channelDescriptor,
                                        selectedPatientUpi: this.state.selectedPatientUpi,
                                        messages: this.state.messages,
                                        memberArray: this.state.memberArray
                                    }
                                    this.props.storePatientData(objectToStore)
                                // }
                            this.setState({
                                spinnerVisible: false
                            })
                        })
                    })
                    channel.getMembers().then(result => {
                        let memberArray = []
                        result.forEach((member,i) => {
                            api.getUser(member.identity).then(dbUser => {
                                let member = {
                                    upi: dbUser.user.upi,
                                    firstName: dbUser.user.first_name,
                                    lastName: dbUser.user.last_name
                                }
                                memberArray.push(member)
                                if (i === result.length-1) {
                                    this.setState({ memberArray }, () => {
                                        // if (this.state.selectedPatientUpi) {
                                            let objectToStore = {
                                                // channelDescriptor: this.state.channelDescriptor,
                                                selectedPatientUpi: this.state.selectedPatientUpi,
                                                messages: this.state.messages,
                                                memberArray: this.state.memberArray
                                            }
                                            this.props.storePatientData(objectToStore)
                                        // }
                                    })
                                }
                            })
                        })
                    })
                }
            })
        }) 
    }

    mapThroughMessagesAdmin = (result) => {
        return result.items.map((message, i, items) => {
            return {
                author: message.author,
                body: this.parseIncomingPayloadData(message.body),
                me: message.author === this.props.adminInfo.upi,
                sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                index: message.index,
                timeStamp: message.timestamp,
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

    parseIncomingPayloadData = payloadDataString => {
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
            index: message.index,
            me: message.author === this.props.adminInfo.first_name,
            sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author }
        this.setState({
            messages: [...this.state.messages, messageData],
        },()=>{
            let objectToStore = {
                // channelDescriptor: this.state.channelDescriptor,
                selectedPatientUpi: this.state.selectedPatientUpi,
                messages: this.state.messages,
                memberArray: this.state.memberArray
            }
            this.props.storePatientData(objectToStore) 
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
            this.addMessage({ author, body: this.parseIncomingPayloadData(body), index })
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
        }
    }

    getOlderMessages = () => {
        this.setState({ loading: true })
        this.state.channel.getMessages(15, this.state.messages[0].index - 1)
            .then(result => {
                if (result) {
                    this.setState({
                        messages: this.mapThroughMessagesAdmin(result).concat(this.props.storedPatientData[this.state.selectedPatientUpi].messages),
                    }, () => {
                        this.setState({ loading: false })
                        let objectToStore = {
                            selectedPatientUpi: this.state.selectedPatientUpi,
                            messages: this.state.messages,
                            memberArray: this.state.memberArray
                        }
                        this.props.storePatientData(objectToStore)
                    })
                }
            })

    }

render () {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Spinner
                visible={this.state.spinnerVisible}
                textContent={'Loading Conversation...'}
                textStyle={{ color: 'rgba(91, 141, 249, 1)' }}
                cancelable={false}
                color={'#3377FF'}
                animation={'fade'}
                overlayColor={'rgba(255, 255, 255, 1)'}
            />
            <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                <Text>
                    Welcome Home {this.props.adminInfo.first_name}
                </Text>
                {this.state.messages && this.state.memberArray &&
                    <MessageList
                    loading={this.state.loading}
                    getOlderMessages={this.getOlderMessages}
                    memberTyping={this.state.memberTyping}
                    isTyping={this.state.isTyping}
                    upi={this.props.adminInfo.upi}
                    messages={this.state.messages}
                    memberArray={this.state.memberArray}
                    />
                }
                <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

}
const styles = StyleSheet.create({
    app: {
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
})

const AdminChatScreen = connect(mapStateToProps, mapDispatchToProps)(ConnectedAdminChatScreen);
export default AdminChatScreen;