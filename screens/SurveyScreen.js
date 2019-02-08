import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight } from 'react-native';
import api from '../utils/api';

export default class SurveyScreen extends Component {

    state = {
        upi: this.props.navigation.state.params.upi,
        channelSid: this.props.navigation.state.params.channel.sid,
        currentQuestion: null,
        currentChoice: 0 
    }

    componentDidMount() {
       
        api.getCatmhSurvey("dep", this.state.upi)
        .then(res => {
            console.log('should be first q: ', res)
            this.setState({currentQuestion: res})
        })
    }

    handleAnswerSubmit = (choice, currentQuestion) => {
        console.log('choice: ', choice)
        console.log('currentQuestion: ', currentQuestion)
        api.getNextQuestion(this.state.upi, choice, currentQuestion) // <==== need payload
            .then(res => {
                if(res.surveyIsDone){
                    console.log('res in SScreen line 27: ', res)
                    api.dasbyRead(this.state.channelSid, 'Survey Completed', 0, 0)
                    // this.props.navigation.navigate('ResultsScreen', { surveyResults: res })
                    this.props.navigation.pop()
                } else {
                this.setState({ currentQuestion: res, currentChoice: 0 })
                }
            })
    }

    showAnsers = () => {
        
        return this.state.currentQuestion.questionAnswers.map((answer, idx) => {

            if (answer.answerOrdinal === this.state.currentChoice) {
                return <TouchableHighlight onPress={() => { this.setState({ currentChoice: answer.answerOrdinal }); this.showAnsers() }} key={idx} style={styles.selectedButton}>
                    <Text style={styles.buttonText}>
                        {answer.answerDescription}
                    </Text>
                </TouchableHighlight>

            } else {
                return <TouchableHighlight onPress={() => {
                    this.setState({ currentChoice: answer.answerOrdinal });
                    this.showAnsers()}} key={idx} style={styles.unselectedButton}>
                    <Text style={styles.buttonText}>
                        {answer.answerDescription}
                    </Text>
                </TouchableHighlight>

            }
        })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
            { this.state.currentQuestion &&
                <View style={styles.questionAndAnswers}>
                    <Text style={styles.text}>
                        {`${this.state.currentQuestion.questionNumber}) `}  
                        {this.state.currentQuestion.questionDescription}
                    </Text>
                    <View>
                        {this.showAnsers()}
                    </View>
                    {this.state.currentChoice !==0 ?
                    <TouchableHighlight onPress={() => this.handleAnswerSubmit(this.state.currentChoice, this.state.currentQuestion)} style={styles.nextQuestionButton}>
                        <Text style={styles.nextText}>
                            Next
                        </Text>
                    </TouchableHighlight>
                    :
                    <View style={{height: 60}}>
                    </View>
                    }
                </View>
                }
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
        justifyContent: 'center'
    },
    questionAndAnswers: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    selectedButton: {
        backgroundColor: '#810000',
        borderRadius: 10,
        width: 300,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    unselectedButton: {
        backgroundColor: 'grey',
        opacity: .9,
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
        fontSize: 20
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30
    },
    nextQuestionButton: {
        backgroundColor: '#810000',
        borderRadius: 40,
        width: 80,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 20
    },
    nextText: {
        color: 'white',
        fontSize: 20
    }
});