
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class LoadingScreen extends Component {

    render(){
        return(
            // <Spinner
            //     visible={true}
            //     textContent={'Loading...'}
            //     textStyle={{ color: 'rgba(91, 141, 249, 1)' }}
            //     cancelable={false}
            //     color={'#3377FF'}
            //     // animation={'fade'}
            //     overlayColor={'rgba(255, 255, 255, 1)'}
            // />
            <KeyboardAvoidingView style={styles.app}>
                <Image
                    source={require('../assets/qbkls.png')}
                    style={{ width: '150%', height: '100%', opacity: 0.23, zIndex: -1, backgroundColor: '#810000', position: 'absolute' }}
                />
                <Animatable.Text
                    animation="fadeInLeft"
                    duration={1500}
                    style={styles.dasbyText}
                >
                    Dasby
                </Animatable.Text>
                <Animatable.Image
                    duration={1500}
                    animation="fadeInRight"
                    source={require('../assets/dasby-no-backg.png')}
                    style={styles.image}
                />
                <Animatable.Text
                    duration={1500}
                    animation="fadeIn"
                    style={styles.loadingText}
                >
                    Loading...
                </Animatable.Text>
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
    dasbyText: {
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 70
    },
    loadingText: {
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 30
    },
});