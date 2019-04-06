import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import { connect } from "react-redux";
import { clearStore } from "../redux/actions";
import Icon from 'react-native-vector-icons/Ionicons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

function mapDispatchToProps(dispatch) {
    return {
        clearStore: () => dispatch(clearStore()),
    };
}

function mapStateToProps(reduxState) {
    return {
        user: reduxState.mainReducer.user,
    };
}


class ConnectedMoreButton extends Component {

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    render() {
        return (
            <View>
                {this.props.user.role === 'user'?
                <View>
                    <TouchableHighlight
                        underlayColor={'rgba(255, 255, 255, 0)'}
                        onPress={() => {
                            this.showActionSheet()
                        }}
                    >
                        <View style={styles.iconTextView}>
                            <Icon style={{
                                height: 33, width: 28.5
                            }} size={37} name='ios-more' />
                        </View>
                    </TouchableHighlight>
                    <ActionSheet
                        handleNewSurvey={this.props.handleNewSurvey}
                        ref={o => this.ActionSheet = o}
                        title={<Text>OPTIONS</Text>}
                        options={[
                            'Take a Survey',
                            'Study Info',
                            'Log Out',
                            'Cancel'
                        ]}
                        cancelButtonIndex={3}
                        destructiveButtonIndex={3}
                        onPress={(buttonIndex) => {
                            console.log('button clicked :', buttonIndex);
                            if (buttonIndex === 0) {
                                this.props.navigation.navigate('SurveyScreen', { upi: this.props.user.upi})
                            }
                            if (buttonIndex === 1) {
                                this.props.navigation.navigate('InfoScreen')
                            }
                            if (buttonIndex === 2) {
                                AsyncStorage.clear()
                                this.props.clearStore()
                                // persistor.purge()
                                this.props.navigation.navigate('LogInScreen')

                            }
                        }
                        }
                    />
                </View>
                : 
                <View>
                    <TouchableHighlight
                        underlayColor={'rgba(255, 255, 255, 0)'}
                        onPress={() => {
                            this.showActionSheet()
                        }}
                    >
                        <View style={styles.iconTextView}>
                            <Icon style={{
                                height: 33, width: 28.5
                            }} size={37} name='ios-menu' />
                        </View>
                    </TouchableHighlight>
                    <ActionSheet
                        handleNewSurvey={this.props.handleNewSurvey}
                        ref={o => this.ActionSheet = o}
                        title={<Text>OPTIONS</Text>}
                        options={
                            [
                                'Study Info',
                                'Log Out',
                                'Cancel'
                            ]
                        }
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={(buttonIndex) => {
                            console.log('button clicked :', buttonIndex);
                            if (buttonIndex === 0) {
                                this.props.navigation.navigate('InfoScreen')
                            }
                            if (buttonIndex === 1) {
                                AsyncStorage.clear()
                                this.props.clearStore()
                                // persistor.purge()
                                this.props.navigation.navigate('LogInScreen')
                            }
                        }
                        }
                    />
                </View>
                }
            </View> 
        )
    }
}

const styles = StyleSheet.create({
    iconTextView: {
        marginRight: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const MoreButton = connect(mapStateToProps, mapDispatchToProps)(ConnectedMoreButton);
export default MoreButton