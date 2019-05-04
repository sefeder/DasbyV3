import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Animated, Easing } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import LandingScreen from './screens/LandingScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import LogInScreen from './screens/LogInScreen.js';
import UserHomeScreen from './screens/UserHomeScreen.js';
import AdminSelectionScreen from './screens/AdminSelectionScreen.js';
import AdminChatScreen from './screens/AdminChatScreen.js';
import SurveyScreen from './screens/SurveyScreen.js';
import ResultsScreen from './screens/ResultsScreen.js';
import InfoScreen from './screens/InfoScreen.js';
import EmergencyButton from './components/EmergencyButton';
import MoreButton from './components/MoreButton';
import pushNotifications from './utils/notifications';

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
          headerLeft: null,
          gesturesEnabled: false
        })
      },
    UserHomeScreen:
      {
      screen: createBottomTabNavigator({
        Chat: {
          screen: UserHomeScreen,
          navigationOptions: ({ navigation }) => {
            return {
              tabBarIcon: ({ focused, horizontal, tintColor }) => (
                <Icon size={33} name='ios-chatboxes' color={tintColor} />
              )
            };
          }
        },
        Data:
        {
          screen: ResultsScreen,
          navigationOptions: ({ navigation }) => {
            return {
              tabBarIcon: ({ focused, horizontal, tintColor }) => (
                <Icon size={33} name='md-pulse' color={tintColor}/>
              )
            };
          }
        },
        Info:
        {
          screen: InfoScreen,
          navigationOptions: ({ navigation }) => {
            return {
              tabBarIcon: ({ focused, horizontal, tintColor }) => (
                <Icon size={33} name='ios-information-circle-outline' color={tintColor} />
              )
            };
          }
        },
      },
        {
          // order: ['HomePage', 'ProfilePage'],
          tabBarOptions: {
            activeTintColor: '#3377FF',
            inactiveTintColor: '#808080',
            // style: {
            //   backgroundColor: 'white',
            // }
          },
        },),
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Dashboard',
          headerLeft: (
            <EmergencyButton />
          ),
          gesturesEnabled: false,
          headerRight: (
            <MoreButton navigation={navigation} />
          ),
        };
      }
      },
      
    AdminSelectionScreen:
      {
        screen: AdminSelectionScreen,
        navigationOptions: ({ navigation }) => {
          return {
            headerTitle: 'Patient List',
            headerLeft: null,
            headerRight: (
              <MoreButton navigation={navigation}/>
            ),
            gesturesEnabled: false,
          };
        }
      },
    AdminChatScreen:
      {
      screen: createBottomTabNavigator({
        Data:
        {
          screen: ResultsScreen,
          navigationOptions: ({ navigation }) => {
            return {
              tabBarIcon: ({ focused, horizontal, tintColor }) => (
                <Icon size={33} name='md-pulse' color={tintColor} />
              )
            };
          }
        },
          Chat: {
            screen: AdminChatScreen,
            navigationOptions: ({ navigation }) => {
              return {
                tabBarIcon: ({ focused, horizontal, tintColor }) => (
                  <Icon size={33} name='ios-chatboxes' color={tintColor} />
                )
              };
            }
          },
          Info:
          {
            screen: InfoScreen,
            navigationOptions: ({ navigation }) => {
              return {
                tabBarIcon: ({ focused, horizontal, tintColor }) => (
                  <Icon size={33} name='ios-information-circle-outline' color={tintColor} />
                )
              };
            }
          },
        },
          {
            // order: ['HomePage', 'ProfilePage'],
            tabBarOptions: {
              activeTintColor: '#3377FF',
              inactiveTintColor: '#808080',
              // style: {
              //   backgroundColor: 'white',
              // }
            },
          },),
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: 'Patient Dashboard',
          headerRight: (
            <MoreButton navigation={navigation}/>
          ),
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
              <EmergencyButton />
            ),
          };
        }
      },

    initialRouteName: "LogInScreen"
  },
  {transitionConfig : () => ({
    transitionSpec: {
      // duration: 0,
      // timing: Animated.timing,
      // easing: Easing.step0,
    },
  })}
  
)

export default class App extends React.Component {
  componentDidMount(){
  }
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