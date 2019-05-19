import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Button, TouchableHighlight, ScrollView, FlatList, Dimensions, AsyncStorage, ART } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment';
import 'moment-timezone';
// import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
//========================================================================
// import React, { Component } from 'react';
// import { ART } from 'react-native';

const { Group, Shape, Surface, Circle } = ART;
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';
const d3 = {
    scale,
    shape,
};

//=========================================================================
//========================== Constants / Values ===========================
//=========================================================================

const window = Dimensions.get('window');
const yAxisWidth = 40;
const xAxisHeight = 30;
const graphHeight = window.height*0.35 - xAxisHeight

let yAxisLabelArray = []
for(let i=0; i<=100;i=i+20){
    yAxisLabelArray.push({
        yPosition: i,
        label: i
    })
}
const xScalePix = 40
const graphTopPadding = 10
const graphBottomPadding = 10
const yLabelHeight = (graphHeight-graphTopPadding-graphBottomPadding)/(yAxisLabelArray.length-1);
const yGridLinesArray = [0,10,20,30,40,50,60,70,80,90,100]
//=========================================================================

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
            
        const dummyData = [
            {
                date: 1,
                severity: 50
            },
            {
                date: 2,
                severity: 20
            },
            {
                date: 3,
                severity: 70
            },
            {
                date: 5,
                severity: 80
            },
            {
                date: 6,
                severity: 80
            },
            {
                date: 7,
                severity: 50
            },
            {
                date: 10,
                severity: 0
            },
            {
                date: 11,
                severity: 100
            },
            {
                date: 15,
                severity: 30
            },
        ]
        
        const numberOfPoints = dummyData.length
        const firstX = dummyData[0].date - 1
        const lastX = dummyData[numberOfPoints-1].date + 1
        let xViewDomainMin = firstX //x min value
        let xViewDomainMax = lastX  //x max value
        let xViewRangeMin = 0   //x min pixel length
        let xViewRangeMax = (lastX-firstX)*xScalePix //x max pixel length  
        // const lineChartData = this.props.dataArray.map(dataPoint=>dataPoint.severity)
        // console.log('lineChartData: ', lineChartData)
        // const axesSvg = { fontSize: 15, fill: 'grey' };
        // const verticalContentInset = { top: 7, bottom: 7 }
        // const xAxisHeight = 30
        // const yRange = scale.scaleLinear([0, 100], [0, 100]);
        // Get last item in the array.
        //============================
        const data = this.props.dataArray
        const lastDatum = data[data.length - 1];
        //=============================
        // Create our x-scale.
        const scaleX = d3.scale.scaleLinear()
            .domain([xViewDomainMin, xViewDomainMax])
            .range([xViewRangeMin, xViewRangeMax])
        // // Collect all y values.
        // const allYValues = data.reduce((all, datum) => {
        //     all.push(datum.temperatureMax);
        //     return all;
        // }, []);
        // // Get the min and max y value.
        // const extentY = d3Array.extent(allYValues);

        // Create our y-scale.
        const scaleY = d3.scale.scaleLinear()
            .domain([0, 100])
            .range([graphHeight-graphBottomPadding,graphTopPadding])
        const lineShape = d3.shape
            .line()
            .x(d => scaleX(d.date))
            .y(d => scaleY(d.severity));
        const linePath = lineShape(dummyData)
        // const dAttribute={
        //     path: linePath
        // }
        let xAxisLabelArray = []
        for(let i=firstX; i<lastX;i++){
            xAxisLabelArray.push({
                xPosition: i,
                label: i
            })
        }
        let yGridLinesPathArray = []
        for(let i=0;i<yGridLinesArray.length;i++){
            const path = lineShape([
                {date: firstX, severity: yGridLinesArray[i]},
                {date: lastX, severity: yGridLinesArray[i]}
            ])
            yGridLinesPathArray.push(path)
        }
        
        return (
            // <View style={{flexDirection: 'row', height: 440}}>
            //     <YAxis
            //         data={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            //         style={{ paddingBottom: xAxisHeight, height: 400, backgroundColor: 'white'}}
            //         contentInset={verticalContentInset}
            //         svg={axesSvg}
            //         formatLabel={value=>`${value}`}
            //         // numberOfTicks={10}
            //         // ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            //     />
            //     <ScrollView style={{height:400}} horizontal>
            //         <View style={styles.container}>
            //             <LineChart
            //                 style={{height: 400, width: 500}}
            //                 data={lineChartData}
            //                 svg={{ stroke: 'rgba(134, 65, 244, 1)', strokeWidth: 3}}
            //                 contentInset={{top: 40, bottom: 40, left: 10, right: 10}}
            //                 // yScale={scale.scaleLinear}
            //                 yMin={0}
            //                 yMax={100}
            //                 // numberOfTicks={10}
                                                        
            //             >
            //                 <Grid/>
            //             </LineChart>
            //             <XAxis
            //                 style={{ marginHorizontal: -10, height: xAxisHeight }}
            //                 data={this.props.dataArray}
            //                 formatLabel={(value, index) => index+1}
            //                 contentInset={{ top: 40, left: 20, right: 20 }}
            //                 svg={axesSvg}
            //             />
            //         </View>
            //     </ScrollView>
            // </View>
            //============================================================================================
            <View
                style={styles.graphContainer}
            >
                <View
                     style={styles.yAxisLabelsContainer} 
                >
                    {yAxisLabelArray.map((tick, index) => {
                            return (
                            <View key={index} style={styles.tickLabelY}>
                                <Text style={styles.tickLabelYText}>
                                    {tick.label}
                                </Text>
                                <View style={styles.tickLabelYLine}>

                                </View>
                                
                            </View>
                            );
                        })}
                </View>
                <View
                    style={styles.yAxisLine}
                >

                </View>
                <ScrollView 
                    style={styles.graphScrollView} 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View
                        style={styles.surfaceAndxAxisContainer} 
                    >
                        <Surface 
                            width={xViewRangeMax} 
                            height={graphHeight}
                            style={styles.graphSurface}
                        >
                            <Group x={0} y={0}>
                                <Shape d={linePath} stroke="#000" strokeWidth={2.5} />
                                {yGridLinesPathArray.map((gridLinePath,index)=>{
                                    return(
                                        <Shape key={index} d={gridLinePath} stroke="#000" strokeWidth={0.5} /> 
                                    )
                                })}
                            </Group>

                        </Surface>
                        {dummyData.map((datum, index)=>  {
                                    const dotStyle = {};
                                    dotStyle.position = "absolute"
                                    dotStyle.bottom = graphHeight-scaleY(datum.severity)+xAxisHeight-25;
                                    dotStyle.left = scaleX(datum.date)-25;
                                    return [
                                        <TouchableHighlight
                                            key={index} 
                                            underlayColor="rgba(0,0,0,0)"
                                            style={[dotStyle, styles.dotContainers]}
                                            onPress={()=>console.log('Ouch')}
                                        >
                                            <View
                                                style={styles.dots}
                                            />
                                        </TouchableHighlight>
                                    ]
                                })}
                        <View 
                            key={'xAxisLabelsContainer'}
                            style={styles.xAxisLabelsContainer}
                        >
                        {xAxisLabelArray.map((tick, index) => {
                            return (
                            <View key={index} style={styles.tickLabelX}>
                                <Text style={styles.tickLabelXText}>
                                    {tick.label}
                                </Text>
                            </View>
                        );
                        })}
                        </View>
                    </View>
                </ScrollView>
            </View>
            
            // <View style={{ flexDirection: 'row', height: 440 }}>
            //     <ScrollView style={{height:400}} horizontal>
                
            //     </ScrollView>
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    // container: {
    //     // s: 1.2,
    //     justifyContent: "center",
    //     alignItems: "stretch",
    //     backgroundColor: 'white',
    // },
    graphContainer:{
        flexDirection: "row",
        marginTop: 20
    },
    graphSurface: {
        // backgroundColor: "purple",
    },
    yAxisLabelsContainer:{
        flexDirection: "column-reverse",
        width: yAxisWidth,
        height: graphHeight,
        alignItems: "flex-end",
        position: "relative",
        bottom: (yLabelHeight/2) - graphBottomPadding,
        paddingRight: 5,

    },
    yAxisLine:{
        height: graphHeight,
        width: 2,
        borderRightWidth: 1,
        shadowOffset: {height:0, width: 2},
        shadowRadius: 2,
        shadowColor: "black",
        shadowOpacity: 1,
        zIndex: 3
    },
    graphScrollView: {
        height: graphHeight + xAxisHeight,
        width: window.width - yAxisWidth,
    },
    surfaceAndxAxisContainer:{
        flexDirection: "column",
    },
    xAxisLabelsContainer:{
        height: xAxisHeight,
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        paddingTop: 5
    },
    tickLabelY:{
        flexDirection: "row",
        alignItems: "center",
        height: yLabelHeight,
        fontSize: 16,
    },
    tickLabelYText:{
        fontSize: 16,
    },
    tickLabelYLine:{
        backgroundColor: "black",
        right: -7,
        width: 5,
        height: 2,
    },
    tickLabelX: {
        position: 'relative',
        bottom: 0,
        right: xScalePix/2,
        width: xScalePix, 
        alignItems: "center",
        // textAlign: 'center',
      },
    tickLabelXText: {
        fontSize: 16,
      },
    dotContainers: {
        // position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: "rgba(0,0,0,0)",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center", 
    },
    dots: {
        // position: 'absolute',
        width: 10,
        height: 10,
        backgroundColor: "orange",
        borderRadius: 100, 
    },

});