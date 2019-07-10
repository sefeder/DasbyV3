import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert } from 'react-native';
import MenuBar from '../components/MenuBar'
import Icon from 'react-native-vector-icons/Ionicons';


// import Icon from 'react-native-vector-icons/MaterialIcons';

export default class InfoScreen extends Component {

    state = {
        modalVisible: false,
    }

    componentDidMount() {
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <Image
                    source={require('../assets/qbkls.png')}
                    style={{ width: '150%', height: '100%', opacity: 0.23, zIndex: -1, backgroundColor: '#810000', position: 'absolute' }}
                />
                <ScrollView>
                    <View style={styles.textView}>
                        <Text style={styles.text}>
                            <Icon size={30} color='black' name='ios-person' />  David Beiser, MD
                        </Text>
                        <Text style={styles.text}>
                            <Icon size={30} color='black' name='ios-mail' />  dbeiser@uchicago.edu
                        </Text>
                        <Text selectable style={styles.text}>
                            <Icon size={30} color='black' name='ios-phone-portrait' />  773-217-8020
                        </Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginLeft: 5 }}>A message from Dr. Beiser:
                    </Text>
                    <View style={{flex: 1}}>
                        <WebView
                            source={{ uri: 'https://youtu.be/xhH63kkutzs' }}
                            style={styles.webView}
                        />
                    </View>
                </ScrollView>
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
        justifyContent: 'flex-end',
        backgroundColor: '#810000',
    },
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .062,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 18,
        marginBottom: 10
    },
    webView: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.37
    },
     textView: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15  
    },
    menuButton: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});