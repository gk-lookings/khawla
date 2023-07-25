import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Dimensions, Alert } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Foundation from 'react-native-vector-icons/Foundation'
import Entypo from 'react-native-vector-icons/Entypo'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ARTISTS_COUNTRY } from '../../../common/endpoints'

const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginBottom: 10, width: width / 2 }}>
                    <Image resizeMode='contain' source={Images.logoLetterNew} style={{ height: 45, width: width / 2 }} />
                    <View>
                        {/* <Image source={Images.logo} style={{ height: 39.2, width: 9.28, marginLeft: 5 }} /> */}
                    </View>
                </View>
            ),
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
                color: 'black',
                fontSize: 23,
                fontWeight: 'bold',
                fontFamily: FONT_PRIMARY,
            },
            headerRight: (
                <TouchableOpacity onPress={navigation.getParam('onPress')} style={{ marginRight: 10 }}>
                    <AntDesign name='closecircleo' size={20} color={'#000'} style={{}} />
                </TouchableOpacity>),
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 10 }}>
                    <IconMaterial name='sort' size={30} color='black' />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            loading: true,
            portrait: 1,
            name: '',
            dob: '',
            email: '',
            nationality: '',
            location: '',
            contact: '',
            category: '1',
            other: '',
            orientation: '',
            height: '',
            width: '',
            budget: '',
            notes: '',
            error: null,
            emailValidate: true,
            validate: null,
            countryItem: []
        }
        this.onPress = this.onPress.bind(this)
    }

    componentDidMount() {
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS_COUNTRY + `?language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Art,.,..,...", responseJson)
                    this.setState({
                        countryItem: responseJson,
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
    }

    componentDidUpdate(prevProps) {
        // if (prevProps.lang != this.props.lang) {
        //     this.getData()
        // }
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }
    onSelect(value) {
        if (this.state.item1 != null) {
            this.setState({ item1: value, filterItem1: 'item' })
        }
    }

    isSelected(name) {
        let status = false
        if (this.state.item.title === name.title)
            status = true
        return status
    }

    dropDown(rowData) {
        return (
            <TouchableOpacity style={styles.modalDropContainer}>
                <Text style={styles.dropText}>{rowData.title}</Text>
            </TouchableOpacity>
        )
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

    renderButtonText(rowData) {
        return `${rowData.title}`;
    }

    onSubmit() {
        console.log('iiiiiajhajhjha', this.state.nationality)
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
        if (this.state.dob == null || this.state.dob == '') {
            this.setState({ validate: 'Date of birth cannot be empty' })
            return 0
        }
        if (this.state.nationality == null || this.state.nationality == '') {
            this.setState({ validate: 'Nationality cannot be empty' })
            return 0
        }
        if (this.state.location == null || this.state.location == '') {
            this.setState({ validate: 'Location cannot be empty' })
            return 0
        }
        if (this.state.contact == null || this.state.contact == '') {
            this.setState({ validate: 'Contact info cannot be empty' })
            return 0
        }
        if (this.state.category == null || this.state.category == '') {
            this.setState({ validate: 'Category cannot be empty' })
            return 0
        }
        if (this.state.portrait == null || this.state.portrait == '') {
            this.setState({ validate: 'Orientation cannot be empty' })
            return 0
        }
        if (this.state.height == null || this.state.height == '') {
            this.setState({ validate: 'Hight cannot be empty' })
            return 0
        }
        if (this.state.width == null || this.state.width == '') {
            this.setState({ validate: 'Width cannot be empty' })
            return 0
        }
        if (this.state.budget == null || this.state.budget == '') {
            this.setState({ validate: 'Budget cannot be empty' })
            return 0
        }

        if (this.state.email !== null && this.state.emailValidate) {
            // {this.confirmSubmit()}
            console.log('ok')
        }
    }

    confirmSubmit() {
        let name = this.state.name
        let dob = this.state.dob
        let email = this.state.email
        let nationality = this.state.nationality
        let location = this.state.location
        let contact = this.state.contact
        let category = this.state.category
        let other = this.state.other
        let orientation = this.state.orientation
        let height = this.state.height
        let width = this.state.width
        let budget = this.state.budget
        let notes = this.state.notes
        let formData = new FormData()
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('action', 'buyNow');
        formData.append('language', 2);
        formData.append('shippingId', shippingId);
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('action', 'buyNow');
        formData.append('language', 2);
        formData.append('shippingId', shippingId);
        Api('post', ADD_ORDER, formData)
            .then((response) => {
                console.log('byyyyyyyyyyyyyyyyynnwwwwwwwwwww', response)
                if (response.statusCode === 200) {
                    setTimeout(() => {
                        this.setState({
                            buyModel: true, buyDetails: response
                        })
                    }, 500)
                }
                else {
                    this.setState({ buyLoading: false })
                }
            }
            )

    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <KeyboardAwareScrollView>
                    <View style={styles.logoContainer} >
                        <Image
                            source={Images.logoLetterNew}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>
                        ARTWORK REQUEST FORM
                    </Text>
                    <View style={styles.inputContainer}>
                        <TextField
                            label="Name*"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.setState({ name: text })}
                            ref={input => { this.textInput = input }}
                        />
                        <DatePicker
                            style={{ width: '45%', marginTop: 20 }}
                            date={this.state.dob}
                            mode="datetime"
                            placeholder="Date of Birth*"
                            format="YYYY-MM-DD"
                            minDate="1950-05-01"
                            maxDate="2021-05-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 0,
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => { this.setState({ dob: date }) }}
                        />
                        <TextField
                            label="Email*"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.validate(text, 'email', this.setState({ error: null }))}
                            ref={input => { this.textInput = input }}
                        />
                        {!this.state.emailValidate && <Text style={styles.validationText}>Enter valid Email</Text>}
                        <View style={styles.dropStyles}>
                            <ModalDropdown
                                showsVerticalScrollIndicator={false}
                                options={this.state.countryItem}
                                disabled={this.state.isModalVisible}
                                dropdownTextStyle={{ textAlign: 'center', fontSize: 15 }}
                                dropdownStyle={styles.dropDown}
                                defaultValue="Nationality*"
                                style={styles.dropStyles1}
                                textStyle={{ fontSize: 16, color: SECONDARY_COLOR }}
                                renderRow={(rowData, rowID) => this.dropDown(rowData)}
                                renderButtonText={(rowData) => this.renderButtonText(rowData)}
                                onSelect={(idx, value) => this.setState({ nationality: value.countryId })}
                            >
                            </ModalDropdown>
                            <AntDesign name="caretdown" size={13} style={{ paddingBottom: 10 }} color={SECONDARY_COLOR} />
                        </View>
                        <TextField
                            label="Location*"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.setState({ location: text })}
                            ref={input => { this.textInput = input }}
                        />
                        <TextField
                            label="Contact Info*"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.setState({ contact: text })}
                            ref={input => { this.textInput = input }}
                        />
                        <View style={styles.dropStyles}>
                            <ModalDropdown
                                //ref={el => refs = el}
                                showsVerticalScrollIndicator={false}
                                options={["My orders", "data"]}
                                disabled={this.state.isModalVisible}
                                dropdownTextStyle={{ textAlign: 'center', fontSize: 15 }}
                                dropdownStyle={styles.dropDown}
                                defaultValue="Category*"
                                style={styles.dropStyles1}
                                textStyle={{ fontSize: 16, color: SECONDARY_COLOR }}
                            // renderRow={(rowData, rowID, highlighted) => this.dropDown(rowData, rowID, highlighted)}
                            >
                            </ModalDropdown>
                            <AntDesign name="caretdown" size={13} style={{ paddingBottom: 10 }} color={SECONDARY_COLOR} />
                        </View>
                        <TextField
                            label="Other"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.setState({ other: text })}
                            ref={input => { this.textInput = input }}
                        />
                        <Text style={{ marginTop: 20, marginBottom: 2, color: SECONDARY_COLOR }}>Orientation*</Text>
                        <View style={styles.orientation}>
                            <TouchableOpacity onPress={() => this.setState({ portrait: 1 })} style={styles.boxes}>
                                {this.state.portrait == 1 ?
                                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} />
                                    :
                                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} />
                                }
                                <View style={styles.icons}>
                                    <Entypo name="document-landscape" size={35} />
                                    <Text style={styles.iconText}>Landscape</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ portrait: 2 })} style={styles.boxes}>
                                {this.state.portrait == 2 ?
                                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} />
                                    :
                                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} />
                                }
                                <View style={styles.icons}>
                                    <Foundation name="tablet-portrait" size={40} />
                                    <Text style={styles.iconText}>Portrait</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ portrait: 3 })} style={styles.boxes}>
                                {this.state.portrait == 3 ?
                                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} />
                                    :
                                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} />
                                }
                                <View style={styles.icons}>
                                    <Fontisto name="checkbox-passive" size={30} />
                                    <Text style={styles.iconText}>Square</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextField
                                label="Hight (cm)*"
                                keyboardType='default'
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput2}
                                onChangeText={(text) => this.setState({ height: text })}
                                ref={input => { this.textInput = input }}
                            />
                            <TextField
                                label="Width (cm)*"
                                keyboardType='default'
                                tintColor={PRIMARY_COLOR}
                                containerStyle={styles.textInput2}
                                onChangeText={(text) => this.setState({ width: text })}
                                ref={input => { this.textInput = input }}
                            />
                        </View>
                        <TextField
                            label="Budget (in dollers)*"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInput}
                            onChangeText={(text) => this.setState({ budget: text })}
                            ref={input => { this.textInput = input }}
                        />
                        <OutlinedTextField
                            label="Notes"
                            keyboardType='default'
                            tintColor={PRIMARY_COLOR}
                            containerStyle={styles.textInputOutline}
                            onChangeText={(text) => this.setState({ notes: text })}
                            ref={input => { this.textInput = input }}
                            multiline={true}
                        />
                        {this.state.validate &&
                            <Text style={styles.validationText}>{this.state.validate}</Text>
                        }
                        {this.state.error && !this.state.validate &&
                            <Text style={styles.validationText}>{this.state.error}</Text>
                        }
                        <TouchableOpacity onPress={() => this.onSubmit()} style={styles.submitButton}>
                            <Text style={styles.submitText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'rgb(255, 250, 245)'
    },
    titleMain: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: "#fff",
        padding: 5
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_BOLD
    },
    content: {
        textAlign: 'justify',
        fontSize: 16,
        fontFamily: FONT_MULI_REGULAR,
        marginTop: 10
    },
    containerMain: {
        backgroundColor: PRIMARY_COLOR,
    },
    container: {
        padding: 8,
        margin: 8,
    },
    containerFirst: {
        margin: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 170,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoLetter: {
        height: 30,
        width: height / 5
    },
    logo: {
        height: 39.2,
        width: 9.28,
        marginLeft: 5
    },
    WebView: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#fff',
    },
    logoContainer: {
        width: '100%',
        alignItems: 'flex-end',
    },
    image: {
        width: 210,
        height: 100,
        marginRight: 10
    },
    inputContainer: {
        margin: 25,
    },
    textInput: {
    },
    textInput2: {
        width: '45%'
    },
    textInputOutline: {
        marginTop: 15
    },
    dropDown: {
        width: '88%',
        borderWidth: 1,
        marginTop: 10
    },
    dropStyles: {
        height: 55,
        justifyContent: 'space-between',
        borderBottomWidth: .3,
        borderColor: SECONDARY_COLOR,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dropStyles1: {
        height: 55,
        justifyContent: 'flex-end',
        width: '90%',
        paddingBottom: 10,
    },
    orientation: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderWidth: .5,
        borderRadius: 5,
        borderColor: SECONDARY_COLOR
    },
    boxes: {
        height: 60,
        width: '33.3%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icons: {
        marginLeft: 10,
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconText: {
        fontSize: 11,
    },
    submitButton: {
        width: '70%',
        height: 45,
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR,
        marginTop: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitText: {
        fontSize: 15,
        color: 'white',
        fontFamily: FONT_MULI_BOLD
    },
    validationText: {
        color: '#ff6161',
        fontSize: 14,
        fontFamily: FONT_MULI_REGULAR
    },
    modalDropContainer: {
        height: 35,
        paddingHorizontal: 15
    },
    dropText: {
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD
    }
})
export default connect(mapStateToProps)(App)