
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoadingScreen extends Component {

    render(){
        return(
            <Spinner
                visible={true}
                textContent={'Loading...'}
                textStyle={{ color: 'rgba(91, 141, 249, 1)' }}
                cancelable={false}
                color={'#3377FF'}
                // animation={'fade'}
                overlayColor={'rgba(255, 255, 255, 1)'}
            />
        )
    }
}