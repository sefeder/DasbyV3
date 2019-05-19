import React, { Component } from 'react';
import { connect } from "react-redux";
import { storeUserInfo, storeTwilioToken, storeDasbyUpi } from "../redux/actions";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableHighlight, TouchableOpacity, AsyncStorage } from 'react-native';
import api from '../utils/api';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotifications from '../utils/notifications'

function mapDispatchToProps(dispatch) {
    return {
        storeUserInfo: info => dispatch(storeUserInfo(info)),
        storeDasbyUpi: dasbyUpi => dispatch(storeDasbyUpi(dasbyUpi)),
        storeTwilioToken: twilioToken => dispatch(storeTwilioToken(twilioToken))
    };
}

function mapStateToProps(reduxState) {
    return {
        user: reduxState.mainReducer.user,
    };
}

class ConnectedBpInput extends Component {

    state = {
        systolic: "",
        diastolic: "",
        fillBoth: false,
    }

    componentDidMount() {
    }

    submitBp = () => {
        if (this.state.systolic === "" || this.state.diastolic === "" ){
            this.setState({
                fillBoth: true,
                systolic: "",
                diastolic: ""
            })
            return;
        } else {
            api.saveBp(this.props.user.upi, this.state.systolic, this.state.diastolic)
                .then(()=>{
                    this.props.navigation.navigate('Chat')
                })
                .catch(err => console.log(err))
        }
    }

    render() {
        return (

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}>
                        <View>
                            <View style={styles.inputRow}>
                                <TextInput
                                    keyboardType={"numeric"}
                                    maxLength={3}
                                    style={styles.textInput}
                                    autoFocus
                                    onChangeText={(systolic) => this.setState({ systolic })}
                                    value={this.state.emailInput}
                                    placeholder='120'
                                    placeholderTextColor='gray'
                                />
                                <Text style={styles.slash}>/</Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    maxLength={3}
                                    style={styles.textInput}
                                    onChangeText={(diastolic) => this.setState({ diastolic })}
                                    value={this.state.emailInput}
                                    placeholder='80'
                                    placeholderTextColor='gray'
                                />
                            <Text style={styles.unit}> mmHg</Text>
                            </View>
                        {this.state.fillBoth && <Text style={styles.fillBoth}>Please fill out both fields</Text>}
                        <TouchableHighlight style={styles.button} onPress={this.submitBp}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableHighlight>
                        </View>
                       
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    app: {
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333'
    },
    button: {
        backgroundColor: '#810000',
        borderRadius: 10,
        width: 300,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 24
    },
    textInput: {
        borderColor: '#810000', // 'white'
        color: 'white',
        fontSize: 16,
        borderWidth: 3,
        borderRadius: 10,
        height: 45,
        width: 80,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center'
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    unit: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-end'
    },
    fillBoth: {
        color: 'white',
        fontSize: 20,
        marginBottom: 15
    },
    slash: {
        color: 'white',
        fontSize: 40,
        alignSelf: 'flex-end'
    }
});

const BpInputScreen = connect(mapStateToProps, mapDispatchToProps)(ConnectedBpInput);
export default BpInputScreen;