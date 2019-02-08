import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EmergencyButton from './EmergencyButton'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'

class MenuBar extends Component {

    state = {
        role: null
    }

    componentDidMount() {
        AsyncStorage.getItem('userInfo', (err, result)=>{
            if(result !== null){
                this.setState({role: JSON.parse(result).user.role})
            }
        })
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    render() {
        return (
            <View>
            { this.state.role==='user' ?

            <View style={styles.menu}>

                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('UserHomeScreen')
                }}>
                    <View style={styles.iconTextView}>
                        <Icon style={{
                            height: 30, width: 27
                        }} size={33} color={this.props.screen === 'chat' ? '#3377FF':'#808080'} name='ios-chatboxes' />
                        <Text style={{ color: this.props.screen === 'chat'? '#3377FF' : '#808080', fontSize: 10.5 }}> Chat </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('ResultsScreen')
                }}>
                    <View style={styles.iconTextView}>
                        <Icon style={{
                            height: 30, width: 28.5
                        }} size={33} color={this.props.screen === 'data' ? '#3377FF' : '#808080'} name='md-pulse' />
                        <Text style={{ color: this.props.screen === 'data' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Data </Text>
                    </View>
                </TouchableHighlight>
                <EmergencyButton/>
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
                            }} size={37} color={'#808080'} name='ios-menu' />
                            <Text style={{ color: '#808080', fontSize: 10.5 }}> More </Text>
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
                                    this.props.handleNewSurvey()
                                }
                                if (buttonIndex === 1) {
                                    this.props.navigation.navigate('InfoScreen')
                                }
                                if (buttonIndex === 2) {
                                    AsyncStorage.clear()
                                    this.props.navigation.navigate('LogInScreen')
                                }
                            }
                        }
                    />
                </View>    
            </View>

                :

            <View style={styles.menu}>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('AdminSelectionScreen')
                }}>
                    <View style={styles.iconTextView}>
                        <Icon style={{
                            height: 34, width: 30
                        }} size={37} color='#808080' name='ios-people' />
                        <Text style={{ color: '#808080', fontSize: 10.5 }}> Patients </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('AdminChatScreen')
                }}>
                    <View style={styles.iconTextView}>
                        <Icon style={{
                            height: 30, width: 27
                        }} size={33} color={this.props.screen === 'chat' ? '#3377FF' : '#808080'} name='ios-chatboxes' />
                        <Text style={{ color: this.props.screen === 'chat' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Chat </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'rgba(255, 255, 255, 0)'} onPress={() => {
                    this.props.navigation.navigate('ResultsScreen')
                }}>
                    <View style={styles.iconTextView}>
                        <Icon style={{
                            height: 30, width: 28.5
                        }} size={33} color={this.props.screen === 'data' ? '#3377FF' : '#808080'} name='md-pulse' />
                        <Text style={{ color: this.props.screen === 'data' ? '#3377FF' : '#808080', fontSize: 10.5 }}> Data </Text>
                    </View>
                </TouchableHighlight>
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
                            }} size={37} color={'#808080'} name='ios-menu' />
                            <Text style={{ color: '#808080', fontSize: 10.5 }}> More </Text>
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
                                this.props.navigation.navigate('LogInScreen')
                            }
                        }
                        }
                    />
                </View>
            </View>
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    menu: {
        display: 'flex',
        borderTopColor: 'black',
        borderTopWidth: .2,
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height * .062,
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        elevation: 1
    },
    iconTextView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default MenuBar