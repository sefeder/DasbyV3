import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import 'moment-timezone';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

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

    render() {
        const lineChartData = this.props.dataArray.map(dataPoint=>dataPoint.severity)
        const axesSvg = { fontSize: 15, fill: 'grey' };
        const verticalContentInset = { top: 7, bottom: 7 }
        const xAxisHeight = 30
        return (
            <View style={{flexDirection: 'row', height: 440}}>
                <YAxis
                    data={lineChartData}
                    style={{ paddingBottom: xAxisHeight, height: 400, backgroundColor: 'white'}}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <ScrollView style={{height:400}} horizontal>
                    <View style={styles.container}>
                        <LineChart
                            style={{height: 400, width: 1000}}
                            data={lineChartData}
                            svg={{ stroke: 'rgba(134, 65, 244, 1)', strokeWidth: 3}}
                            contentInset={{top: 20, bottom: 20, left: 5, right: 5}}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{ marginHorizontal: -10, height: xAxisHeight }}
                            data={this.props.dataArray}
                            formatLabel={(value, index) => index+1}
                            contentInset={{ top: 40, left: 20, right: 20 }}
                            svg={axesSvg}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // s: 1.2,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: 'white',
    }

});