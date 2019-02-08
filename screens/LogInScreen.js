import React, { Component } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableHighlight, TouchableOpacity, AsyncStorage} from 'react-native';
import api from '../utils/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default class LogInScreen extends Component {

    state = {
        emailInput: null,
        passwordInput: null,
        hiddenPass: true,
        buttonLockout: false
    }
    viewPass = () => {
        this.setState({hiddenPass: !this.state.hiddenPass})
    }
    submitLogIn = () => {
        if (this.state.buttonLockout) {return;}
        this.setState({buttonLockout: true})
        api.logIn({
            email: this.state.emailInput,
            password: this.state.passwordInput
        })
            .then(res => {
                if (!res.status && res.message === "invalid email") {
                    console.log('that email is invalid')
                    this.setState({emailInput: '', passwordInput: '', buttonLockout: false})
                    return;
                }
                if (!res.status && res.message === "password does not match") {
                    console.log('that password does not match that email')
                    this.setState({ emailInput: '', passwordInput: '', buttonLockout: false})
                    return;
                }
                if (res.user.role === "user"){
                    AsyncStorage.setItem('userInfo', JSON.stringify(res), () => {
                        this.props.navigation.navigate('UserHomeScreen', {userInfo: res, newUser: false})
                    })
                }
                if (res.user.role === "admin"){
                    console.log("succesfully loged in as admin!")
                    AsyncStorage.setItem('userInfo', JSON.stringify(res), () => {
                        this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: res })
                    })
                }
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView enabled behavior="padding" style={styles.app} keyboardVerticalOffset={64}> 
                    <View style={styles.inputForm}>
                        <View>
                            <Text style={styles.inputLabel}>
                                Email:
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                autoFocus
                                onChangeText={(emailInput) => this.setState({ emailInput })}
                                value={this.state.emailInput}
                                placeholder='Email'
                                autoCapitalize='none'
                                textContentType='emailAddress'
                            />
                        </View>
                        <View style={styles.marginBottom}>
                            <Text style={styles.inputLabel}>
                                Password:
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                borderColor: '#810000',
                                borderWidth: 2,
                                borderRadius: 10,
                                marginBottom: 40,
                                height: 50,
                                width: 300,
                                paddingLeft: 15,
                                paddingRight: 15,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                < View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{ fontSize: this.state.hiddenPass ? 13.5 : 14 }}
                                        onChangeText={(passwordInput) => this.setState({ passwordInput })}
                                        value={this.state.passwordInput}
                                        placeholder='Password'
                                        autoCapitalize='none'
                                        textContentType='password'
                                        secureTextEntry={this.state.hiddenPass}
                                    />
                                </View >
                                <View style={{ justifyContent: 'flex-end' }}>
                                    {this.state.passwordInput !== null && this.state.passwordInput !== '' &&
                                        <TouchableOpacity
                                            onPress={this.viewPass}
                                        > 
                                            <Icon name={this.state.hiddenPass ? "ios-eye" : "ios-eye-off"} size={37} color={'#810000'}/>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View >
                        </View>
                        <TouchableHighlight style={styles.button} onPress={this.submitLogIn}>
                            <Text style={styles.buttonText}> Log In </Text>
                        </TouchableHighlight>
                        <View style={styles.signUpLine}>
                            <Text style={{fontSize: 18}}>
                                Need to create an account? Click
                            </Text>
                            <Button
                                style={{ paddingLeft: 2 }}
                                onPress={() => {
                                    this.props.navigation.navigate('SignUpScreen')
                                }}
                                title="here"
                            />
                        </View>
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
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 30
    },
    textInput: {
        borderColor: '#810000',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 40,
        height: 50,
        width: 300,
        paddingLeft: 15,
        paddingRight: 15
    },
    inputForm: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: Dimensions.get('window').height * .65,
        width: Dimensions.get('window').width * .65,
        borderRadius: 10
    },
    inputLabel: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    signUpLine: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});