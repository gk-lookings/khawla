import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TextInput, SafeAreaView,Alert } from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR, SECONDARY_COLOR, TITLE_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../../common/api'
import { RESET_PASSWORD } from '../../../common/endpoints'

class App extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            email: this.props.navigation.getParam('email', null),
            otp: this.props.navigation.getParam('otp', null),
            isLoading: false,
            fieldError: false,
            errormessage: null
        }
        this.onForgot = this.onForgot.bind(this)
    }

    onForgot() {
        let formdata = new FormData()
        formdata.append('email', this.state.email)
        formdata.append('newPassword', this.state.password)
        formdata.append('otp', this.state.otp)
        if (this.state.password.length > 0) {
            this.setState({ fieldError: false, isLoading: true })
            Api('post', RESET_PASSWORD, formdata)
                .then((response) => {
                    if (response && response.status && response.statusCode == 200) {
                        this.setState({ errormessage: null, isLoading: false })
                        Alert.alert('Password Changed Successfully',
                            '',
                            [
                                { text: 'OK', onPress: () => this.props.navigation.navigate('Login') },
                            ],
                            { cancelable: false },
                        )
                    }
                    else
                        this.setState({ errormessage: response.errormessage, isLoading: false })
                })
        }
        else
            this.setState({ fieldError: true })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAwareScrollView style={styles.keyboardaware}>
                    <View style={styles.tophead}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.goback}>
                            <AntDesign name='arrowleft' size={26} color='black' />
                        </TouchableOpacity>
                        <Text style={styles.welcome}>Reset Password</Text>
                        <View style={styles.emptyContainer}></View>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.subtitle}>Please enter your new password</Text>
                    </View>
                    <View style={styles.email}>
                        <TextInput
                            placeholder='New Password'
                            placeholderTextColor={TITLE_COLOR}
                            onChangeText={(text) => this.setState({ password: text })}
                            style={styles.textField}
                        />
                    </View>
                    {this.state.fieldError &&
                        <Text style={styles.validationText}>Password cannot be empty</Text>
                    }
                    {this.state.errormessage &&
                        <Text style={styles.validationText}>{this.state.errormessage}</Text>
                    }
                    <TouchableOpacity onPress={this.onForgot} style={styles.button}>
                        <Text style={styles.submit}>{this.state.isLoading ? 'Changing...' : 'Submit'}</Text>
                        <AntDesign name='arrowright' size={26} color='white' />
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

export default connect()(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF'
    },
    keyboardaware: {
        padding: 15
    },
    header: {
        alignItems: 'center',
        marginTop: 25
    },
    tophead: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    welcome: {
        fontFamily: FONT_SECONDARY,
        fontSize: 33,
        textAlign: 'center',
        color: TITLE_COLOR
    },
    subtitle: {
        fontFamily: FONT_PRIMARY,
        fontSize: 22,
        paddingTop: 10,
        paddingBottom: 15,
        textAlign: 'left',
        color: TITLE_COLOR
    },
    email: {
        height: 50,
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: SECONDARY_COLOR,
        borderRadius: 5,
        marginTop: 15
    },
    textField: {
        flex: 1,
        fontSize: 18,
        fontFamily: FONT_SECONDARY,
        paddingLeft: 15,
        paddingTop: 0,
        paddingBottom: 0,
        justifyContent: 'center',
    },
    validationText: {
        color: '#f44336',
        fontFamily: FONT_SECONDARY,
        fontSize: 15,
        paddingHorizontal: 15,
        marginBottom: 10,
        marginTop: -5
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 20
    },
    submit: {
        fontFamily: FONT_SECONDARY,
        fontSize: 18,
        color: TITLE_COLOR,
        color: '#FFFFFF',
        textAlign: 'center',
        paddingRight: 15
    },
    goback: {
        flex: 1
    },
    emptyContainer: {
        flex: 1
    },
})