import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Dimensions } from 'react-native';
import twilio from '../utils/twilioUtil';
import { connect } from "react-redux";
import { storePatientData } from "../redux/actions";
import {VirgilCrypto} from 'virgil-crypto';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import api from '../utils/api';
import virgil from '../utils/virgilUtil';
import MenuBar from '../components/MenuBar';
import Spinner from 'react-native-loading-spinner-overlay';

const virgilCrypto = new VirgilCrypto();

function mapDispatchToProps(dispatch) {
    return {
        storePatientData: selectedPatientData => dispatch(storePatientData(selectedPatientData)),
    };
}

function mapStateToProps(reduxState) {
    return {
        adminPrivateKey: reduxState.mainReducer.userPrivateKey,
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
        newestStoredMessageIndex: 0
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
        console.log("----------------------------------------------------------")
        console.log("hitting compoenentDidMount at: ", (Date.now() - startTime) / 1000)
        console.log("-------props----------")
        console.log(this.props)
        console.log('this.state.channelDescriptor: ', this.state.channelDescriptor)
        // virgil.getPrivateKey(this.props.adminInfo.upi)
        //     .then(adminPrivateKey => {
        //         console.log("Virgil Private Key Retrieved: ", (Date.now() - startTime) / 1000)
        //         this.setState({
        //             adminPrivateKey: adminPrivateKey
        //         })
        //     })
        //     .catch(err => console.log(err))
        console.log("this.props.adminInfo: ", this.props.adminInfo)
        let patientUpi = this.props.navigation.state.params.channelDescriptor.uniqueName
        console.log('SET TIMEOUT')
        this.state.channelDescriptor.getChannel()
        .then(channel => {
            const channelPrivateKeyBytes = channel.attributes.privateKey;
            console.log("this.props.adminPrivateKey: ", this.props.adminPrivateKey)
            const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, this.props.adminPrivateKey)
            const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
            const importedPublicKey = virgilCrypto.importPublicKey(channel.attributes.publicKey)
            console.log("Channel Gotten from Channel Descriptor: ", (Date.now() - startTime) / 1000)
            this.configureChannelEvents(channel)
            this.setState({ channel, channelPrivateKey, importedPublicKey })
            channel.getMessagesCount()
            .then(channelMessageCount => {
                if (this.props.storedPatientData.hasOwnProperty(patientUpi)) {
                    //this determines if this is first time openning this patient chat, if it is, continue, if not, see line ~135
                    console.log("that patient's data is stored in redux, baby!")
                    const newestStoredMessageIndex = this.props.storedPatientData[patientUpi].messages[this.props.storedPatientData[patientUpi].messages.length - 1].index
                        channel.getMessages(channelMessageCount - 1 - newestStoredMessageIndex, newestStoredMessageIndex + 1, 'forward')
                        .then(result => {
                            console.log("result: ", result)
                            console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                            console.log("----------------------------------------------------------------------------------------")
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
                                    messages: this.props.storedPatientData[patientUpi].messages.concat(result.items.map((message, i, items) => {
                                        console.log("Messages Map Function - message #", i, " at: ", (Date.now() - startTime) / 1000)
                                        return {
                                            author: message.author,
                                            body: this.parseIncomingPayloadData(this.decryptMessage(message.body)),
                                            me: message.author === this.props.adminInfo.upi,
                                            sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                            index: message.index
                                        }
                                    })),
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
                                        console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                                    }
                                )
                            }
                        })
                                 
                } else {
                    console.log("that patient's data is NOT stored in redux :( ")
                    channel.getMessages(15).then(result => {
                        console.log("Twilio Messages Retrieved: ", (Date.now() - startTime) / 1000)
                        console.log("----------------------------------------------------------------------------------------")
                        this.setState({
                            messages: result.items.map((message, i, items) => {
                                console.log("Messages Map Function - message #", i, " at: ", (Date.now() - startTime) / 1000)
                                return {
                                    author: message.author,
                                    body: this.parseIncomingPayloadData(this.decryptMessage(message.body)),
                                    me: message.author === this.props.adminInfo.upi,
                                    sameAsPrevAuthor: items[i - 1] === undefined ? false : items[i - 1].author === message.author,
                                    index: message.index
                                }
                            })
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
                            console.log("---------------------END SET STATE MESSAGES-----------------------", (Date.now() - startTime) / 1000)
                        })
                    })
                    channel.getMembers().then(result => {
                        console.log("Channel Members Gotten: ", (Date.now() - startTime) / 1000)
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
                                        console.log("Set State Member ", i, " at:", (Date.now() - startTime) / 1000)
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
    decryptMessage = (encrytpedMessage) => {
        const decryptedMessage = virgilCrypto.decrypt(encrytpedMessage, this.state.channelPrivateKey).toString('utf8')
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
        const messageData = { ...message, index: message.index, me: message.author === this.props.adminInfo.first_name, sameAsPrevAuthor: this.state.messages[this.state.messages.length - 1] === undefined ? false : this.state.messages[this.state.messages.length - 1].author === message.author }
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
            console.log('member typing: ', memberTyping.identity)
            this.setState({ isTyping: true, memberTyping: memberTyping.identity })
        } else {
            console.log("ID " + memberTyping.identity + " has stopped typing")
            this.setState({ isTyping: false, memberTyping: memberTyping.identity })
        }
    }

    configureChannelEvents = (channel) => {
        channel.on('messageAdded', ({ author, body, index }) => {
            this.addMessage({ author, body: this.parseIncomingPayloadData(this.decryptMessage(body)), index })
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
        }
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
                    Welcome Home {this.props.adminInfo.first_name} {this.props.adminInfo.last_name}
                </Text>
                <MessageList memberTyping={this.state.memberTyping} isTyping={this.state.isTyping} upi={this.props.adminInfo.upi} messages={this.state.messages} memberArray={this.state.memberArray} />
                <MessageForm channel={this.state.channel} onMessageSend={this.handleNewMessage} />
                <MenuBar navigation={this.props.navigation} screen={'chat'} />

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