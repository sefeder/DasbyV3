import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import TypingIndicator from './TypingIndicator'

class MessageList extends Component {
    // static propTypes = {
    //     messages: PropTypes.arrayOf(PropTypes.object)
    // }

    // static defaultProps = {
    //     messages: [],
    // }
    state = {
        refreshing: false
    }

    componentDidMount() {
        // this.scrollView.scrollToEnd({ animated: false })
    }

    componentDidUpdate() {
        if (!this.state.refreshing){
            this.scrollView.scrollToEnd({ animated: true })
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        setTimeout(() => {
            this.setState({ refreshing: false })
        }, 4000);
        // this.props.onRefresh()
    }

    render() {
        return (
            <ScrollView
                style={styles.messageList}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollView.scrollToEnd({ animated: true });
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }>
                {this.props.messages.map((message, i, array) => (
                    <Message  
                        sameAsPrevAuthor={message.sameAsPrevAuthor} 
                        upi={this.props.upi} 
                        currentMessageIndex={i}
                        lastMessageIndex={this.props.messages.length-1} 
                        key={i} 
                        {...message} 
                        memberArray={this.props.memberArray} 
                    />
                ))}
                <TypingIndicator prevMessage={this.props.messages && this.props.messages[this.props.messages.length-1]} memberTyping={this.props.memberTyping} isTyping={this.props.isTyping} upi={this.props.upi} memberArray={this.props.memberArray} />
            </ScrollView>
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