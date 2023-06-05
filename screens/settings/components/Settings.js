import React, { Component } from 'react'
import { SafeAreaView, View, StyleSheet, Text, Image, TouchableOpacity, Switch, Keyboard, ScrollView, TextInput, Dimensions, KeyboardAvoidingView, Alert, Platform, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import i18n from '../../../i18n'
import { FONT_MEDIUM, FONT_MULI_REGULAR, FONT_PRIMARY, FONT_PRIMARY1, FONT_SECONDARY, FONT_SEMI_BOLD } from './../../../assets/fonts'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
// import { getPoems, resetPoems } from '../../home/actions'
import { resetUser, postChangeProfileImage, postNotificationToggle, fetchChangeName,   } from '../../login/actions'
import Images from '../../../assets/images'
import Api from '../../../common/api'
import DeviceInfo from 'react-native-device-info'
import { LOGOUT, CHANGE_PASSWORD, CHANGE_LANGUAGE,DELETE ,SEND_OTP_EMAIL_CHANGE} from '../../../common/endpoints'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { WebView } from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign'

const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
const version = DeviceInfo.getVersion()
const { height, width } = Dimensions.get('screen')

const options = [
    {
        key: 'en',
        value: 'English'
    },
    {
        key: 'ar',
        value: 'Arabic'
    }
]

class App extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            notification: false,
            language: null,
            isVisible: false,
            image: null,
            visibleModal: false,
            currentpassword: '',
            newpassword: '',
            isVisibleUser: false,
            isVisibleUserDelete:false,
            isVisibleUserActive:false,
            isVisibleChangeMail:false,
            isVisibleLogout: false,
            username: '',
            email:'',
            userEmpty: false,
            emailEmpty:false,
            user: null,
            cache: Math.random().toString(36).substring(7),
            logoutMoe: false,
            activeAccount:false,
            fieldError: false,
            isLoading: false,
            activeAccountModal: false,
            deleteAccountModal: false
        }
        this.renderModalContent = this.renderModalContent.bind(this)
        this.renderModalPassword = this.renderModalPassword.bind(this)
        this.changeLanguage = this.changeLanguage.bind(this)
        this.imagePicker = this.imagePicker.bind(this)
        this.submitImage = this.submitImage.bind(this)
        this.showMenu = this.showMenu.bind(this)
        this.logout = this.logout.bind(this)
        this.delete = this.delete.bind(this)
        this.onToggleNotification = this.onToggleNotification.bind(this)
        this.changeUsername = this.changeUsername.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
    }

    componentDidMount() {
        this.setState({ language: this.props.lang, user: this.props.user })
        console.log('userr....', this.props.user)
    }

    componentDidUpdate() {
        if (this.state.user != this.props.user) {
            this.setState({ user: this.props.user })
            console.log('userr....', this.props.user)

        }
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
                    this.submitImage(image_temp)
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
                    this.submitImage(image_temp)
                })
                break;
        }
    }

    submitImage(image_temp) {
        if (image_temp)
            this.props.dispatch(postChangeProfileImage({ image: image_temp }))
    }

    renderModalContent = () => (
        <View style={styles.content}>
            <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => this.setState({ isVisible: false })}>
                    <Icon name='ios-close-circle-outline' size={30} color='black' />
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{i18n.t("Change_Language")}</Text>
            {options.map((item) =>
                <View key={item.key} style={styles.buttonContainer}>
                    <Text style={styles.text}>{item.value}</Text>
                    <TouchableOpacity style={styles.circle} onPress={() => this.setState({ language: item.key })}>
                        {this.state.language === item.key && <View style={styles.checkedCircle} />}
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity onPress={this.changeLanguage} style={styles.modalButton}>
                <Text style={styles.modalButtonFont}>{i18n.t("Change_Language")}</Text>
            </TouchableOpacity>
        </View>
    )

    renderModalPassword = () => (
        <View style={styles.content}>
            <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => this.setState({ visibleModal: false })}>
                    <Icon name='ios-close-circle-outline' size={30} color='black' />
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{i18n.t("Change_Password")}</Text>
            <View style={styles.txtinput}>
                <TextInput
                    placeholder='Old Password'
                    placeholderTextColor={'black'}
                    onChangeText={(text) => this.setState({ currentpassword: text })}
                    secureTextEntry={true}
                    style={styles.modalTxtInput}
                />
            </View>
            <View style={styles.txtinput}>
                <TextInput
                    placeholder='New Password'
                    placeholderTextColor={'black'}
                    style={styles.modalTxtInput}
                    onChangeText={(text) => this.setState({ newpassword: text })}
                    secureTextEntry={true}
                />
            </View>
            {this.state.fieldError &&
                <Text style={styles.errorText}>Fields cannot be empty</Text>
            }
            <TouchableOpacity onPress={this.changePassword} style={styles.modalButton}>
                <Text style={styles.modalButtonFont}>Change Password</Text>
            </TouchableOpacity>
        </View>
    )

    renderModalUsername = () => (
        <View style={styles.content}>
            <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => this.setState({ isVisibleUser: false })}>
                    <Icon name='ios-close-circle-outline' size={30} color='black' />
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>{i18n.t("Change_Username")}</Text>
            <View style={styles.txtinput}>
                <TextInput
                    placeholder='New Username'
                    placeholderTextColor={'black'}
                    style={styles.modalTxtInput}
                    onChangeText={(text) => this.setState({ username: text })}
                />
            </View>
            {this.state.userEmpty &&
                <Text style={styles.errorText}>User Name is required</Text>
            }
            <TouchableOpacity onPress={this.changeUsername} style={styles.modalButton}>
                <Text style={styles.modalButtonFont}>Change Username</Text>
            </TouchableOpacity>
        </View>
    )
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
    renderModalChangeMail = () => (
        <View style={styles.content}>
            <View style={styles.modalClose}>
                <TouchableOpacity onPress={() => this.setState({ isVisibleChangeMail: false })}>
                    <Icon name='ios-close-circle-outline' size={30} color='black' />
                </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Change Email</Text>
            <View style={styles.txtinput}>
                <TextInput
                    placeholder='New Email'
                    placeholderTextColor={'black'}
                    style={styles.modalTxtInput}
                    // onChangeText={(text) => this.setState({ email: text })}
                    onChangeText={(text) => this.validate(text, 'email', this.setState({ error: null }))}
                    autoCapitalize= {false}
                />
                
            </View>
            {/* {this.state.emailEmpty &&
                <Text style={styles.errorText}>Email is required</Text>
} */}
{!this.state.emailValidate && <Text style={styles.errorText}>Enter valid Email</Text>}
            <TouchableOpacity onPress={this.changeEmail} style={styles.modalButton}>
                <Text style={styles.modalButtonFont}>Change Email</Text>
                {this.state.isLoading &&
                                <ActivityIndicator size="small" color="white" style={{marginLeft: 10}}/>
                            }
            </TouchableOpacity>
        </View>
    )

    changeLanguage() {
        i18n.locale = this.state.language
        if (!this.state.user) {
            this.props.dispatch({ type: 'CHANGE_LANGUAGE', locale: this.state.language })
            // this.props.dispatch(resetPoems())
            // this.props.dispatch(getPoems())
        }
        else {
            let formdata = new FormData()
            formdata.append('language', this.state.language)
            formdata.append('appid', 1)
            Api('post', CHANGE_LANGUAGE, formdata)
                .then((response) => {
                    if (response.status == true) {
                        this.props.dispatch({ type: 'CHANGE_LANGUAGE', locale: response.language })
                        // this.props.dispatch(resetPoems())
                        // this.props.dispatch(getPoems())
                    }
                })
        }
        this.props.navigation.setParams({ title: i18n.t("Settings") })
        this.setState({ isVisible: false })
    }

    onToggleNotification(value) {
        console.log('valueeeeee', value)
        let notification = 0
        if (value)
            notification = 1
        this.setState({ notification: value })
        if (this.props.user)
            this.props.dispatch(postNotificationToggle(notification))
    }

    changeUsername() {
        if (this.state.username.length > 0) {
            this.setState({ userEmpty: false })
            this.props.dispatch(fetchChangeName(this.state.username))
            this.setState({ isVisibleUser: false })
        }
        else
            this.setState({ userEmpty: true })
    }
    changeEmail() {
        if (this.state.email.length > 0) {
            // this.setState({ fieldError: false, isLoading: true })
            this.setState({ userEmpty: false, isLoading: true })
            let formdata = new FormData()
            formdata.append('email', this.state.email)
            formdata.append('appId', 1)
            Api('post', SEND_OTP_EMAIL_CHANGE, formdata)
                .then((response) => {
                    console.log('chnage email otp response', response)
                    if (response && response.status && response.statusCode == 200) {
                        this.setState({isVisibleChangeMail: false, isLoading: false})
                        this.props.navigation.navigate('OTP', { user: this.state, page: 'changemail' })
                    } else {
                        this.setState({ isLoading: false })
                }
                    // else
                    //     this.setState({ errormessage: response.errormessage, isLoading: false })
                })
        }
        else
            this.setState({ fieldError: true })
    }

    changePassword() {
        if (this.state.currentpassword.length > 0 && this.state.newpassword.length > 0) {
            this.setState({ fieldError: false })
            let formdata = new FormData()
            formdata.append('oldPassword', this.state.currentpassword)
            formdata.append('newPassword', this.state.newpassword)
            formdata.append('appid', 1)
            Api('post', CHANGE_PASSWORD, formdata)
                .then((response) => {
                    if (response.status && response.statusCode == 200) {
                        Alert.alert('Password Changed Successfully',
                            '',
                            [
                                { text: 'OK', },
                            ],
                            { cancelable: false },
                        )
                    }
                    else
                        Alert.alert("error!")
                })
        }
        else
            this.setState({ fieldError: true })
    }

    logout() {
        if (this.props.user.auth == 4) {
            setTimeout(() => {
                this.setState({
                    logoutMoe: true
                })
            }, 500);
            setTimeout(() => {
                this.setState({
                    logoutMoe: false
                })
            }, 2000);
            Api('post', LOGOUT, { action: 'logout' })
                .then(response => {
                    console.log('response logout', response)
                    if (response.status)
                        this.props.dispatch(resetUser())
                })
        }
        else {
            Api('post', LOGOUT, { action: 'logout' })
                .then(response => {
                    console.log('response logout', response)
                    if (response.status)
                        this.props.dispatch(resetUser())
                })
        }
    }
    delete() {
        let formdata = new FormData()
            formdata.append('action', 'delete')
            
            formdata.append('appid', 1)
           console.log("delete form data",formdata)
            Api('post', DELETE,formdata )
                .then(response => {
                    console.log('response delete', response)
                    // if (response.status)
                    //     this.props.dispatch(resetUser())
                    this.setState({
                        activeAccount:true
                    })
                    setTimeout(() => {
                        this.setState({
                            activeAccountModal:true,
                            
                        })
                    }, 500);
                    
                    console.log(this.state.activeAccount)
                })
        
      
    }

    active() {
        let formdata = new FormData()
            formdata.append('action', 'undelete')
            
            formdata.append('appid', 1)
           console.log("delete form data",formdata)
            Api('post', DELETE,formdata )
                .then(response => {
                    console.log('response delete', response)
                    // if (response.status)
                    //     this.props.dispatch(resetUser())
                    this.setState({
                        activeAccount:false,
                        isVisibleUserActive:false
                    })
                    setTimeout(() => {
                        this.setState({
                            deleteAccountModal:true,
                            
                        })
                    }, 500);
                
                    
                })
        
      
    }

    render() {
        
        return (

            <SafeAreaView style={styles.mainContainer}>
                <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} style={{ paddingRight: 15, paddingLeft: 15 }}>
                        <IconMaterial name='sort' size={30} color='black' />
                    </TouchableOpacity>
                    <View style={styles.profile}>
                        {this.state.user && this.state.user.profile_pic ?
                            <TouchableOpacity disabled={this.props.user&&this.props.user.auth == 4} onPress={() => this.showMenu('addPhoto')}>
                                <Image source={this.state.image != null ? { uri: this.state.image.uri } : { uri: `${this.state.user.profile_pic}&random=${this.state.cache}` }} style={styles.image} />
                                {this.props.user && this.props.user.auth != 4 &&
                                    <View style={styles.icon}>
                                        <IconMaterial name='edit' size={16} color='#FFFFFF' />
                                    </View>
                                }
                            </TouchableOpacity>
                            : <Image source={Images.default} style={styles.image} />
                        }
                        <Text style={styles.name}>{this.state.user && this.state.user.username ? this.state.user.username : 'Guest User'}</Text>
                        {this.state?.user && this.state?.user?.email ? <Text style={styles.email}>{this.state?.user?.email}</Text> : null}
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    {!this.props.user &&
                        <TouchableOpacity style={styles.notification} onPress={() => this.props.navigation.navigate('Login', { page: 'Settings' })} >
                            <Text style={styles.loginto}>Login to Khawla Foundation{'\n'}<Text style={styles.loginsub}>for better experience</Text></Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={PRIMARY_COLOR} />
                        </TouchableOpacity>}
                    <View style={styles.notification}>
                        <Text style={styles.notificationText}>{i18n.t("Notifications")}</Text>
                        <Switch
                            value={this.state.notification}
                            onValueChange={this.onToggleNotification}
                            thumbColor='white'
                            trackColor={{ false: SECONDARY_COLOR, true: PRIMARY_COLOR }}
                            ios_backgroundColor={SECONDARY_COLOR}
                        />
                    </View>
                    <TouchableOpacity style={styles.notification} onPress={() => this.setState({ isVisible: true })}>
                        <Text style={styles.notificationText}>{i18n.t("Change_Language")}</Text>
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    </TouchableOpacity>
                    {this.props.user && this.props.user.auth != 4 &&
                        <TouchableOpacity style={styles.notification} onPress={() => this.setState({ isVisibleUser: true })}>
                            <Text style={styles.notificationText}>{i18n.t("Change_Username")}</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>}
                        {this.props.user && this.props.user.auth != 4 &&
                        <TouchableOpacity style={styles.notification} onPress={()=>this.setState({isVisibleChangeMail:true})} >
                            <Text style={styles.notificationText}>Change Email</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>}
                    {this.props.user && this.props.user.auth != 4 &&
                        <TouchableOpacity style={styles.notification} onPress={() => this.setState({ visibleModal: true })}>
                            <Text style={styles.notificationText}>{i18n.t("Change_Password")}</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>}
                    {this.props.user &&
                        <TouchableOpacity style={styles.notification} onPress={() => this.props.navigation.navigate("MyOrder")}>
                            <Text style={styles.notificationText}>My Order</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>}
                    {this.props.user &&
                        <TouchableOpacity style={styles.notification} onPress={() => this.props.navigation.navigate("Address")}>
                            <Text style={styles.notificationText}>My Address</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>}
                        {this.props.user && this.state.activeAccount ?
                         <TouchableOpacity style={styles.notification} onPress={() => this.setState({ isVisibleUserActive: true })}>
                         <Text style={styles.notificationText}>Active Account</Text>
                         <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                     </TouchableOpacity>: this.props.user && 
                        
                        <TouchableOpacity style={styles.notification} onPress={() => this.setState({ isVisibleUserDelete: true })}>
                            <Text style={styles.notificationText}>Delete Account</Text>
                            <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                        </TouchableOpacity>} 
                    {this.props.user &&
                        <TouchableOpacity style={styles.language} onPress={() => this.setState({ isVisibleLogout: true })}>
                            <Text style={styles.notificationText}>{i18n.t("Logout")}</Text>
                        </TouchableOpacity>}
                </View>
                <Modal
                    isVisible={this.state.isVisible}
                    hasBackdrop={true}
                    backdropOpacity={.02}
                    onBackButtonPress={() => this.setState({ isVisible: false })}
                    onBackdropPress={() => this.setState({ isVisible: false })}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    backdropTransitionOutTiming={0}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    style={styles.bottomModal}
                >
                    {this.renderModalContent()}
                </Modal>
                <Modal
                    isVisible={this.state.visibleModal}
                    hasBackdrop={true}
                    backdropOpacity={.02}
                    onBackButtonPress={() => this.setState({ visibleModal: false })}
                    onBackdropPress={() => this.setState({ visibleModal: false })}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    backdropTransitionOutTiming={0}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    style={styles.bottomModal}
                >
                    {Platform.OS === "ios" ?
                        <KeyboardAvoidingView behavior="padding" enabled>
                            {this.renderModalPassword()}
                        </KeyboardAvoidingView>
                        :
                        <KeyboardAvoidingView enabled>
                            {this.renderModalPassword()}
                        </KeyboardAvoidingView>
                    }
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleUser}
                    hasBackdrop={true}
                    backdropOpacity={.02}
                    onBackButtonPress={() => this.setState({ isVisibleUser: false })}
                    onBackdropPress={() => this.setState({ isVisibleUser: false })}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    backdropTransitionOutTiming={0}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    style={styles.bottomModal}
                >
                    {Platform.OS === "ios" ?
                        <KeyboardAvoidingView behavior="padding" enabled>
                            {this.renderModalUsername()}
                        </KeyboardAvoidingView>
                        :
                        <KeyboardAvoidingView enabled>
                            {this.renderModalUsername()()}
                        </KeyboardAvoidingView>
                    }
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleChangeMail}
                    hasBackdrop={true}
                    backdropOpacity={.02}
                    onBackButtonPress={() => this.setState({ isVisibleChangeMail: false })}
                    onBackdropPress={() => this.setState({ isVisibleChangeMail: false })}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    backdropTransitionOutTiming={0}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    style={styles.bottomModal}
                >
                    {Platform.OS === "ios" ?
                        <KeyboardAvoidingView behavior="padding" enabled>
                            {this.renderModalChangeMail()}
                        </KeyboardAvoidingView>
                        :
                        <KeyboardAvoidingView enabled>
                            {this.renderModalChangeMail()}
                        </KeyboardAvoidingView>
                    }
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleUserDelete}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ isVisibleUserDelete: false })}
                    onBackdropPress={() => this.setState({ isVisibleUserDelete: false })}
                    
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Delete Account</Text>
                            <View style={{borderStyle: "solid",borderBottomColor: "#EDECEC",borderBottomWidth: 0.7,textAlign:"justify"}}></View>
                            <Text style={{fontFamily:FONT_MULI_REGULAR}}>Your account data will be deleted in 30days, you can suspend deletion with in this time period</Text>
                        </View>
         
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleUserDelete: false })}>
                                <Text style={styles.cancel}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleUserDelete: false }, this.delete)} style={styles.button}>
                                <Text style={styles.subscribe}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleUserActive}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ isVisibleUserActive: false })}
                    onBackdropPress={() => this.setState({ isVisibleUserActive: false })}
                    
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Restore Account</Text>
                            <View style={{borderStyle: "solid",borderBottomColor: "#EDECEC",borderBottomWidth: 0.7,textAlign:"justify"}}></View>
                            <Text style={{fontFamily:FONT_MULI_REGULAR}}>Your delete request will be cancelled and Account will be Restored</Text>
                        </View>
         
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleUserDelete: false })}>
                                <Text style={styles.cancel}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleUserDelete: false }, this.active)} style={styles.button}>
                                <Text style={styles.subscribe}>Restore</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.activeAccountModal}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ activeAccountModal: false })}
                    onBackdropPress={() => this.setState({ activeAccountModal: false })}
                  
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                       
                        
                            <Text style={styles.modalText}> Account Deleted Successfully</Text>
                            <TouchableOpacity style={{backgroundColor:PRIMARY_COLOR,width:50,height:30,alignSelf:"center",borderRadius:10,alignItems:"center",justifyContent:"center"}} onPress={() => this.setState({ activeAccountModal: false })}>
                                <Text style={{color:"#FFF"}}>OK</Text>
                            </TouchableOpacity>
                      
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.deleteAccountModal}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ deleteAccountModal: false })}
                    onBackdropPress={() => this.setState({ deleteAccountModal: false })}
                  
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                       
                        
                            <Text style={styles.modalText}> Account Restored Successfully</Text>
                            <TouchableOpacity style={{backgroundColor:PRIMARY_COLOR,width:50,height:30,alignSelf:"center",borderRadius:10,alignItems:"center",justifyContent:"center"}} onPress={() => this.setState({ deleteAccountModal: false })}>
                                <Text style={{color:"#FFF"}}>OK</Text>
                            </TouchableOpacity>
                      
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleLogout}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ isVisibleLogout: false })}
                    onBackdropPress={() => this.setState({ isVisibleLogout: false })}
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleLogout: false })}>
                                <Text style={styles.cancel}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleLogout: false }, this.logout)} style={styles.button}>
                                <Text style={styles.subscribe}>LOGOUT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.logoutMoe}
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
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'Pick Image'}
                    options={['Take Photo', 'Choose from Library', 'Cancel']}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => { this.imagePicker(index) }}
                />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
    user: state.userLogin.user
    
})

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff'
    },
    header: {
        paddingBottom: 15,
        backgroundColor: '#fff'
    },
    profile: {
        alignItems: 'center',
        justifyContent: 'center',
        // paddingBottom: 15
    },
    image: {
        height: 80,
        aspectRatio: 1,
        borderRadius: 40,
        backgroundColor: '#dbdbdb'
    },
    icon: {
        position: 'absolute',
        zIndex: 10,
        top: 10,
        right: -5,
        backgroundColor: PRIMARY_COLOR,
        padding: 4,
        borderRadius: 15
    },
    name: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        textAlign: 'center',
        paddingTop: 10,
        color: '#182D45',
        paddingTop: 10
    },
    email: {
        paddingTop: 5
    },
    button: {
        marginTop: 10,
        backgroundColor: PRIMARY_COLOR,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 6
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 25,
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    loginto: {
        fontSize: 18,
        color: PRIMARY_COLOR
    },
    loginsub: {
        fontSize: 12,
        color: PRIMARY_COLOR
    },
    notificationText: {
        fontFamily: FONT_PRIMARY,
        fontSize: 16,
        color: '#333333',
        textAlign: 'left'
    },
    language: {
        paddingBottom: 20
    },
    bottomModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    content: {
        padding: 15,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#DDDDDD',
    },
    modalClose: {
        alignItems: 'flex-end'
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 24,
        paddingBottom: 15,
        fontFamily: FONT_SECONDARY,
        color: PRIMARY_COLOR
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: '100%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 25,
        marginBottom: 10,
        justifyContent: 'center',
    },
    modalButtonFont: {
        fontSize: 20,
        fontFamily: FONT_SECONDARY,
        color: '#FFFFFF'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginHorizontal: 5
    },
    text: {
        fontFamily: FONT_PRIMARY,
        fontSize: 15,
        color: 'black'
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: PRIMARY_COLOR,
    },
    txtinput: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        paddingLeft: 15,
        marginBottom: 20,
        borderColor: SECONDARY_COLOR
    },
    modalTxtInput: {
        height: 50,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: 'black'
    },
    errorText: {
        fontSize: 14,
        fontFamily: FONT_SECONDARY,
        color: 'red',
        textAlign: 'center',
        paddingBottom: 15
    },
    aboutPowered: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#000',
        opacity: .7,
        marginBottom: -3
    },
    aboutFounde: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#000',
        opacity: .7,
        marginBottom: -3
    },
    aboutCompany: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: FONT_PRIMARY,
        color: PRIMARY_COLOR,
        paddingBottom: 5
    },
    aboutName: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: FONT_PRIMARY,
        color: PRIMARY_COLOR,
        marginBottom: 3
    },
    aboutVersion: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        color: 'grey'
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        paddingVertical:10
    },
    modalHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: 'black',
        opacity: .9
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonCancel: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD',
       
    },
    button: {
        flex: 1,
        padding: 15,
        alignItems: 'center'
    },
    cancel: {
        paddingRight: 25,
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: FONT_PRIMARY,
    },
    subscribe: {
        color: PRIMARY_COLOR,
        fontSize: 18,
        fontFamily: FONT_PRIMARY
    },
})