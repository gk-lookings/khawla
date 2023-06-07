import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MEDIUM, FONT_SEMI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT } from '../../../assets/fonts'
import { fetchUser, resetError, resetIsLoggin } from '../actions'
import { GoogleSignin } from '@react-native-community/google-signin'
import { signup } from '../../signUp/actions'
import { LoginManager, GraphRequest, GraphRequestManager, } from "react-native-fbsdk"
import { TextField } from 'react-native-material-textfield';
import i18n from '../../../i18n'
import Modal from 'react-native-modal'
import { WebView } from 'react-native-webview';
import Api from '../../../common/api'

import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestScope,
    AppleAuthRealUserStatus,
    AppleAuthCredentialState,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication'
import jwt_decode from 'jwt-decode'
const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
const majorVersionIOS = parseInt(Platform.Version, 10)
const { height, width } = Dimensions.get('screen')
class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: null,
            password: null,
            user: null,
            showpswrd: true,
            validate: null,
            fcmToken: null,
            uniqueId: null,
            errorVisible: false,
            openMoe: false,
            moeLoader: false,
            userError: false,
            errorLogout: false
        }
        this.onLogin = this.onLogin.bind(this)
        this.signIn = this.signIn.bind(this)
        this.login_fb = this.login_fb.bind(this)
        this._responseInfoCallback = this._responseInfoCallback.bind(this)
        this.userInfoFb = this.userInfoFb.bind(this)
        this.sentUserToServer = this.sentUserToServer.bind(this)
        this.validateLogin = this.validateLogin.bind(this)
        this.clearDataText = this.clearDataText.bind(this)
    }

    async componentDidMount() {
        this._setupGoogleSignin()
        this.props.dispatch(resetIsLoggin())
    }

    onLogin() {
        this.setState({validate: null})
        let page = this.props.navigation.getParam('page', null)
        let data = this.props.navigation.getParam('data', null)
        let user = { email: this.state.email, password: this.state.password }
        this.props.dispatch(fetchUser(user, this.props.navigation, page, data))
    }

    validateLogin() {
        if ((this.state.email == null) || this.state.email == '') {
            this.setState({ validate: 'Email cannot be empty' })
            return 0
        }
        if (this.state.password == null || this.state.password == '') {
            this.setState({ validate: 'Password cannot be empty' })
            return 0
        }
        else {
            this.onLogin()
        }
    }

    userInfoFb() {
        const infoRequest = new GraphRequest(
            '/me?fields=name,email,picture.height(72).width(72)', null,
            this._responseInfoCallback,
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    _responseInfoCallback(error: ?Object, result: ?Object) {
        if (error) {
            console.log(error.toString())
            alert('Error fetching data: ' + error.toString());
        } else {
            let user = {};
            user.name = result.name
            user.email = result.email
            user.photo = result.picture.data.url
            user.fbgoogle = 1
            user.fcmToken = this.state.fcmToken
            user.auth = {
                id: result.id,
                provider: "facebook"
            }
            this.sentUserToServer(user)
        }
    }

    signIn() {
        console.log('cslled SIGNIN:');
        GoogleSignin.signIn()
            .then((result) => {
                console.log('gogle sign', result);
                let user = {}
                user.name = result.user.name
                user.email = result.user.email
                user.photo = result.user.photo
                user.fbgoogle = 2
                user.fcmToken = this.state.fcmToken
                user.auth = {
                    id: result.user.id,
                    provider: "google"
                }
                this.sentUserToServer(user)
            })
            .catch((err) => {
                console.log('WRONG SIGNIN:', err);
            })
            .done();
    }

    sentUserToServer(user) {
        let page = this.props.navigation.getParam('page', null)
        this.props.dispatch(signup(user, this.props.navigation, page))
    }

    async _setupGoogleSignin() {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
            await GoogleSignin.configure({
                webClientId: '413364078983-8mdo8mnkaff8v4j3qn74docmjnstd95k.apps.googleusercontent.com',
                offlineAccess: false,
            });
        }
        catch (err) {
            console.log("Play services error", err.code, err.message);
        }
    }

    login_fb() {
        LoginManager.logOut()
        const that = this
        if (Platform.OS === "android") {
            LoginManager.setLoginBehavior("web_only")
        }
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    that.userInfoFb()
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    async onAppleButtonPress() {
        console.log("jnh")
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        })
        console.log('appleAuthRequestResponse:', appleAuthRequestResponse)
        const { identityToken, nonce } = appleAuthRequestResponse
        console.log('dessasssscoded', identityToken)

        if (identityToken) {
            var decoded = jwt_decode(identityToken);
            console.log('decoded', decoded.email)
            let user = {}
            user.name = appleAuthRequestResponse.fullName.givenName + ' ' + appleAuthRequestResponse.fullName.familyName
            user.email = appleAuthRequestResponse.email ? appleAuthRequestResponse.email : decoded && decoded.email
            user.photo = appleAuthRequestResponse.picture && appleAuthRequestResponse.picture.data.url
            user.fbgoogle = 2
            user.fcmToken = this.state.fcmToken
            user.auth = {
                id: appleAuthRequestResponse.id,
                provider: "apple"
            }
            this.sentUserToServer(user)
        } else {
        }
    }
    handleWebViewRequest = request => {
        const url = request.url
        console.log(url.includes("code="));
        if (url.includes("code=")) {
            this.setState({ openMoe: false });
            setTimeout(() => {
                this.setState({
                    moeLoader: true
                })
            }, 500)
            var regex = /[?&]([^=#]+)=([^&#]*)/g,
                param = {},
                match;
            while (match = regex.exec(url)) {
                param[match[1]] = match[2];
            }
            console.log('param************************', param.code)
            if (param.code != " ") {
                let formD = new FormData
                formD.append('code', param.code)
                Api('post', 'https://www.khawlafoundation.com/api/moeLogin.php', formD)
                    .then((response) => {
                        if (response.statusCode == 200) {
                            console.log('logein with moe................', response)
                            let user = {};
                            user.name = response.userinfo.name
                            user.email = response.userinfo.email
                            user.photo = response.userinfo.profile_pic
                            user.fbgoogle = 4
                            user.fcmToken = this.state.fcmToken
                            user.auth = {
                                id: response.userinfo.id,
                                provider: "meo"
                            }
                            this.sentUserToServer(user)
                            this.setState({ moeLoader: false })
                        }
                        else {
                            this.setState({ moeLoader: false });
                            setTimeout(() => {
                                this.setState({
                                    errorLogout: true
                                })
                            }, 500);
                            setTimeout(() => {
                                this.setState({
                                    errorLogout: false
                                })
                            }, 2000);
                            setTimeout(() => {
                                this.setState({
                                    userError: true
                                })
                            }, 2500);
                            setTimeout(() => {
                                this.setState({
                                    userError: false
                                })
                            }, 5000);
                        }
                    })
            }
        }
    }

    clearDataText(){
        this.props.dispatch(resetError());
        this.setState({validate: null})
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={styles.iconContainer}>
                            <AntDesign name="close" size={22} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.titlecontainer}>
                            <Text style={styles.loginText}>Welcome,</Text>
                            <Text style={styles.loginText1}>Sign in to continue</Text>
                        </View>
                        <View style={styles.imageContaoner}>
                            {/* <Image source={Images.logo} style={styles.imageBackground} resizeMode="contain" /> */}
                            <View style={styles.mainTitleContainer}>
                                <Image source={Images.logoLetterNew} style={styles.imageBackground2} resizeMode="contain" />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <TextField
                                label={i18n.t('Email_address')}
                                keyboardType='email-address'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput2}
                                onChangeText={(text) => this.setState({ email: text, errorVisible: false })}
                                lineWidth={1}
                                onFocus={()=>this.clearDataText()}
                            />
                            <View>
                                <TextField
                                    label={i18n.t('Password')}
                                    keyboardType='default'
                                    formatText={this.formatText}
                                    onSubmitEditing={this.onSubmit}
                                    // baseColor={PRIMARY_COLOR}
                                    tintColor={PRIMARY_COLOR}
                                    containerStyle={styles.textInput2}
                                    onChangeText={(text) => this.setState({ password: text, errorVisible: false })}
                                    labelTextStyle={{ color: 'blue', fontSize: 9 }}
                                    secureTextEntry={this.state.showpswrd}
                                    lineWidth={1}
                                    onFocus={()=>this.clearDataText()}
                                    />
                                <TouchableOpacity style={styles.iconStyle2}
                                    onPress={() => this.setState({ showpswrd: !this.state.showpswrd })}>
                                    <FontAwesome5 name={this.state.showpswrd ? 'eye' : 'eye-slash'} size={18} color={SECONDARY_COLOR} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.forgotContainer} onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                <Text style={styles.forgot}>{i18n.t('Forgot_Password')} ?</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.validate &&
                            <Text style={styles.validationText}>{this.state.validate}</Text>
                        }
                        {this.props.error && this.state.errorVisible && !this.props.isLogging && <Text style={styles.validationText}>{this.props.error} </Text>}
                        <TouchableOpacity onPress={() => this.setState({ errorVisible: true }, () => this.validateLogin())} style={styles.signUpButton}>
                            <Text style={styles.login}>{i18n.t('LOGIN')}</Text>
                            {this.props.isLogging &&
                                <ActivityIndicator size="small" color="white" style={{ marginLeft: 10 }} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style={styles.signUpContainer}>
                            <Text style={styles.question}>New user?<Text style={styles.signUpText}>  {i18n.t('Sign_Up')}</Text></Text>
                        </TouchableOpacity>
                        <View style={styles.orContainer}>
                            <View style={styles.line}></View>
                            <Text style={styles.socialMediaText}>   OR   </Text>
                            <View style={styles.line}></View>
                        </View>
                    </View>
                    <View style={styles.socialMedia}>
                        <TouchableOpacity onPress={this.login_fb} style={styles.logo}>
                            <Image source={Images.fb} style={styles.image} />
                            {/* <View>
                                <Text style={styles.loginWith}>Sign in with</Text>
                                <Text style={styles.logoText}>FACEBOOK</Text>
                            </View> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.signIn} style={styles.logo}>
                            <Image source={Images.google} style={styles.image} />
                            {/* <View>
                                <Text style={styles.loginWith}> Sign in with</Text>
                                <Text style={styles.logoText}> GOOGLE</Text>
                            </View> */}
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && majorVersionIOS >= 13 &&
                            <TouchableOpacity onPress={() => this.onAppleButtonPress()} style={styles.logo}>
                                <AntDesign name="apple1" size={25} />
                                {/* <View>
                                    <Text style={styles.loginWith}> Sign in with</Text>
                                    <Text style={styles.logoText}> APPLE</Text>
                                </View> */}
                            </TouchableOpacity>
                        }
                        
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ openMoe: true })} style={styles.logomeo}>
                            <Image source={this.props.lag == 'ar' ? Images.MOE_AR : Images.MOE_EN} resizeMode="contain" style={styles.imagemeo} />
                        </TouchableOpacity>
                    <Modal
                        isVisible={this.state.openMoe}
                        backdropOpacity={0.5}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ height: height, width: width, margin: 0, backgroundColor: '#fff' }}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <WebView
                                style={{}}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                injectedJavaScript={INJECTEDJAVASCRIPT}
                                onNavigationStateChange={this.handleWebViewRequest.bind(this)}
                                // onShouldStartLoadWithRequest={event => {
                                //     console.log('link..................134.........', event.url)
                                // }}
                                // onShouldStartLoadWithRequest={this.handleWebViewRequest.bind(this)}
                                useWebKit={true}
                                startInLoadingState={true}
                                renderLoading={() => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: height, width: width, }}>
                                        <View style={{ padding: 30, backgroundColor: '#fff', borderRadius: 10, borderWidth: .5, borderColor: '#d9d9d9' }}>
                                            <ActivityIndicator size="large" color={SECONDARY_COLOR} />
                                        </View>
                                        <Text style={{ marginTop: 10, fontFamily: FONT_PRIMARY }}>Loading...</Text>
                                    </View>)}
                                source={{ uri: "https://sso-uat.moe.gov.ae/connect/authorize/callback?response_type=code&state&client_id=khfoundation&scope=openid anon_details sis-masterapi-anon&redirect_uri=https://www.khawlafoundation.com/auth/moe/callback" }}
                            />
                            <TouchableOpacity style={{ position: 'absolute', top: 35, right: 10 }} onPress={() => this.setState({ openMoe: false })}>
                                <AntDesign name="closecircleo" size={22} color="#000" />
                            </TouchableOpacity>
                        </SafeAreaView>
                    </Modal>
                    <Modal
                        isVisible={this.state.moeLoader}
                        backdropOpacity={0.5}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ height: height, width: width, margin: 0, backgroundColor: '#fff' }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ padding: 30, backgroundColor: '#fff', borderRadius: 10, borderWidth: .5, borderColor: '#d9d9d9' }}>
                                <ActivityIndicator size="large" color={SECONDARY_COLOR} />
                            </View>
                            <Text style={{ marginTop: 10, fontFamily: FONT_PRIMARY, }}>Loading...</Text>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.userError}
                        backdropOpacity={0.0}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ed4c4a' }}>
                            <Text style={{ fontFamily: FONT_MEDIUM, fontSize: 13, paddingVertical: 2 }}>User not found !</Text>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.errorLogout}
                        backdropOpacity={0.5}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ height: height, width: width, margin: 0, backgroundColor: '#fff' }}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <WebView
                                style={{}}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                injectedJavaScript={INJECTEDJAVASCRIPT}
                                // onNavigationStateChange={this.handleWebViewRequest.bind(this)}
                                useWebKit={true}
                                source={{ uri: "https://sso-uat.moe.gov.ae/Account/Logout" }}
                            />
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: height, width: width, position: 'absolute', backgroundColor: '#fff' }}>
                                <View style={{ padding: 30, borderRadius: 10, borderWidth: .5, borderColor: '#d9d9d9' }}>
                                    <ActivityIndicator size="large" color={SECONDARY_COLOR} />
                                </View>
                                <Text style={{ marginTop: 10, fontFamily: FONT_PRIMARY }}>Loading...</Text>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    isLogging: state.userLogin.isLogging,
    error: state.userLogin.errorMessage,
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    iconContainer: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 10
    },
    imageBackground: {
        height: 90,
        width: 50
    },
    imageBackground2: {
        height: 80,
        width: 250,
        alignSelf:'center'
    },
    titlecontainer: {
        // paddingLeft: 15,
        alignSelf:'center',
        
    },
    loginText: {
        fontSize: 24,
        fontFamily: FONT_MEDIUM,
        color: '#000',
        alignSelf:'center'
    },
    loginText1: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: SECONDARY_COLOR
    },
    socialMedia: {
        width: '100%',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:"row"
    },
    logo: {
        height:40,
        width:40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.3,
        elevation: 3,
        flexDirection: 'row',
        marginBottom: 15
    },
    logomeo: {
        padding:5,
        width:width/2.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal:20,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.3,
        elevation: 3,
        flexDirection: 'row',
        marginBottom: 15,
        alignSelf:"center"
    },
    image: {
        height: 25,
        width: 25,
    },
    imagemeo: {
        height: 40,
        width: width * .7,
    },
    textContainer: {
        marginTop: 20,
    },
    signUpButton: {
        height: height * .057,
        width: width * .9,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 5,
        flexDirection: 'row'
    },
    login: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONT_SEMI_BOLD
    },
    question: {
        color: SECONDARY_COLOR,
        fontSize: 13,
        alignSelf: 'center',
        marginTop: height * .02,
        fontFamily: FONT_SEMI_BOLD
    },
    signUpText: {
        color: PRIMARY_COLOR,
        fontSize: 17,
        fontFamily: FONT_SEMI_BOLD,
    },
    signUpContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * .06,
        alignSelf: 'center',
        marginTop: 5
    },
    iconStyle2: {
        alignSelf: 'flex-end',
        marginTop: -38,
        marginRight: 20
    },
    forgot: {
        fontSize: 13,
        color: SECONDARY_COLOR,
        fontFamily: FONT_SEMI_BOLD,
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginTop: 25,
        marginBottom: 25,
        fontSize: 13,
        color: SECONDARY_COLOR,
        marginRight: 18,
        fontFamily: FONT_SEMI_BOLD,
    },
    validationText: {
        color: PRIMARY_COLOR,
        fontFamily: FONT_PRIMARY,
        fontSize: 15,
        margin: 5,
        marginLeft: 20
    },
    imageContaoner: {
        marginTop: 20,
        flexDirection: 'row',
        // alignItems: 'center',
        // marginLeft: 10,
        marginLeft:-15,
        alignSelf:"center"
    },
    socialMediaText: {
        fontFamily: FONT_MEDIUM,
        textAlign: 'center',
        fontSize: 15,
        color: PRIMARY_COLOR
    },
    textInput2: {
        alignSelf: 'center',
        width: width * .9
    },
    khawlaText: {
        fontSize: 38,
        color: PRIMARY_COLOR,
        fontFamily: FONT_SEMI_BOLD
    },
    artText: {
        fontSize: 17,
        fontFamily: FONT_SEMI_BOLD
    },
    mainTitleContainer: {
    },
    orContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    line: {
        height: .5,
        width: 80,
        backgroundColor: SECONDARY_COLOR,
        opacity: .5
    },
    loginWith: {
        color: SECONDARY_COLOR,
        fontSize: 14,
        marginLeft: 15
    },
    logoText: {
        fontSize: 15,
        fontFamily: FONT_SEMI_BOLD,
        marginLeft: 15
    }
})
export default connect(mapStateToProps)(App)