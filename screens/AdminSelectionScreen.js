import React, { Component } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, Button, TextInput, TouchableHighlight, AsyncStorage, Dimensions } from 'react-native';
import twilio from '../utils/twilioUtil';
import { connect } from "react-redux";
import { storeCurrentSelectedPatientUpi } from "../redux/actions";
import { ChannelDescriptor } from 'twilio-chat/lib/channeldescriptor';
import api from '../utils/api';
import MenuBar from '../components/MenuBar';
import { STORE_PATIENT_DATA } from '../redux/action-types';

function mapDispatchToProps(dispatch) {
    return {
        storeCurrentSelectedPatientUpi: currentSelectedPatientUpi => dispatch(storeCurrentSelectedPatientUpi(currentSelectedPatientUpi)),
    };
}

function mapStateToProps(reduxState) {
    return {
        user: reduxState.mainReducer.user,
    };
}

class ConnectedAdminSelectionScreen extends Component {

    state = {
        // adminInfo: this.props.navigation.state.params.adminInfo.user,
        channels: [],
        userArray: []
    }

    componentDidMount() {
        twilio.getTwilioToken(this.props.user.upi) //admin's upi
            .then(twilio.createChatClient)
            .then(chatClient => {
                return twilio.getAllChannels(chatClient)
            })
            .then(allChannels => {
                this.setState({channels: allChannels.items})
            })
        api.getAllUsers().then(result => {
            result.forEach(user => {
                this.setState({
                    userArray: [...this.state.userArray, {
                        upi: user.upi,
                        firstName: user.first_name,
                        lastName: user.last_name
                    }]
                })
            })
        })
        
    }

    channelButtonHandler = selectedChannel => {
        console.log("selectedChannel.uniqueName:", selectedChannel.uniqueName)
        this.props.storeCurrentSelectedPatientUpi(selectedChannel.uniqueName)
        this.props.navigation.navigate('AdminChatScreen', {channelDescriptor: selectedChannel})
    }

    channelFilterCriteria = (channel,idx,arr) => {
        for (let i = 0; i < this.state.userArray.length; i++) {
            let user = this.state.userArray[i];
            if (user.upi === channel.uniqueName) {
                return true
            }
        }
        return false
    }

    determineUserName = (userUpi) => {
        for (let i = 0; i < this.state.userArray.length; i++) {
            let user = this.state.userArray[i];
            if (user.upi === userUpi) {
                return (<View style={styles.buttonView}>
                            <Text style={styles.name}> 
                                {user.firstName} {user.lastName} 
                            </Text>
                            <Text style={styles.dob}>
                               DOB: 06/21/92
                            </Text>
                            <Text style={styles.severity}>
                                Most recent severity: {Math.floor(Math.random() * 101)}
                            </Text>
                        </View> 
                        )
            }
        }
    }

    render() {
        return (
            <ScrollView >
                <View style={styles.app}>
                    <Text>
                        Welcome {this.props.user.first_name},
                    </Text>
                    <Text>
                        Select a patient to view his or her data
                    </Text>
                    <View style={styles.chatList}>

                        {this.state.channels.filter(this.channelFilterCriteria).map((ChannelDescriptor, index) => {
                            return (
                                <TouchableHighlight
                                    underlayColor={'rgba(255, 255, 255, 0)'}
                                    key={index} 
                                    style={styles.button} 
                                    onPress={() => this.channelButtonHandler(ChannelDescriptor)}
                                >
                                    {this.determineUserName(ChannelDescriptor.uniqueName)}
                                </TouchableHighlight>
                            )
                        })}

                    </View>

                </View>


            </ScrollView>
        )
    }


}
const styles = StyleSheet.create({
    app: {
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'white',
        // borderRadius: 10,
        borderWidth: 1,
        borderColor: '#810000',
        height: Dimensions.get('window').height * .1,
        width: Dimensions.get('window').width * .95,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        // marginBottom: 1
    },
    buttonView: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'flex-start'
    },
    dob: {
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'flex-start'
    },
    severity: {
        fontSize: 16,
        alignSelf: 'center'
    },
    chatList: {
        overflow: 'scroll'
    }
})

const AdminSelectionScreen = connect(mapStateToProps, mapDispatchToProps)(ConnectedAdminSelectionScreen);
export default AdminSelectionScreen;