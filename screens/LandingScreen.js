import React, { Component } from 'react';
import { connect } from "react-redux";
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';
import api from '../utils/api';


function mapStateToProps(reduxState) {
    return {
        user: reduxState.rootReducer.user,
    };
}

class ConnectedLandingScreen extends Component {

    componentDidUpdate(prevProps) {
             
    }
    
    componentDidMount(){
        // if (this.props.user === {}) {
        //     this.props.navigation.navigate('LogInScreen')
        // }
        // if (this.props !== prevProps) {
            if (this.props.user.upi) {
                if (this.props.user.role === 'user') {
                    this.props.navigation.navigate('UserHomeScreen')
                } else {
                    this.props.navigation.navigate('AdminSelectionScreen')
                }
            } else {
                // AsyncStorage.clear()
                this.props.navigation.navigate('LogInScreen')
            }
        // }  
    }

    render(){
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

const LandingScreen = connect(mapStateToProps, null)(ConnectedLandingScreen);
export default LandingScreen;