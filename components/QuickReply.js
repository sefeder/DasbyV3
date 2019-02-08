import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView } from 'react-native';

class QuickReply extends Component {

    state = {
        textInput: null,
        height: 0
    }

    handleSubmit = (responseObject) => {
        responseObjectString = JSON.stringify(responseObject)
        this.props.onMessageSend(responseObjectString)
        if(responseObject.chapter === "Survey"){
            this.props.handleNewSurvey();  
        }
    }

    render() {
        return (
            <View style={styles.quickReplyView}>
                < View style={styles.quickReplyButtonView}>
                    {this.props.isQrVisible &&
                        this.props.responseArray.map((responseObject, idx) => {
                            return [
                                <TouchableHighlight onPress={() => this.handleSubmit(responseObject)} style={styles.quickReplyButton} key={idx}>
                                    <Text style={styles.quickReplyText}>
                                    {responseObject.message}
                                    </Text>
                            </TouchableHighlight>
                            ]
                        })
                    }
                </View >  
            </View >
        )
    }

}
const styles = StyleSheet.create({
    quickReplyView: {
        backgroundColor: 'rgba(204, 203, 203, .6)',
        height: Dimensions.get('window').height * .09,
        width: Dimensions.get('window').width,
        borderTopColor: 'black',
        borderTopWidth: .2,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    quickReplyButtonView: {
        height: Dimensions.get('window').height * .09,
        width: Dimensions.get('window').width*.7,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
        zIndex: 10
    },
    quickReplyButton: {
        backgroundColor: '#3377FF',
        borderColor: '#3377FF',
        borderWidth: 2,
        maxWidth: 200,
        minHeight: 30,
        padding: 5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 5
    },
    quickReplyText: {
        color: 'white',
        fontSize: 18
    }
});

export default QuickReply