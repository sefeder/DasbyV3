import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LandingScreen from './screens/LandingScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import LogInScreen from './screens/LogInScreen.js';
import UserHomeScreen from './screens/UserHomeScreen.js';
import AdminSelectionScreen from './screens/AdminSelectionScreen.js';
import AdminChatScreen from './screens/AdminChatScreen.js';
import SurveyScreen from './screens/SurveyScreen.js';
import ResultsScreen from './screens/ResultsScreen.js';
import InfoScreen from './screens/InfoScreen.js';
import EmergenyButton from './components/EmergencyButton';

const RootStack = createStackNavigator(
  {
    LandingScreen: 
      {
        screen: LandingScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Welcome to Dasby',
        })
      },
    SignUpScreen:
      {
        screen: SignUpScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Sign Up',
        })
      },
    LogInScreen:
      {
        screen: LogInScreen,
        navigationOptions: ({ navigation }) => ({
          title: 'Log In',
          headerLeft: null
        })
      },
    UserHomeScreen:
      {
        screen: UserHomeScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'User Home',
            headerLeft: null,
          };
        }
      },
    AdminSelectionScreen:
      {
        screen: AdminSelectionScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Channel Selector',
            headerLeft: null,
            headerRight: (
              <Button
                onPress={() => {
                  AsyncStorage.clear()
                  navigation.navigate('LogInScreen')
                }}
                title="Log Out"
              />
            ),
          };
        }
      },
    AdminChatScreen:
      {
        screen: AdminChatScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Admin Chat Home',
          };
        }
      },
    SurveyScreen:
      {
        screen: SurveyScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Survey',
            headerRight: (
              <EmergenyButton />
            ),
          };
        }
      },
    ResultsScreen:
      {
        screen: ResultsScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Results',
          };
        }
      },
    InfoScreen:
      {
        screen: InfoScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Information',
          };
        }
      },

    initialRouteName: "LandingScreen"
  },
  {transitionConfig : () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  }),
}
  
)

export default class App extends React.Component {
  render() {
    return (
      <RootStack/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// <View style={styles.container}>
//   {/* <Text>Open up App.js to start working on your app!</Text>
//         <Text>Changes you make will automatically reload.</Text>
//         <Text>Shake your phone to open the developer menu.</Text> */}
//   <LandingScreen />
// </View>