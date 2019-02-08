import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, Dimensions, AsyncStorage, Image, WebView, ScrollView, Modal, Alert, Platform, Linking } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import call from 'react-native-phone-call'

export default class EmergencyButton extends Component {

    state = {
    }

    componentDidMount() {
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    render() {
        const buttons = [
            'Call MOMS HELPLINE',
            'Text a suicide counselor',
            'Cancel'
        ];
        const cancelIndex = 2;
        const destructiveIndex = 2
        return (
            <View>
                <TouchableHighlight
                underlayColor={'rgba(255, 255, 255, 0)'}
                onPress={ () => {
                    this.showActionSheet()
                }}>
                    <View>
                        <Icon style={{
                            height: 30, width: 28.5, marginLeft: 19.5
                        }} size={31} color={'red'} name='ios-warning' />
                        <Text style={{ color: 'red', fontSize: 10, marginRight: 8 }}> EMERGENCY </Text>
                    </View>
                </TouchableHighlight>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={<Text>EMERGENCY</Text>}
                    options={buttons}
                    cancelButtonIndex={cancelIndex}
                    destructiveButtonIndex={destructiveIndex}
                    onPress={(buttonIndex) => {
                        console.log('button clicked :', buttonIndex);
                        if (buttonIndex === 0) {
                            call({
                                number: '18663646667',
                                prompt: true
                            }).catch(console.error)
                        }
                        if (buttonIndex === 1) {
                            Linking.openURL('https://www.crisistextline.org/').catch(err => console.error('An error occurred', err));
                        }
                    }}
                />
            </View>   
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
    }
});