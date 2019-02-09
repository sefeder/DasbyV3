import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryScatter, VictoryZoomContainer, VictoryVoronoiContainer, VictoryAxis, VictoryStack, VictoryArea } from 'victory-native';
import moment from 'moment';
import 'moment-timezone';
import Svg from 'react-native-svg'


export default class ResultsGraph extends Component {

    state = {
        dataArray: this.props.dataArray
    }

    componentDidMount() {
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

    handlePointTouch = (points, props) => {
        if (this.state.lockedOut) { return }
        if (points.length <= 0) { return }
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
                this.highlightPoint(this.props.dataArray, this.state.currentIndex)
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
            <View style={styles.container}>
                <VictoryChart
                    style={{
                        alignItems: 'stretch'
                    }}
                    containerComponent={
                        <VictoryZoomContainer
                            allowPan={true}
                            allowZoom={false}
                            zoomDomain={{ x: [this.props.dataArray.length - 5, this.props.dataArray.length + 0.5] }}
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
                        barWidth={30}
                        alignment="middle"
                        domain={{ x: [0, this.props.dataArray.length + 0.5] }}
                        // barRatio={0.8}
                        // labels={this.state.results && this.state.results.map((result, idx) => {
                        //     return `${result.severity}`
                        // })}
                        data={this.props.dataArray}
                        labels={(d) => d.severity === 0 ? 0 : null}
                        x="date"
                        y="severity"
                    />
                </VictoryChart>

            </View>
        )
    }
}

const styles = StyleSheet.create({
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