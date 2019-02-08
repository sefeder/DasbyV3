import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native';
import { VirgilCrypto } from 'virgil-crypto';
import virgil from '../utils/virgilUtil';
import AnimatedEllipsis from 'react-native-animated-ellipsis';


class TypingIndicator extends Component {
    static propTypes = {
        author: PropTypes.string,
        // body: PropTypes.string.isRequired,
        me: PropTypes.bool,
        // sameAsPrevAuthor: PropTypes.bool,
        isTyping: PropTypes.bool,
        memberTyping: PropTypes.string,
        prevMessage: PropTypes.object
    }

    

    showTypingIndicator = (memberTyping) => {
        if (memberTyping !== this.props.upi) {
            for (let i = 0; i < this.props.memberArray.length; i++) {
                if (this.props.memberArray[i].upi === memberTyping) {
                    return this.props.prevMessage && (this.props.prevMessage.author === memberTyping) ? <View style={styles.notMeBubble}><AnimatedEllipsis numberOfDots={3}
                        minOpacity={0.4}
                        animationDelay={200}
                        style={styles.dots}
                    /></View> : <View><Text style={styles.notMeAuthor}>{this.props.memberArray[i].firstName}</Text><View style={styles.notMeBubble}><AnimatedEllipsis numberOfDots={3}
                        minOpacity={0.4}
                        animationDelay={200}
                        style={styles.dots}
                    /></View></View>
                }
            }
        }
    }

    render() {
        return (
            <View style={{ flexDirection: 'column' }}>
                {this.props.isTyping ? this.showTypingIndicator(this.props.memberTyping) : <View />}
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
        borderRadius: 20,
        marginBottom: 2.5,
        marginLeft: 25,
        justifyContent: 'center',
        height: 41.7,
        width: 85
    },
    dots: {
        color: '#94939b',
        fontSize: 100,
        left: -10,
        letterSpacing: -12.5,
        textAlign: 'center',
        top: -35,
        height: 110,
    },
    notMeAuthor: {
        marginLeft: 35,
        marginTop: 10,
        marginBottom: 2.5
    }
});

export default TypingIndicator