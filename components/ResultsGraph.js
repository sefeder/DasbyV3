import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLine, VictoryScatter, VictoryZoomContainer, VictoryVoronoiContainer, VictoryAxis, VictoryStack, VictoryArea, createContainer } from 'victory-native';
import moment from 'moment';
import 'moment-timezone';
import Svg from 'react-native-svg'

const VictoryZoomVoronoiContainter = createContainer("zoom", "voronoi");

export default class ResultsGraph extends Component {

    state = {
        dataArray: [],
        currentIndex: 0,
        currentPoints: [],
        selectedDatum: {},
        lockedOut: false
    }

    // componentDidMount() {
    // }

    // componentWillReceiveProps(nextProps) {
    //     // if (nextProps.dataArray !== this.props.dataArray) {
    //         this.setState({ dataArray: nextProps.dataArray })
    //     // }
    // }

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
            newIndex = (this.props.dataArray.length - 1)
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
                    containerComponent={
                        <VictoryZoomVoronoiContainter
                            // activateData={false}
                            // radius={100}
                            allowPan={true}
                            allowZoom={false}
                            zoomDomain={{ x: [this.props.dataArray.length - 5, this.props.dataArray.length + 0.5] }}
                            voronoiDimension="x"
                            onTouchStart={() => this.setState({ lockedOut: true })}
                            onTouchEnd={() => this.setState({ lockedOut: false })}
                            onActivated={this.handlePointTouch}

                        />
                    }>
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
                    <VictoryStack
                        disable={true}
                    >
                        <VictoryArea
                            data={[
                                { x: 0, y: 49 },
                                { x: this.props.dataArray === null ? 1 : this.props.dataArray.length + 1, y: 49 },
                            ]}
                            style={{ data: { fill: 'rgba(255, 255, 255, 1)' } }} />

                        <VictoryArea
                            data={[
                                { x: 0, y: 16 },
                                { x: this.props.dataArray === null ? 1 : this.props.dataArray.length + 1, y: 16 },
                            ]}
                            style={{ data: { fill: 'rgba(217, 255, 255, 1)' } }} />
                        <VictoryArea
                            data={[
                                { x: 0, y: 10 },
                                { x: this.props.dataArray === null ? 1 : this.props.dataArray.length + 1, y: 10 },
                            ]}
                            style={{ data: { fill: 'rgba(153, 246, 255, 1)' } }} />
                        <VictoryArea
                            data={[
                                { x: 0, y: 25 },
                                { x: this.props.dataArray === null ? 1 : this.props.dataArray.length + 1, y: 25 },
                            ]}
                            style={{ data: { fill: 'rgba(83, 178, 222, 1)' } }} />
                    </VictoryStack>
                    {this.props.dataArray.length > 0 && <VictoryGroup
                        disable={true}
                        width={Dimensions.get('window').width * .96}
                        data={this.props.dataArray}
                        x="date"
                        y="severity"
                    >
                        <VictoryLine
                        />
                        <VictoryScatter
                        // style={{
                        //     data: {
                        //         fill: (d) => (this.state.currentPoints[0] && d.date === this.state.currentPoints[0].date) ?  "blue" : "grey",
                        //     }
                        // }}
                        />
                    </VictoryGroup>}
                    {/* <VictoryGroup>
                            <VictoryLine
                                style={{
                                    data: { stroke: "yellow", strokeWidth: 1 },
                                    labels: { fill: 'yellow' }
                                }}
                                labels={["        avg"]}
                                data={[
                                    { x: 0, y: this.state.averageSeverity },
                                    { x: this.props.dataArray === null ? 1 : this.props.dataArray.length + 1, y: this.state.averageSeverity }
                                ]}
                            />
                        </VictoryGroup> */}
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