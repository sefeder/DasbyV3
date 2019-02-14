import React, { Component } from 'react';
import { connect } from "react-redux";
import { storeUserInfo, storeDasbyUpi , storeUserPrivateKey} from "../redux/actions";
import { VirgilCrypto } from 'virgil-crypto';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';
import api from '../utils/api';

function mapDispatchToProps(dispatch) {
    return {
        storeUserInfo: info => dispatch(storeUserInfo(info)),
        storeDasbyUpi: dasbyUpi => dispatch(storeDasbyUpi(dasbyUpi)),
        storeUserPrivateKey: userPrivateKey => dispatch(storeUserPrivateKey(userPrivateKey))
    };
}

function mapStateToProps(reduxState) {
    return {
        user: reduxState.rootReducer.user,
    };
}

class ConnectedLandingScreen extends Component {

    state = {

    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.user !== this.props.user){

    //     }
    // }

    componentDidMount() {
        // AsyncStorage.clear()
        api.getDasbyUpi()
            .then(dasbyInfo => {
                // console.log("Dasby UPI Retrieved: ", (Date.now() - startTime) / 1000)
                this.props.storeDasbyUpi(dasbyInfo.dasby.upi)
            })
            .catch(err => console.log(err))
        // AsyncStorage.getItem('userInfo', (err, result)=>{
        //     if (err) console.log(err)

        console.log('this.props.user: ', this.props.user)
            if (this.props.user.upi !== undefined){ //this line is not working
                console.log('this.props.user.upi: ', this.props.user.upi)
                this.props.storeUserInfo({ ...this.props.user, newUser: false})
                const virgilCrypto = new VirgilCrypto()
                const userPrivateKey = virgilCrypto.importPrivateKey(this.props.user.private_key, this.props.user.upi)
                this.props.storeUserPrivateKey(userPrivateKey)
                if (this.props.user.role === 'user'){
                    this.props.navigation.navigate('UserHomeScreen')
                } else {
                    this.props.navigation.navigate('AdminSelectionScreen', { adminInfo: this.props.user })
                }
            } else {
                setTimeout(()=>{
                    this.props.navigation.navigate('LogInScreen')
                }, 2000)
            }
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

const LandingScreen = connect(mapStateToProps, mapDispatchToProps)(ConnectedLandingScreen);
export default LandingScreen;