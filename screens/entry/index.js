import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Animated, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
import { resetBanner } from '../home/action'

const { height, width } = Dimensions.get('screen')

class App extends Component {


    constructor(props) {
        super(props)
        this.state = {
        }
        this.goToPages= this.goToPages.bind(this)
    }
    componentDidMount(){
    this.props.dispatch(resetBanner())
    }

    goToPages() {
        if (this.props.isFirstlogin) {
            this.props.navigation.navigate('LanguageSelection')
        }
        else {            
            this.props.navigation.navigate('Home')

        }
    }

    render() {
        console.log('entry____')
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.goToPages()}
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    isFirstlogin: state.resetFirstLogin.isFirstLogin,
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
})
export default connect(mapStateToProps)(App)