import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, TextInput, SafeAreaView, ActivityIndicator, Dimensions, ImageBackground ,Platform, Alert} from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR, SECONDARY_COLOR, TITLE_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY, FONT_MULI_REGULAR, FONT_MULI_EXTRABOLD, FONT_SEMI_BOLD, FONT_MEDIUM } from '../../../assets/fonts'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { signup } from '../actions'
import I18n from 'react-native-i18n'
import Images from '../../../assets/images'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import { TextField } from 'react-native-material-textfield';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'
import { LoginManager, GraphRequest, GraphRequestManager, } from "react-native-fbsdk"
import Api from '../../../common/api'
import i18n from '../../../i18n'
import appleAuth, {
    AppleButton,
    AppleAuthError,
    AppleAuthRequestScope,
    AppleAuthRealUserStatus,
    AppleAuthCredentialState,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication'
import jwt_decode from 'jwt-decode'


const majorVersionIOS = parseInt(Platform.Version, 10)
const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            name: null,
            email: null,
            emailValidate: true,
            password: null,
            confirmPassword: null,
            validate: null,
            image: null,
            error: null,
            showpswrd: true,
            showpswrd2: true,
            emailDisposable: ''
        }
        this.validate = this.validate.bind(this)
        this.onSignUp = this.onSignUp.bind(this)
        this.showMenu = this.showMenu.bind(this)
        this.imagePicker = this.imagePicker.bind(this)
        this.signIn = this.signIn.bind(this)
        this.login_fb = this.login_fb.bind(this)
        this._responseInfoCallback = this._responseInfoCallback.bind(this)
        this.userInfoFb = this.userInfoFb.bind(this)
        this.sentUserToServer = this.sentUserToServer.bind(this)
    }

    validate(text, type) {
        let alph = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if (type == 'email') {
            if (alph.test(text)) {
                this.setState({
                    emailValidate: true,
                    email: text
                })
            }
            else {
                this.setState({
                    emailValidate: false,
                    email: text
                })
            }
        }
    }


    componentDidMount() {
        this._setupGoogleSignin()
    }
    
    onSignUp() {
        if (this.state.name == null || this.state.name == '') {
            this.setState({ validate: 'Name cannot be empty' })
            return 0
        }
        if ((this.state.email == null) || this.state.email == '') {
            this.setState({ validate: 'Email cannot be empty' })
            return 0
        }
        if (!this.state.emailValidate) {
            this.setState({ validate: 'Enter valid Email' })
            return 0
        }
        if (this.state.password == null || this.state.password == '') {
            this.setState({ validate: 'Password cannot be empty' })
            return 0
        }
        if (this.state.confirmPassword == null || this.state.password == '') {
            this.setState({ validate: 'Enter password again' })
            return 0
        }
        if (this.state.confirmPassword != this.state.password) {
            this.setState({ validate: 'Password and confirm password should be same' })
            return 0
        }

        if ((this.state.password == this.state.confirmPassword) && (this.state.email !== null) && this.state.emailValidate) {
            this.emailValidate()
        }
    }


    emailValidate(){
        Api('get', "https://www.validator.pizza/email/" + `${this.state.email}`)
            .then((response) => {
                if (response) {
                    console.log('emailllldfgfgdfgfdg',response.disposable)
                    this.setState({
                        emailDisposable: response.disposable,
                    });
                    if(response.disposable == false){
                        this.props.dispatch(signup({ name: this.state.name, email: this.state.email, password: this.state.password, fbgoogle: 0, biography: this.state.biography, image: this.state.image }, this.props.navigation))
                        this.setState({ validate: null })
                    }
                    else{
                        Alert.alert("Sorry, we don't allow disposable email addresses, Please try a different email account")
                    }
                }
            });

    }

    showMenu(intent, assestId) {
        if (intent == 'addPhoto') {
            this.setState({ selectedAssest: assestId }, () => this.ActionSheet.show())
        }
    }

    imagePicker(index) {
        let image_temp = null
        switch (index) {
            case 0:
                ImagePicker.openCamera({
                    width: 400,
                    height: 400,
                    cropping: true,
                }).then(image => {
                    image_temp = { uri: image.path, type: image.mime, name: 'test.jpg' }
                    this.setState({ image: { uri: image.path, type: image.mime, name: 'test.png' } })
                })
                break
            case 1:
                ImagePicker.openPicker({
                    width: 400,
                    height: 400,
                    cropping: true,
                }).then(image => {
                    image_temp = { uri: image.path, type: image.mime, name: 'test.jpg' }
                    this.setState({ image: { uri: image.path, type: image.mime, name: 'test.png' } })
                })
                break;
        }
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

    sentUserToServer(user) {
        let page = this.props.navigation.getParam('page', null)
        this.props.dispatch(signup(user, this.props.navigation, page))
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={styles.iconContainer}>
                        <AntDesign name="close" size={22} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titlecontainer}>
                        <Text style={styles.loginText}>Welcome,</Text>
                        <Text style={styles.loginText1}>Sign up to continue</Text>
                    </View>
                    <View style={styles.imageContaoner}>
                        
                        <View style={styles.mainTitleContainer}>
                            <Image source={Images.logoLetterNew} style={styles.imageBackground2} resizeMode="contain" />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <TextField
                            label={i18n.t('Name')}
                            keyboardType='default'
                            formatText={this.formatText}
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput2}
                            onChangeText={(text) => this.setState({ name: text })}
                            lineWidth={1}
                        />
                        <TextField
                            label={i18n.t('Email_address')}
                            keyboardType='email-address'
                            formatText={this.formatText}
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput2}
                            onChangeText={(text) => this.validate(text, 'email', this.setState({ error: null }))}
                            lineWidth={1}
                        />
                        {!this.state.emailValidate && <Text style={styles.emailValidate}>Enter valid Email</Text>}
                        <View style={styles.textInputContainer}>
                            <TextField
                                label={i18n.t('Password')}
                                keyboardType='default'
                                formatText={this.formatText}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput2}
                                onChangeText={(text) => this.setState({ password: text })}
                                secureTextEntry={this.state.showpswrd}
                                lineWidth={1}
                            />
                            <TouchableOpacity style={styles.iconStyle}
                                onPress={() => this.setState({ showpswrd: !this.state.showpswrd })}>
                                <FontAwesome5 name={this.state.showpswrd ? 'eye' : 'eye-slash'} size={16} color={SECONDARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textInputContainer}>
                            <TextField
                                label={i18n.t('Confirm_Password')}
                                keyboardType='default'
                                formatText={this.formatText}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput2}
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                secureTextEntry={this.state.showpswrd2}
                                lineWidth={1}
                            />
                            <TouchableOpacity style={styles.iconStyle}
                                onPress={() => this.setState({ showpswrd2: !this.state.showpswrd2 })}>
                                <FontAwesome5 name={this.state.showpswrd2 ? 'eye' : 'eye-slash'} size={16} color={SECONDARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.validate &&
                        <Text style={styles.validationText}>{this.state.validate}</Text>
                    }
                    {this.state.error && !this.props.isLogging && !this.state.validate &&
                        <Text style={styles.validationText}>{this.state.error}</Text>
                    }
                    <TouchableOpacity onPress={() => this.setState({ error: this.props.error, isLogin: true }, this.onSignUp)} style={styles.signUpButton}>
                        <Text style={styles.login}>{i18n.t('Sign_Up')}</Text>
                            {this.props.isLogging &&
                                <ActivityIndicator size="small" color="white" style={{marginLeft: 10}}/>
                            }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.signUpContainer}>
                        <Text style={styles.question}>Already have an account ?<Text style={styles.signUpText}>  {i18n.t('sign_in')}</Text></Text>
                    </TouchableOpacity>
                    <View style={styles.orContainer}>
                        <View style={styles.line}></View>
                        <Text style={styles.socialMediaText}>   OR   </Text>
                        <View style={styles.line}></View>
                    </View>
                    <View style={styles.socialMedia}>
                        <TouchableOpacity onPress={this.login_fb} style={styles.logo}>
                            <Image source={Images.fb} style={styles.image} />
                            {/* <View>
                                <Text style={styles.loginWith}>Sign up with</Text>
                                <Text style={styles.logoText}>FACEBOOK</Text>
                            </View> */}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.signIn} style={styles.logo}>
                            <Image source={Images.google} style={styles.image} />
                            {/* <View>
                                <Text style={styles.loginWith}> Sign up with</Text>
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
                </KeyboardAwareScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Pick Image'}
                    options={['Take Photo', 'Choose from Library', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => { this.imagePicker(index) }}
                />
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userLogin.user,
        isLogging: state.userLogin.isLogging,
        error: state.userLogin.signUpErrorMessage,
        lang: state.programmes.lang
    }
}

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white'
    },
    scroll: {
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: FONT_PRIMARY
    },
    title2: {
        color: SECONDARY_COLOR,
        fontFamily: FONT_PRIMARY,
        fontSize: 12,
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
    imageBackground1: {
        flex: 1
    },
    absoluteview: {
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        position: 'absolute',
        height: height,
        width: width
    },
    loginContainer: {
        margin: 5,
        borderRadius: 10,
        height: height * .45,
    },
    titlecontainer: {
        // paddingLeft: 15,
        alignSelf:'center'
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
        color: SECONDARY_COLOR,
        alignSelf:'center'
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
    image: {
        height: 25,
        width: 25
    },
    textInput: {
        height: height * .065,
        width: '70%',
        borderRadius: 30,
        paddingLeft: 5,
        color: '#000'
    },
    textContainer: {
        marginTop: 20,
    },
    iconUser: {
        flexDirection: 'row',
        alignSelf: 'center',
        height: height * .07,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 30,
        width: '85%',

    },
    userIcon: {
        height: height * .065,
        width: '13%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        height: 35,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -30
    },
    signUpButton: {
        height: height * .057,
        width: width * .90,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 5,
        flexDirection:'row'
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
        alignSelf: 'center',
        marginTop: 10
    },
    iconStyle2: {
        alignSelf: 'flex-end',
        marginTop: -38,
        marginRight: 20
    },
    forgot: {
        alignSelf: 'flex-end',
        marginTop: 25,
        fontSize: 13,
        color: SECONDARY_COLOR,
        marginRight: 18,
        fontFamily: FONT_SEMI_BOLD
    },
    validationText: {
        color: PRIMARY_COLOR,
        fontFamily: FONT_PRIMARY,
        fontSize: 15,
        marginTop: 10,
        marginLeft: 20
    },
    imageContaoner: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf:'center'
        
    },
    socialMediaText: {
        fontFamily: FONT_MEDIUM,
        textAlign: 'center',
        fontSize: 15,
        color: PRIMARY_COLOR
    },
    textInput2: {
        height: 60,
        width: width * .9,
        alignSelf: 'center'
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
        alignSelf: 'center',
    },
    orContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
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
    },
    imageBackground2: {
        height: 80,
        width: 250,
        alignSelf:'center'
    },
    emailValidate: {
        marginLeft: 18,
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_REGULAR,
        marginTop: 5,
        marginBottom: 5
    },
    textInputContainer: {
        flexDirection: 'row',
        width: width * .9,
        alignSelf: 'center',
        alignItems: 'flex-end'
    }
})