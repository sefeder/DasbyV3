import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result';
import ResultsGraph from '../components/ResultsGraph'



    export default class ResultsScreen extends Component {
        
    state = {
        results: null,
        dataArray: [],
        currentIndex: 0,
        currentPoints: [],
        selectedDatum: {},
        lockedOut: false
    }

    componentDidMount() {
        console.log("hit componentDidMount")
        this.adminOrUser();
    }

    adminOrUser = () => {
        AsyncStorage.getItem('adminSelectedPatientUpi', (err, result) => {
            if (err) console.log(err)
            //if admin is currently logged in
            if (result !== null) {
                this.getAndSetResults(JSON.parse(result))
            //else user is logged in
            } else {
                AsyncStorage.getItem('userInfo', (err, result) => {
                    this.getAndSetResults(JSON.parse(result).user.upi)
                })
            }
        })  
    }

    getAndSetResults = (patientUpi) => {
        api.getResults(patientUpi, "Depression")
            .then(results => {
                const dataArray = this.createDataArray(results)
                console.log('results from RS getResults: ', results)
                this.setState({ results, dataArray })
            })
    }

        determineBackgroundColor = severity => {
            let score = parseInt(severity)
            switch (true) {
                case (score < 50):
                    return 'rgba(255, 255, 255, 1)' //'rgba(118, 178, 236, 1)'
                case (score >= 50 && score <= 65):
                    return 'rgba(217, 255, 255, 1)' //'rgba(78, 142, 204, 1)'
                case (score > 65 && score <= 75):
                    return 'rgba(153, 246, 255, 1)'
                case (score > 75):
                    return 'rgba(83, 178, 222, 1)'
                default:
                    break;
            }
        }

    createDataArray = (results) => {
        const dataArray = results.slice(0).reverse().map((result, idx, array) => {
            return { date: result.createdAt, severity: result.severity }
        })
        return dataArray;

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <ResultsGraph dataArray={this.state.dataArray}/>
                <ScrollView style={{flex:1, backgroundColor: 'white'}}>
                    { this.state.results && this.state.results.map((result, idx, resultArray) => {
                        return(
                            <Result key={idx} prevSeverity={resultArray[idx + 1] !== undefined ? resultArray[idx + 1].severity : null} result={result} date={result.createdAt}/>
                        )
                    })}
                </ScrollView>
                <MenuBar navigation={this.props.navigation} screen={'data'} />
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
        alignItems: 'center'
    },
    container: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: 'white',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 7,
        shadowOffset: {
            height: 1,
            width: 1
        },
        zIndex: 10,
    }

});