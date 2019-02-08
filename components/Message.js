import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image } from 'react-native';
import { VirgilCrypto } from 'virgil-crypto';
import virgil from '../utils/virgilUtil';


class Message extends Component {
    static propTypes = {
        author: PropTypes.string,
        // body: PropTypes.string.isRequired,
        me: PropTypes.bool,
        sameAsPrevAuthor: PropTypes.bool
    }

    determineAuthor = (authorUpi) => {
        if(this.props.upi === authorUpi){
            return <View style={styles.meBubble}>
                {
                    this.props.body.imageURL ?
                        <Image source={{ uri: this.props.body.imageURL }}
                            style={{ width: 280, height: 190 }} />
                        : this.props.body.videoURL ?
                            < Text selectable style={styles.meMessageText}>
                                this will be a video
                            </Text>
                            : < Text selectable style={styles.meMessageText}>
                                {this.props.body}
                            </Text>    
                }
            </View>
        }
        for(let i=0; i< this.props.memberArray.length; i++){
            if (this.props.memberArray[i].upi === authorUpi) {
                return this.props.sameAsPrevAuthor ? 
                    <View style={styles.notMeBubble}>
                        {
                            this.props.body.imageURL ?
                                <Image source={{ uri: this.props.body.imageURL }}
                                    style={{ width: 280, height: 190 }} />
                                : this.props.body.videoURL ?
                                    < Text selectable style={styles.notMeMessageText}>
                                        this will be a video
                            </Text>
                                    : < Text selectable style={styles.notMeMessageText}>
                                        {this.props.body}
                                    </Text>
                        }
                    </View>
                    :
                    <View>
                        <Text style={styles.notMeAuthor}>
                            {this.props.memberArray[i].firstName}
                        </Text>
                        <View style={styles.notMeBubble}>
                            {
                                this.props.body.imageURL ?
                                    <Image source={{ uri: this.props.body.imageURL }}
                                        style={{ width: 280, height: 190 }} />
                                    : this.props.body.videoURL ?
                                        < Text selectable style={styles.notMeMessageText}>
                                            this will be a video
                            </Text>
                                        : < Text selectable style={styles.notMeMessageText}>
                                            {this.props.body}
                                        </Text>
                            }
                        </View>
                    </View>
            }
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'column' }}>
                {this.determineAuthor(this.props.author)}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    notMeBubble: {
        backgroundColor: '#D5D6D7',
        alignSelf: 'flex-start',
        maxWidth: 300,
        padding: 10,
        borderRadius: 15, //was 20
        marginBottom: 2.5,
        marginLeft: 25
    },
    meBubble: {
        backgroundColor: '#3377FF',
        alignSelf: 'flex-end',
        maxWidth: 300,
        padding: 10,
        borderRadius: 15, //was 20
        marginBottom: 2.5,
        marginRight: 25
    },
    meMessageText: {
        fontSize: 18,
        color: 'white'
    },
    notMeMessageText: {
        fontSize: 18
    },
    notMeAuthor: {
        marginLeft: 35,
        marginTop: 10,
        marginBottom: 2.5
    }
});

export default Message