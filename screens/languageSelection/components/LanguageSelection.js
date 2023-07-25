import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Animated, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { CommonActions } from '@react-navigation/native'
import { PRIMARY_COLOR } from '../../../assets/color'
import { FONT_MULI_BOLD } from '../../../assets/fonts'
import Images from '../../../assets/images'
import { resetFirstLogin } from '../../languageSelection/actions'
import i18n from '../../../i18n'
import SplashScreen from 'react-native-splash-screen'

const { height, width } = Dimensions.get('screen')

const options = [
    {
        key: 'en',
        value: 'English'
    },
    {
        key: 'ar',
        value: 'عربى'
    }
]
class App extends Component {


    constructor(props) {
        super(props)
        this.state = {
            language: ''
        }
        this.changeLanguage = this.changeLanguage.bind(this)
    }

    componentDidMount() {
        SplashScreen.hide()
    }

    changeLanguage() {
        i18n.locale = this.state.language
        this.props.dispatch({ type: 'CHANGE_LANGUAGE', locale: this.state.language })
        this.props.navigation.navigate('Home')
        this.props.dispatch(resetFirstLogin())
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.content1}>
                    <Image source={Images.logoLetterNew} resizeMode="contain" style={{ height: height / 5, width: 300, alignSelf: 'center', marginTop: '10%' }} />
                    <Image source={Images.intro} resizeMode="contain" style={{ height: height / 3.5, width: width, alignSelf: 'center', marginTop: '10%' }} />
                    <View style={{ width: width, marginTop: '30%', flexDirection: 'row', justifyContent: 'center' }}>
                        {options.map((item) =>
                            <View key={item.key} style={styles.buttonContainer2}>
                                <TouchableOpacity style={[styles.button, this.props.lang === item.key && { backgroundColor: '#b38806', borderColor: '#b38806' }]} onPress={() => this.setState({ language: item.key }, () => this.changeLanguage(), () => this.props.dispatch(resetFirstLogin()))}>
                                    <Text style={[styles.text1, this.props.lang === item.key && { color: '#fff' }]}>{item.value}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgb(252, 246, 240)',
    },
    content1: {
        backgroundColor: 'rgb(252, 246, 240)',
        width: width,
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 20,
        paddingBottom: 15,
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_BOLD
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginHorizontal: 5
    },
    text1: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 15,
        color: '#b38806'
    },
    button: {
        height: 45,
        width: 80,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#b38806',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
    },
})
export default connect(mapStateToProps)(App)