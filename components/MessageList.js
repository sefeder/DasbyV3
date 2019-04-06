import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { ScrollView, StyleSheet, RefreshControl, FlatList, Text, View, ActivityIndicator } from 'react-native';
import TypingIndicator from './TypingIndicator'

class MessageList extends Component {


    handleEndReached = () => {
        if (!this.props.loading && !this.onEndReachedCalledDuringMomentum){
            this.props.getOlderMessages()
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    render() {
        const messages = this.props.messages.slice().reverse()
        return (
            <View style={styles.messageList}>
                {this.props.loading && <ActivityIndicator />}
                <FlatList
                    ref={a => this.flatList = a}
                    inverted
                    data={messages}
                    onEndReached={this.handleEndReached}
                    onEndReachedThreshold={0.05}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    keyExtractor={(item) => item.index.toString()}
                    renderItem={({item, index})=>(
                        <Message
                            sameAsPrevAuthor={item.sameAsPrevAuthor}
                            upi={this.props.upi} 
                            currentMessageIndex={index}
                            lastMessageIndex={this.props.messages.length-1}  
                            {...item}  
                            memberArray={this.props.memberArray}
                        />
                    )}
                />
                <TypingIndicator prevMessage={this.props.messages && this.props.messages[this.props.messages.length - 1]} memberTyping={this.props.memberTyping} isTyping={this.props.isTyping} upi={this.props.upi} memberArray={this.props.memberArray} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    messageList: {
        alignSelf: 'stretch',
        flex: 1
    }
});

export default MessageList