import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../utils/api';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryScatter, VictoryZoomContainer, VictoryVoronoiContainer, VictoryAxis, VictoryStack, VictoryArea } from 'victory-native';
import MenuBar from '../components/MenuBar';
import moment from 'moment';
import 'moment-timezone';
import Result from '../components/Result';
import Svg from 'react-native-svg'



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
        AsyncStorage.getItem('currentUserUpi', (err,result)=>{
            if (err) console.log(err)
            //below is only true if admin is currently logged in
            if (result !== null) {
                api.getResults(JSON.parse(result), "Depression")
                    .then(results => {
                        const dataArray = this.createDataArray(results)
                        console.log('results from RS getResults: ', results)
                        this.setState({ results, dataArray },
                            () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                    })
            //below pertains to users being logged in
            } else {
                AsyncStorage.getItem('surveyResults', (err, result) => {
                    if (err) console.log(err)
                    this.setState({ results: JSON.parse(result) },
                    () => {
                        AsyncStorage.getItem('userInfo', (err, result) => {
                            api.getResults(JSON.parse(result).user.upi, "Depression")
                            .then(results => {
                                const dataArray = this.createDataArray(results)
                                console.log('results from RS getResults: ', results)
                                this.setState({ results, dataArray },
                                    () => AsyncStorage.setItem('surveyResults', JSON.stringify(this.state.results)))
                            })
                        })
                    })
                })
            }
        })  
    }

    determineBackgroundColor = severity => {
        let score = parseInt(severity)
        switch (true) {
            case (score < 50):
                return 'rgba(156, 201, 241, 1)' //'rgba(118, 178, 236, 1)'
                break;
            case (score >= 50 && score <= 65):
                return 'rgba(90, 150, 240, 1)' //'rgba(78, 142, 204, 1)'
                break;
            case (score > 65 && score <= 75):
                return 'rgba(48, 114, 177, 1)'
                break;
            case (score > 75):
                return 'rgba(11, 90, 167, 1)'
                break;

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

    handlePointTouch = (points, props) => {
        if(this.state.lockedOut){return}
        if(points.length <=0 ){return}
        console.log("hitting handlePointTouch. 'points' is: ", points)
        console.log("lockedOut:", this.state.lockedOut)
        console.log("down here!")
        let newIndex
        if (points.length > 2 && points[0].eventKey === 1) {
            newIndex = (this.state.results.length - 1)
        } else if (points.length > 2 && points[0].eventKey === 0) {
            newIndex = 0
        } else {
            newIndex = points[0].eventKey
        }
        this.setState({
            currentPoints: points,
            currentIndex: newIndex
        },
            () => {
                console.log('this.state.currentPoints: ', this.state.currentPoints)
                console.log('props: ', props)
                this.highlightPoint(this.state.dataArray, this.state.currentIndex)
            })
    }


    highlightPoint = (data, highlightIndex) => {
        console.log("hitting highlightPoint")
        const newDataArray = data.map((point, idx, array) => {
            if (idx === highlightIndex) {
                return {
                    date: point.date,
                    severity: point.severity,
                    size: 8,
                    fill: 'blue'
                }
            }
            else {
                return {
                    date: point.date,
                    severity: point.severity,
                    size: 3,
                    fill: 'grey'
                }
            }
        })
        this.setState({ dataArray: newDataArray })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.app}>
                <View style={styles.container}>
                    <VictoryChart
                        style={{
                            alignItems: 'stretch'
                        }}
                        containerComponent={
                            <VictoryZoomContainer
                            allowPan={true}
                            allowZoom={false}
                                zoomDomain={{ x: [this.state.dataArray.length - 5, this.state.dataArray.length+0.5]}}
                            />
                        }
                    >
                            <VictoryAxis
                            independentAxis
                            tickFormat={(t) => `${moment(t).format('MM/DD/YY')}`}
                            style={{ 
                                tickLabels: { 
                                    angle: -38,
                                    fontSize: 14,
                                    verticalAnchor: 'start',
                                    padding: 18
                                }
                            }}
                            />
                            <VictoryAxis
                            dependentAxis
                            label="Severity"
                            style={{
                                axisLabel: {
                                    fontSize: 18,
                                },
                                tickLabels: {
                                    padding: 3
                                }
                            }}
                            />
                            <VictoryBar
                            name="bar"
                            style={{
                                data: {
                                    fill: (d) => this.determineBackgroundColor(d.severity),
                                    stroke: 'black'
                                }
                            }}
                            // animate={{
                            //     duration: 2000
                            // }}
                            events={[{
                                target: 'data',
                                childName:["bar"],
                                eventHandlers: {
                                    onPressIn: (event) => {
                                        console.log('event: ', event)
                                        return [
                                            {
                                                target: 'data',
                                                eventKey: "all",
                                                mutation: (props) => {
                                                    return {style: {fill: 'green'}}
                                                }
                                            },
                                            {
                                                target: 'data',
                                                mutation: (props) => {
                                                    console.log('props: ', props)
                                                    this.setState({selectedDatum: props.datum})
                                                    const fill = props.style && props.style.fill;
                                                    return fill === 'black' ? null : { style: { fill: 'black' } }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }]}
                            barWidth={30}
                            alignment="middle"
                            domain={{ x: [0, this.state.dataArray.length + 0.5]}} 
                            // barRatio={0.8}
                            // labels={this.state.results && this.state.results.map((result, idx) => {
                            //     return `${result.severity}`
                            // })}
                            data={this.state.dataArray}
                            labels={(d) => d.severity === 0 ? 0 : null}
                            x="date"
                            y="severity"
                            />
                        </VictoryChart>
                    
                </View>
                <ScrollView style={{flex:1}}>
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