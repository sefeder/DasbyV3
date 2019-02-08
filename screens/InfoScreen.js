import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert } from 'react-native';
import MenuBar from '../components/MenuBar'

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
                {/* <View style={{ marginTop: 22 }}>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        presentationStyle={'pageSheet'}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                        }}
                        style={{ height: Dimensions.get('window').height * .5}}>
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>Hello World!</Text>

                                <TouchableHighlight
                                    onPress={() => {
                                        this.setState({modalVisible: !this.state.modalVisible});
                                    }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>
                </View> */}
                <ScrollView>
                    <View style={styles.textView}>
                        <Text style={styles.text}>
                            David Beiser, MD
                        </Text>
                        <Text style={styles.text}>
                            dbeiser@uchicago.edu
                        </Text>
                        <Text selectable style={styles.text}>
                            773-217-8020
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
                <MenuBar navigation={this.props.navigation} screen={'info'}/>
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
        justifyContent: 'flex-end'
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
        height: Dimensions.get('window').height*.42
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