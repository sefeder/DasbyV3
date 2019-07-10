import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import moment from 'moment';
import 'moment-timezone';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

class Result extends Component {

    state = {
        contentVisible: false
    }

    componentDidMount() {
    }

    capitalizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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

    determineTriangle = (prevSeverity, severity) => {
        if (prevSeverity === null || prevSeverity === severity) {
            return < Icon size={37} color='black' name={'minus'} />
        }
        else if (prevSeverity > severity) {
            return < Icon size={37} color='green' name={'triangle-down'} />
        }
        else if (prevSeverity < severity) {
            return < Icon size={37} color='red' name={'triangle-up'} />
        }
    }

    render() {
        return (
            <View style={{
                marginTop: 10,
                width: Dimensions.get('window').width,
                backgroundColor: this.determineBackgroundColor(this.props.result.severity),
                // borderBottomColor: 'black',
                // borderBottomWidth: this.state.contentVisible ? 0 : .5,
                borderRadius: 25,
                paddingLeft: 10,
                paddingRight: 10,
                shadowColor: "#000000",
                shadowOpacity: 0.8,
                shadowRadius: 3,
                shadowOffset: {
                    height: 1,
                    width: 1
                }, 
            }}
            >
                <TouchableHighlight
                    style={{
                        height: Dimensions.get('window').height * .055
                    }}
                    underlayColor={'rgba(255, 255, 255, 0)'}
                    onPress={() => this.setState({ contentVisible: !this.state.contentVisible })}
                >
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                        }}
                    >
                        <View style={styles.resultHeader}>
                            <Text style={{
                                fontSize: 20,
                                marginLeft: 5
                                }}
                            >
                            {/* Don't understand .utcOffset() below works for central time though*/}
                            {moment(this.props.date).format('MM/DD/YY')} 
                            </Text>
                            {/* <Text style={{ fontSize: 16, marginLeft: 5 }}>
                            ({moment(this.props.date).utcOffset(0, true).fromNow()})
                                </Text> */}
                            <Text style={{
                                fontSize: 25,
                                fontWeight: 'bold',
                                marginLeft: 15, color: 'black'
                                }}
                            >
                                {this.props.result.severity}
                            </Text>
                            <View style={{ marginLeft: 10 }}>
                                {this.determineTriangle(this.props.prevSeverity, this.props.result.severity)}
                            </View>
                        </View>
                        <MaterialIcon size={35} color='black' name={'more-horiz'} />
                    </View>
                </TouchableHighlight>
                    {this.state.contentVisible &&
                    <Animatable.View style={{
                        // backgroundColor: this.determineBackgroundColor(this.props.result.severity),
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        // borderBottomColor: 'black',
                        // borderBottomWidth: 2
                        borderRadius: 25
                        }}
                    >
                        <Text style={{
                            fontSize: 22,
                            marginLeft: 10,
                            color: 'black'
                            }}
                        >
                            {this.capitalizeFirstLetter(this.props.result.category)} {this.props.result.category === 'normal' ? null : 'Depression'}
                        </Text>
                    </Animatable.View>
                    }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    resultHeader: {
        display: 'flex',
        flexDirection: 'row',
        // marginBottom: 10,
        alignItems: 'center',
        
    },
    // resultContent: {
    //     backgroundColor: this.determineBackgroundColor(this.props.result.severity),
    //     display: 'flex',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderBottomColor: 'black',
    //     borderBottomWidth: 1.5
    // }
});

export default Result