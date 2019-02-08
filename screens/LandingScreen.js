import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';


export default class LandingScreen extends Component {

    state = {

    }

    componentDidMount() {
        AsyncStorage.clear()
        AsyncStorage.getItem('userInfo', (err, result)=>{
            if (err) console.log(err)
            if (result !== null){
                console.log('JSON.parse(result): ', JSON.parse(result))
                if (JSON.parse(result).user.role === 'user'){
                    this.props.navigation.navigate('UserHomeScreen', {userInfo: JSON.parse(result), newUser: false})
                } else {
                    this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: JSON.parse(result) })
                }
            } else {
                setTimeout(()=>{
                    this.props.navigation.navigate('LogInScreen')
                }, 2000)
            }
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Image
                    source={require('../assets/qbkls.png')}
                    style={{ width: '150%', height: '100%', opacity: 0.23, zIndex: -1, backgroundColor: '#810000', position: 'absolute'}}
                />
                <Animatable.Text
                    animation="fadeInLeft"
                    duration={2000}
                    style={styles.splashText}
                > 
                    Dasby
                </Animatable.Text>
                <Animatable.Image
                    duration={2000}
                    animation="fadeInRight"
                    source={require('../assets/dasby-no-backg.png')}
                    style={styles.image}
                />
            </KeyboardAvoidingView>
        )
    }



}

const styles = StyleSheet.create({
    app: {
        display: 'flex',
        overflow: 'scroll',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#810000',
        

    },
    image: {
        height: Dimensions.get('window').height * .33,
        width: Dimensions.get('window').width * .6,
    },
    splashText: {
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 70
    },
});