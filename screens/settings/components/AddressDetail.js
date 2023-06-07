import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native'
import Images from '../../../assets/images'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { SHIPPING_INFO_USER } from '../../../common/endpoints'
import Api from '../../../common/api'
import { SafeAreaView } from 'react-navigation'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import Fontisto from 'react-native-vector-icons/Fontisto'
import i18n from '../../../i18n'
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import { connect } from 'react-redux'
import CheckBox from 'react-native-check-box'
import Modal from "react-native-modal"
import { FONT_PRIMARY } from '../../../assets/fonts'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>Add Address</Text>
                </View>
            ),
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
                color: 'black',
                fontSize: 23,
                fontWeight: 'bold',
            },

            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            address: [],
            address1: null,
            address2: null,
            email: null,
            emailValidate: true,
            phone: null,
            mobile: null,
            validate: null,
            error: null,
            country: null,
            isChecked: false,
            isVisible: false
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    saveAddress() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let formD = new FormData
        formD.append('language', language)
        formD.append('address_1', this.state.address1)
        formD.append('address_2', this.state.address2)
        formD.append('email', this.state.email)
        formD.append('mobile', this.state.mobile)
        formD.append('country', this.state.country)
        formD.append('telephone', this.state.phone)
        formD.append('isDefault', this.state.isChecked ? 1 : 0)
        formD.append('action', 'add')
        Api('post', SHIPPING_INFO_USER, formD)
            .then((response) => {
                if (response.statusCode == 200) {
                    console.log('address................', response)
                    this.setState({
                        isVisible: true
                    })
                }
            })
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

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArticleDetail", { article: item })} style={styles.listStyle}>
                <Image
                    source={{ uri: item.articlePicture }}
                    style={styles.imageStyle}
                />
                <View style={styles.borderLine}>
                </View>
                <View style={{ width: '50%' }}>
                    <Text numberOfLines={2} style={styles.programText}>{item.articleTitle}</Text>
                    <Text numberOfLines={1} style={styles.date}>{item.articleDisplayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    onSave() {
        if (this.state.address1 == null || this.state.address1 == '') {
            this.setState({ validate: 'Address cannot be empty' })
            return 0
        }
        if (this.state.address2 == null || this.state.address2 == '') {
            this.setState({ validate: 'Address cannot be empty' })
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
        if (this.state.phone == null || this.state.phone == '') {
            this.setState({ validate: 'Phone cannot be empty' })
            return 0
        }
        if (this.state.mobile == null || this.state.mobile == '') {
            this.setState({ validate: 'Mobile cannot be empty' })
            return 0
        }
        if (this.state.country == null || this.state.country == '') {
            this.setState({ validate: 'Country cannot be empty' })
            return 0
        }

        if ((this.state.email !== null) && this.state.emailValidate) {
            this.saveAddress()
            this.setState({ validate: null })
        }
    }

    render() {
        console.log('aaaadddaddda0,', this.state.address)
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.textContainer}>
                        <View style={styles.iconContainer}>
                            <FontAwesome name='address-book-o' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
                            <FontAwesome name='address-book-o' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
                            <EvilIcons name='location' size={30}  color={SECONDARY_COLOR} style={styles.iconSub} />
                            <Fontisto name='at' size={23}  color={SECONDARY_COLOR} style={styles.iconSub} />
                            <IconMaterial name='local-phone' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
                            <Entypo name='mobile' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
                        </View>
                        <View style={styles.addressContainer}>
                            <OutlinedTextField
                                label="Address"
                                keyboardType='default'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.setState({ address1: text })}
                                lineWidth={1}
                            />
                            <OutlinedTextField
                                label="Address line 2"
                                keyboardType='default'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.setState({ address2: text })}
                                lineWidth={1}
                            />
                            <OutlinedTextField
                                label="Country"
                                keyboardType='default'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.setState({ country: text })}
                                secureTextEntry={this.state.showpswrd}
                                lineWidth={1}
                            />
                            <OutlinedTextField
                                label="Email"
                                keyboardType='email-address'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.validate(text, 'email', this.setState({ error: null }))}
                                secureTextEntry={this.state.showpswrd}
                                lineWidth={1}
                            />
                            {!this.state.emailValidate && <Text style={styles.emailValidate}>Enter valid Email</Text>}
                            <OutlinedTextField
                                label="Phone"
                                keyboardType='number-pad'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.setState({ phone: text })}
                                lineWidth={1}
                                ref={phone => { this.textInput = phone }}
                            />
                            <OutlinedTextField
                                label="Mobile"
                                keyboardType='number-pad'
                                formatText={this.formatText}
                                onSubmitEditing={this.onSubmit}
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput}
                                onChangeText={(text) => this.setState({ mobile: text })}
                                lineWidth={1}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 57 }}>
                        <CheckBox
                            style={{ marginLeft: 10, }}
                            onClick={() => {
                                this.setState({
                                    isChecked: !this.state.isChecked
                                })
                            }}
                            isChecked={this.state.isChecked}
                        />
                        <Text style={{ marginLeft: 10, fontSize: 16, marginTop: 2, color: SECONDARY_COLOR }}>Default</Text>
                    </View>
                    {this.state.validate &&
                        <Text style={styles.validationText}>{this.state.validate}</Text>
                    }
                    <TouchableOpacity onPress={() => this.onSave()} style={styles.addAddress}>
                        <Text style={styles.addresstext}>SAVE</Text>
                    </TouchableOpacity>
                    <Modal
                        isVisible={this.state.isVisible}
                        hideModalContentWhileAnimating={true}
                        animationIn='zoomIn'
                        animationOut='zoomOut'
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        animationOutTiming={300}
                        style={styles.modal}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalText}>Address saved</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.buttonCancel} onPress={() => this.props.navigation.navigate('Address')}>
                                    <Text style={styles.cancel}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
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
        backgroundColor: '#fff',
    },
    indicator: {
        backgroundColor: 'red',
    },
    tabBar: {
        backgroundColor: '#fff',
        elevation: 0,
        height: 40
    },
    mainHeader: {
        paddingRight: 15,
        paddingLeft: 15
    },
    programText: {
        fontSize: 17,
    },
    date: {
        fontSize: 15,
        color: SECONDARY_COLOR,
        marginTop: 10
    },
    imageStyle: {
        height: height / 6.5,
        width: height / 6.5,
        alignSelf: 'center',
        borderRadius: 5
    },
    listStyle: {
        width: width - 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .6
    },
    backButton: {
        paddingRight: 15,
        paddingLeft: 15
    },
    mainTitleText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    borderLine: {
        width: 1,
        height: 80,
        backgroundColor: 'grey',
        marginLeft: 20,
        marginRight: 10,
        opacity: .5
    },
    addAddress: {
        width: '95%',
        height: 50,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
        marginTop: 20,
        marginBottom: 30
    },
    addresstext: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    textInput: {
        height: height * .065,
        width: '98%',
        borderRadius: 10,
        paddingLeft: 5,
        color: '#000',
        marginTop: 25,
        alignSelf: 'center'
    },
    textContainer: {
        flexDirection: 'row',
    },
    emailValidate: {
        marginLeft: 10,
        color: 'red',
        marginTop: 10
    },
    validationText: {
        marginLeft: 10,
        color: 'red'
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 15,
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
        padding: 5,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD'
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
    addressContainer: {
        width: '83%',
    },
    iconContainer: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    iconSub: {
        height: height * .071,
        marginTop: 20
    }
})
export default connect(mapStateToProps)(App)