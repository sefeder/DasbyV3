import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { ScrollView, StyleSheet, RefreshControl, FlatList, Text, View, ActivityIndicator } from 'react-native';
import TypingIndicator from './TypingIndicator'

class MessageList extends Component {
    state = {
        isListScrolled: false
    }
    // static propTypes = {
    //     messages: PropTypes.arrayOf(PropTypes.object)
    // }

    // static defaultProps = {
    //     messages: [],
    // }

    componentDidMount() {
        // this.scrollView.scrollToEnd({ animated: false })
    }

    componentDidUpdate() {
        // if (!this.state.refreshing){
        //     this.scrollView.scrollToEnd({ animated: true })
        // }
    }

    handleEndReached = () => {
        if(this.state.isListScrolled){
            this.props.getOlderMessages()
            this.setState({isListScrolled:false})
        }
    }

    render() {
        const messages = this.props.messages.slice().reverse()
        return (
            <View style={styles.messageList}>
                {this.props.loading && <ActivityIndicator />}
                <FlatList
                    inverted
                    data={messages}
                    onEndReached={this.handleEndReached}
                    onEndReachedThreshold={0.05}
                    keyExtractor={(item, index) => item.index.toString()}
                    onScrollEndDrag={()=>this.setState({isListScrolled: true})}
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
            // <ScrollView
            //     style={styles.messageList}
            //     ref={ref => this.scrollView = ref}
            //     onContentSizeChange={(contentWidth, contentHeight) => {
            //         this.scrollView.scrollToEnd({ animated: true });
            //     }}
            //     refreshControl={
            //         <RefreshControl
            //             refreshing={this.state.refreshing}
            //             onRefresh={this.onRefresh}
            //         />
            //     }>
            //     {this.props.messages.map((message, i, array) => (
            //         <Message  
            //             sameAsPrevAuthor={message.sameAsPrevAuthor} 
            //             upi={this.props.upi} 
            //             currentMessageIndex={i}
            //             lastMessageIndex={this.props.messages.length-1} 
            //             key={i} 
            //             {...message} 
            //             memberArray={this.props.memberArray} 
            //         />
            //     ))}
            //     <TypingIndicator prevMessage={this.props.messages && this.props.messages[this.props.messages.length-1]} memberTyping={this.props.memberTyping} isTyping={this.props.isTyping} upi={this.props.upi} memberArray={this.props.memberArray} />
            // </ScrollView>
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