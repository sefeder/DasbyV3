import React, { Component } from 'react';
import { connect } from "react-redux";
import { storeUserInfo } from "../redux/actions";
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';

function mapDispatchToProps(dispatch) {
    return {
        storeUserInfo: info => dispatch(storeUserInfo(info))
    };
}

class ConnectedLandingScreen extends Component {

    state = {

    }

    componentDidMount() {
        // AsyncStorage.clear()
        AsyncStorage.getItem('userInfo', (err, result)=>{
            if (err) console.log(err)
            if (result !== null){
                const info = JSON.parse(result)
                console.log('JSON.parse(result): ', info)
                this.props.storeUserInfo(info.user)
                if (info.user.role === 'user'){
                    this.props.navigation.navigate('UserHomeScreen', {userInfo: info, newUser: false})
                } else {
                    this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: info })
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

const LandingScreen = connect(null, mapDispatchToProps)(ConnectedLandingScreen);
export default LandingScreen;