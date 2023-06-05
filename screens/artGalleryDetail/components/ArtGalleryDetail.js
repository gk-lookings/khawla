import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground, TextInput, ActivityIndicator, KeyboardAvoidingView, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_BOLD, FONT_MULI_EXTRABOLD, FONT_MEDIUM, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import i18n from '../../../i18n'
import AutoHeightWebView from 'react-native-autoheight-webview'
import Api from '../../../common/api'
import { ADD_ORDER, ARTISTS, SHIPPING_INFO_USER } from '../../../common/endpoints'
import { WebView } from 'react-native-webview';
import Animation from 'lottie-react-native';
import anim from '../../../assets/animation/success.json'
import cancel from '../../../assets/animation/cancel.json';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import CheckBox from 'react-native-check-box'

const { height, width } = Dimensions.get('screen')


class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Art_gallery")}</Text>
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
            artDetail: this.props.navigation.getParam('artdata', null),
            isLoading: true,
            loading: true,
            isVisible: false,
            isVisibleImage: false,
            name: null,
            email: null,
            phone: null,
            message: null,
            validate: null,
            emailValidate: true,
            isSend: false,
            isVisiblePrice: false,
            priceError: false,
            priceSuccess: false,
            artistDetails: '',
            buyDetails: [],
            shippingInfo: [],
            confirm: [],
            orderData: [],
            payModel: false,
            addressModel: false,
            itemAddress: '',
            faildModel: false,
            isVisibleLogin: false,
            isVisibleCart: false,
            declineModel: false,
            pictures: [],
            isChange: false,
            changeLoader: false,
            addAddrsModal: false,
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
            buyModel: false,
            page: 2,
            isLastPage: false

        }
        this.onPress = this.onPress.bind(this);
        this.onSend = this.onSend.bind(this)
        this.validate = this.validate.bind(this)
        this.buyNow = this.buyNow.bind(this)
        this.isSelected = this.isSelected.bind(this)
        this.renderAddress = this.renderAddress.bind(this)
        this.footerView = this.footerView.bind(this)
        this.shippingInfo = this.shippingInfo.bind(this)
        this.shippingInfoLoad = this.shippingInfoLoad.bind(this)
    }


    componentDidMount() {

        this.props.navigation.setParams({ onPress: this.onPress })
        const artistId = this.state.artDetail.artistId
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS + '?artistId=' + artistId + `&language=${language}`)
            .then((response) => {
                if (response.items && response.items.length > 0) {
                    this.setState({
                        artistDetails: response.items[0],
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        artistDetails: '',
                        isLoading: false
                    })
                }
            })
    }


    onPress() {
        this.props.navigation.navigate('Home')
    }


    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    priceRequest() {
        let formData = new FormData()
        formData.append('action', 'contact');
        formData.append('name', this.state.name);
        formData.append('email', this.state.email);
        formData.append('phone', this.state.phone);
        formData.append('feedback', this.state.message);
        formData.append('artworkId', this.state.artDetail.artId);
        Api('post', 'https://www.khawlafoundation.com/api/contact-priceRequest.php', formData)
            .then((response) => {
                if (response.status == "success") {
                    this.setState({ isSend: false, isVisiblePrice: false })
                    setTimeout(() => {
                        this.setState({
                            priceSuccess: true,
                        })
                    }, 700);
                    setTimeout(() => {
                        this.setState({
                            priceSuccess: false
                        })
                    }, 2500);
                }
                else {
                    this.setState({ isSend: false, isVisiblePrice: false })
                    setTimeout(() => {
                        this.setState({
                            priceError: true
                        })
                    }, 700);
                    setTimeout(() => {
                        this.setState({
                            priceError: false
                        })
                    }, 2500);
                }
                this.setState({ email: null, phone: null, name: null, message: null })
            })
    }

    onSend() {
        if (this.state.name == null || this.state.name == '') {
            this.setState({ validate: 'Name cannot be empty' })
            return 0
        }
        if (this.state.phone == null || this.state.phone == '') {
            this.setState({ validate: 'Phone number cannot be empty' })
            return 0
        }
        if (this.state.email == null || this.state.email == '') {
            this.setState({ validate: 'Email cannot be empty' })
            return 0
        }
        if (!this.state.emailValidate) {
            this.setState({ validate: 'Enter valid Email' })
            return 0
        }
        if (this.state.message == null || this.state.message == '') {
            this.setState({ validate: 'Message cannot be empty' })
            return 0
        }
        else {
            this.priceRequest();
        }

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



    onPressBuy() {
        if ((this.props.user)) {
            this.shippingInfo(0)
        }
        else {
            this.setState({ isVisibleLogin: true })
        }
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
        Api('post', 'https://www.kaac.academy/api/json_user_shippinginfos.php', formD)
            .then((response) => {
                if (response.statusCode == 200) {
                    this.setState({
                        addAddrsModal: false
                    }),
                        this.shippingInfo(1)
                }
            })
    }

    addadrsOpen() {
        setTimeout(() => {
            this.setState({
                addAddrsModal: true,
            })
        }, 1000)
    }

    addadrsClose() {
        setTimeout(() => {
            this.setState({
                addressModel: true,
            })
        }, 1000)
    }
    shippingInfo(data) {
        Api('post', SHIPPING_INFO_USER + `?page=${1}`)
            .then((response) => {
                if (response) {
                    let res = response.shipping
                    if (data == 0) {
                        this.setState({
                            shippingInfo: res,
                            addressModel: true,
                            itemAddress: response.shipping[0],
                        })
                    }
                    else {
                        setTimeout(() => {
                            this.setState({
                                shippingInfo: res,
                                addressModel: true,
                                itemAddress: response.shipping[0],
                            })
                        }, 1000)
                    }
                }
            }
            )
    }

    shippingInfoLoad() {
        let page = this.state.page
        Api('post', SHIPPING_INFO_USER + `?page=${page}`)
            .then((response) => {
                if (response) {
                    let res = response.shipping
                    this.setState({
                        shippingInfo: this.state.shippingInfo.concat(res),
                        isLastPage: response.isLastPage,
                        page: this.state.page + 1
                    })
                }
            }
            )
    }

    buyNow() {

        let productId = this.state.artDetail.artId
        let formData = new FormData()
        let shippingId = this.state.itemAddress.shippingId
        formData.append('productId', productId);
        formData.append('productType', 3);
        formData.append('quantity', 1);
        formData.append('action', 'buyNow');
        formData.append('language', 2);
        formData.append('shippingId', shippingId);
        Api('post', ADD_ORDER, formData)
            .then((response) => {
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

    confirmOrder() {

        let productId = this.state.artDetail.artId
        let shippingId = this.state.itemAddress.shippingId
        let formData = new FormData()
        formData.append('productId', productId);
        formData.append('quantity', 1);
        formData.append('action', 'orderNow');
        formData.append('shippingId', shippingId);
        Api('post', ADD_ORDER, formData)
            .then((response) => {
                console.log('confirmmmmmmmmmmmmmmmmmmmm', response)
                if (response.statusCode === 200) {
                    this.setState({ confirm: response })
                    this.createOrder()
                }
                else {
                    this.setState({ buyLoading: false })
                }
            }
            )
    }

    createOrder() {

        let productId = this.state.artDetail.artId
        let productName = this.state.artDetail.artTitle
        let amount = this.state.buyDetails.totalPrice
        let orderId = this.state.confirm.orderId
        let quantity = this.state.numQuantity
        let formData = new FormData()

        formData.append('returnUrl', 'https://www.khawlafoundation.com/home')
        formData.append('productType', 4);
        formData.append('orderId', orderId)
        formData.append('amount', amount)
        formData.append('orderName', productName)
        formData.append('language', this.props.lang)
        // formData.append('customerName', 'testMerchant')

        Api('post', 'https://www.khawlafoundation.com/payment/addOrder.php', formData)
            .then((response) => {
                if (response.statusCode === 200) {
                    this.setState({ orderData: response, buyModel: false, })
                    this.orderUpdate()
                }
            }
            )

    }

    orderUpdate() {

        let orderId = this.state.confirm.orderId
        let reference = this.state.orderData.orderReference
        let formData = new FormData()
        formData.append('orderId', orderId);
        formData.append('orderReference', reference);
        formData.append('action', 'orderUpdate');
        Api('post', ADD_ORDER, formData)
            .then((response) => {
                if (response.statusCode === 200) {
                    console.log('transaction iddd', this.state.orderData.TransactionID);
                    setTimeout(() => {
                        this.setState({
                            payModel: true, confirmLoader: false
                        })
                    }, 500)
                    // Linking.openURL(this.state.orderData.secureUrlPayment)
                }
            }
            )

    }

    orderInfo() {

        let orderId = this.state.confirm.orderId
        let formData = new FormData()
        formData.append('orderId', orderId);
        Api('post', ADD_ORDER, formData)
            .then((response) => {
                if (response.statusCode === 200) {
                }
            }
            )

    }


    onSelect(value) {
        if (this.state.itemAddress != null) {
            this.setState({ itemAddress: value, })
        }
    }

    isSelected(name) {
        let status = false
        if (this.state.itemAddress.shippingId === name.shippingId)
            status = true
        return status
    }

    changeModel() {
        setTimeout(() => {
            this.setState({
                addressModel: true,
                changeLoader: false
            })
        }, 1000)
    }


    renderAddress({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onSelect(item)} style={styles.categoryList}>
                {this.isSelected(item) ?
                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 5 }} />
                    :
                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 5 }} />
                }
                <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.categoryText, { lineHeight: null }]}>{item.shippingAddress1}  </Text>
                        <View style={{ width: 1, height: 12, backgroundColor: SECONDARY_COLOR, opacity: .5 }}></View>
                        <Text style={[styles.categoryText, { lineHeight: null }]}>  {item.shippingAddress2}</Text>
                    </View>
                    <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Email:</Text> {item.email}</Text>
                    <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Mobile:</Text> {item.mobile}</Text>
                    <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Telephone:</Text> {item.telephone}</Text>
                </View>
            </TouchableOpacity>
        );
    }
   

  

    footerView() {
        if (!this.state.isLastPage) {
            return (
                <View style={{ margin: 20 }}>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else
            return null
    }


    render() {
        const artDetail = this.state.artDetail
        const imageClct = this.state.artDetail && this.state.artDetail.artPicture
        // const nf = new Intl.NumberFormat();
        const price = this.state.buyDetails.totalPrice;
        const priceItem = this.state.artDetail.price; // "1,234,567,890"
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true })}>
                                <Image
                                    source={{ uri: imageClct }}
                                    style={styles.imageCollection}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <View>
                                <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right' }, { paddingLeft: 10, marginTop: 10 }]}>{artDetail.artTitle}</Text>
                                {this.state.artDetail.isForSale == 1 && this.state.artDetail.price && this.state.artDetail.price != " " &&
                                    <Text style={[styles.titleEventPrice, this.props.lang == 'ar' && { textAlign: 'right' }, { paddingLeft: 10, marginTop: 10 }]}>Price :  AED  {priceItem}</Text>
                                }
                                {this.props.lang == 'ar' ?
                                    <AutoHeightWebView
                                        style={styles.WebView}
                                        // customScript={`document.body.style.background = 'lightyellow';`}
                                        customStyle={`
                                            * {
                                                font-family: 'Cairo-Regular';
                                            }
                                            p {
                                                font-size: 18px;
                                                margin-right: 5px;
                                            }
                                            p {
                                                text-align: right;
                                            }`
                                        }
                                        files={[{
                                            href: 'cssfileaddress',
                                            type: 'text/css',
                                            rel: 'stylesheet'
                                        }]}
                                        source={{ html: artDetail.artDescription }}
                                        scalesPageToFit={true}
                                        viewportContent={'width=device-width, user-scalable=yes'}
                                        scrollEnabled={false}
                                    /*
                                    other react-native-webview props
                                    */
                                    />
                                    :
                                    <AutoHeightWebView
                                        style={styles.WebView}
                                        // customScript={`document.body.style.background = 'lightyellow';`}
                                        customStyle={`
                                            * {
                                                font-family: 'Cairo-Regular';
                                            }
                                            p {
                                                font-size: 16px;
                                                margin-left: 5px;
                                            }`
                                        }
                                        files={[{
                                            href: 'cssfileaddress',
                                            type: 'text/css',
                                            rel: 'stylesheet'
                                        }]}
                                        source={{ html: artDetail.artDescription }}
                                        scalesPageToFit={true}
                                        viewportContent={'width=device-width, user-scalable=yes'}
                                        scrollEnabled={false}
                                    /*
                                    other react-native-webview props
                                    */
                                    />
                                }
                            </View>
                            {this.state.artistDetails != '' &&
                                <View>
                                    <View style={[styles.seperator, { marginTop: 20 }]}></View>
                                    <Text style={styles.titleEventA}>Artist</Text>
                                    <View style={styles.seperator}></View>
                                    <View style={styles.artistContainer}>
                                        <Image source={{ uri: this.state.artistDetails.picture }} style={styles.artistPic} />
                                        <View>
                                            <Text style={styles.artistName}>{this.state.artistDetails.artistTitle}</Text>
                                            <Text style={styles.artistDetail}>{this.state.artistDetails.shortDescription}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: this.state.artistDetails && this.state.artistDetails })}>
                                            <Text style={[styles.titleEventA, { color: PRIMARY_COLOR, paddingLeft: 0, fontFamily: FONT_MEDIUM, paddingBottom: 20, fontSize: 14, marginTop: 10 }]}>{i18n.t("See_more")}  {">>"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                            {artDetail.videoAvailable == 1 &&
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                    <Text style={[styles.video, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>{i18n.t("Video")}</Text>
                                    <View style={[styles.imageVideo, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>
                                        <ImageBackground blurRadius={3} source={{ uri: imageClct }} style={styles.imageBackground}>
                                            <AntDesign name="playcircleo" size={40} color="#fff" style={styles.iconContainer2} />
                                        </ImageBackground>
                                    </View>
                                </TouchableOpacity>
                            }
                            {artDetail.qrPicture && artDetail.qrPicture != '' &&
                                <View style={styles.qrContainer}>
                                    <Image style={styles.qrImage} source={{ uri: artDetail.qrPicture }} />
                                </View>
                            }
                            <Modal
                                isVisible={this.state.isVisible}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                hasBackdrop={true}
                                backdropColor='black'
                                backdropOpacity={.9}
                                onBackButtonPress={() => this.setState({ isVisible: false })}
                                onBackdropPress={() => this.setState({ isVisible: false })}
                                style={{ marginTop: 10, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                            >
                                <VideoPlayer
                                    source={{ uri: artDetail.video }}
                                    navigator={this.props.navigator}
                                    onBack={() => this.setState({ isVisible: false })}
                                />
                            </Modal>
                            <Modal
                                isVisible={this.state.isVisibleImage}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                hasBackdrop={true}
                                backdropColor='black'
                                backdropOpacity={.9}
                                onBackButtonPress={() => this.setState({ isVisibleImage: false })}
                                onBackdropPress={() => this.setState({ isVisibleImage: false })}
                                style={{}}
                            >
                                <View style={styles.imageFull}>
                                    <Image source={{ uri: imageClct }} resizeMode="contain" style={styles.imageFull} />
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                    <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </Modal>
                            <Modal
                                isVisible={this.state.isVisiblePrice}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                hasBackdrop={true}
                                backdropColor='black'
                                backdropOpacity={.7}
                                onBackButtonPress={() => this.setState({ isVisiblePrice: false })}
                                onBackdropPress={() => this.setState({ isVisiblePrice: false })}
                                style={{}}
                            >
                                <View style={styles.contactConatainer}>
                                    <TouchableOpacity onPress={() => this.setState({ isVisiblePrice: false })}>
                                        <AntDesign name="closecircleo" size={20} color="#000" style={{ alignSelf: 'flex-end', marginTop: 5 }} />
                                    </TouchableOpacity>
                                    <Text style={styles.mainHeading}>{i18n.t('price_request')}</Text>
                                    {/* <Text style={styles.subHeading}>Have some questions, we are happy to help you !</Text> */}
                                    <View>
                                        <TextField
                                            label={i18n.t("Name")}
                                            keyboardType='default'
                                            formatText={this.formatText}
                                            onSubmitEditing={this.onSubmit}
                                            tintColor={PRIMARY_COLOR}
                                            containerStyle={styles.textInput2}
                                            onChangeText={(text) => this.setState({ name: text })}
                                            labelTextStyle={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            style={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            ref={input => { this.textInput = input }}
                                        />
                                        <TextField
                                            label={i18n.t("Phone")}
                                            keyboardType='phone-pad'
                                            formatText={this.formatText}
                                            onSubmitEditing={this.onSubmit}
                                            tintColor={PRIMARY_COLOR}
                                            containerStyle={styles.textInput2}
                                            onChangeText={(text) => this.setState({ phone: text })}
                                            labelTextStyle={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            style={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            ref={input => { this.textInput = input }}
                                        />
                                        <TextField
                                            label={i18n.t("Email")}
                                            keyboardType='default'
                                            formatText={this.formatText}
                                            onSubmitEditing={this.onSubmit}
                                            tintColor={PRIMARY_COLOR}
                                            containerStyle={styles.textInput2}
                                            multiline
                                            onChangeText={(text) => this.validate(text, 'email', this.setState({ validate: null, isSend: false }))}
                                            labelTextStyle={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            style={this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }}
                                            ref={input => { this.textInput = input }}
                                        />
                                        {!this.state.emailValidate && <Text style={styles.emailValidate}>Enter valid Email</Text>}
                                        <TextInput
                                            style={[{ height: height * .15, borderWidth: .8, margin: 8, padding: 10, borderColor: 'grey', textAlign: 'right' }, this.props.lang == 'ar' ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                            placeholder="Feedback"
                                            multiline={true}
                                            onChangeText={(text) => this.setState({ message: text })}
                                            textAlignVertical='top'
                                            ref={input => { this.textInput = input }}
                                        />
                                    </View>
                                    {this.state.validate ?
                                        <Text style={styles.validateText}>{this.state.validate}</Text>
                                        :
                                        <Text></Text>
                                    }
                                    <TouchableOpacity onPress={() => this.setState({ isSend: true }, () => this.onSend())} style={styles.send}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{i18n.t("Send")}</Text>
                                        {this.state.isSend && this.state.validate == null &&
                                            <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 5 }} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.priceError}
                                backdropOpacity={0.0}
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                backdropTransitionOutTiming={0}
                                animationInTiming={100}
                                animationOutTiming={100}
                                style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                            >
                                <View style={{ width: width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ed4c4a' }}>
                                    <Text style={{ fontFamily: FONT_MULI_BOLD, fontSize: 14, paddingVertical: 1, color: 'white' }}>Some thing went wrong!</Text>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.priceSuccess}
                                backdropOpacity={0.0}
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                backdropTransitionOutTiming={0}
                                animationInTiming={100}
                                animationOutTiming={100}
                                style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                            >
                                <View style={{ width: width, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                                    <Text style={{ fontFamily: FONT_MULI_BOLD, fontSize: 14, paddingVertical: 1, color: 'white' }}>Success</Text>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.buyModel}
                                hasBackdrop={true}
                                backdropOpacity={0.5}
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                backdropTransitionOutTiming={0}
                                animationInTiming={500}
                                animationOutTiming={500}
                                style={styles.bottomModal}
                            >
                                <View style={{ backgroundColor: '#fff', padding: 10, borderTopRightRadius: 30, paddingTop: 0 }}>
                                    <View style={[styles.titleBar, { marginBottom: 0 }]}>
                                        <Text style={styles.addressTitle}>Confirm your order</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 30 }}>
                                        <Image resizeMode="contain" source={{ uri: artDetail.artPicture }} style={{ height: 120, width: 120, marginTop: 10 }} />
                                        <View style={{ marginLeft: 20 }}>
                                            <Text numberOfLines={2} style={{ fontSize: 20, fontFamily: FONT_MULI_BOLD, color: PRIMARY_COLOR, width: width / 1.9 }}>{artDetail.artTitle}</Text>
                                            <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }}>Quantity  : 1</Text>
                                            <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }}>Shipping cost  : {this.state.buyDetails.shippingCost}</Text>
                                            <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR }}>Tax  : {this.state.buyDetails.tax}</Text>
                                            <Text style={{ fontSize: 15, fontFamily: FONT_MULI_BOLD, color: PRIMARY_COLOR }}><Text style={{ fontSize: 13, color: '#000' }}>Total price  : </Text>{price} AED</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 5, marginRight: 10 }}>
                                        <Text style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD }]}>Address  </Text>
                                        {!this.state.changeLoader ?
                                            <TouchableOpacity onPress={() => this.setState({ buyModel: false, changeLoader: true }, this.changeModel())} style={styles.changeButton}>
                                                <Text style={{ color: '#2e77ff' }}>Change</Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={styles.changeButton}>
                                                <ActivityIndicator size="small" color={COLOR_SECONDARY} />
                                            </View>
                                        }
                                    </View>
                                    <View style={styles.addAddress2}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[styles.categoryText, { lineHeight: null }]}>{this.state.itemAddress && this.state.itemAddress.shippingAddress1}  </Text>
                                            <View style={{ width: 1, height: 12, backgroundColor: SECONDARY_COLOR, opacity: .5 }}></View>
                                            <Text style={[styles.categoryText, { lineHeight: null }]}>  {this.state.itemAddress && this.state.itemAddress.shippingAddress2}</Text>
                                        </View>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Email:</Text> {this.state.itemAddress && this.state.itemAddress.email}</Text>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Mobile:</Text> {this.state.itemAddress && this.state.itemAddress.mobile}</Text>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Telephone:</Text> {this.state.itemAddress && this.state.itemAddress.telephone}</Text>
                                    </View>
                                    <View style={[styles.nextButton, { marginBottom: 10 }]}>
                                        <TouchableOpacity onPress={() => this.setState({ buyModel: false })} style={styles.nextbuttonbox}>
                                            <Text style={styles.addAddressTitle}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ confirmLoader: true }, this.confirmOrder())} style={[styles.nextbuttonbox, { width: 180 }]}>
                                            <Text style={styles.addAddressTitle}>CONFIRM ORDER</Text>
                                            {!this.state.confirmLoader ?
                                                <AntDesign name="doubleright" size={16} color="#ffff" style={{ marginLeft: 5 }} />
                                                :
                                                <ActivityIndicator size="small" color='#fff' style={{ marginLeft: 5 }} />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.addressModel}
                                hasBackdrop={true}
                                backdropOpacity={0.5}
                                onBackButtonPress={() => this.setState({ addressModel: false })}
                                onBackdropPress={() => this.setState({ addressModel: false })}
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                backdropTransitionOutTiming={0}
                                animationInTiming={500}
                                animationOutTiming={500}
                                style={styles.bottomModal}
                            >
                                <View style={{ backgroundColor: '#fff', padding: 10, borderTopRightRadius: 30, paddingTop: 0, }}>
                                    <View style={styles.titleBar}>
                                        <Text style={styles.addressTitle}>Select Address</Text>
                                    </View>
                                    <View>
                                        {this.state.shippingInfo != "" ?
                                            <FlatList
                                                data={this.state.shippingInfo}
                                                renderItem={this.renderAddress}
                                                keyExtractor={(item, index) => index.toString()}
                                                ListHeaderComponent={this.renderFirst}
                                                style={{ maxHeight: height / 1.8 }}
                                                // ListFooterComponent={this.footerView}
                                                onEndReached={this.shippingInfoLoad}
                                            />
                                            :
                                            <Text style={{ marginTop: 20, marginBottom: 20, marginLeft: 5, fontFamily: FONT_MULI_REGULAR, color: SECONDARY_COLOR, fontSize: 16 }}>No address found !  please add your address</Text>
                                        }
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ addressModel: false }, this.addadrsOpen())} style={styles.addAddress}>
                                        <AntDesign name="pluscircleo" size={17} color={PRIMARY_COLOR} />
                                        <Text style={styles.addAddressTitle1}> Add new address</Text>
                                    </TouchableOpacity>
                                    <View style={[styles.nextButton, { marginRight: 5, marginBottom: 10 }]}>
                                        <TouchableOpacity onPress={() => this.setState({ addressModel: false })} style={styles.nextbuttonbox}>
                                            <Text style={styles.addAddressTitle}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity disabled={this.state.shippingInfo == "" ? true : false} onPress={() => this.setState({ addressModel: false }, this.buyNow())} style={[this.state.shippingInfo != '' ? styles.nextbuttonbox : styles.nextbuttonboxInactive]}>
                                            <Text style={styles.addAddressTitle}>NEXT</Text>
                                            <AntDesign name="doubleright" size={16} color="#ffff" style={{ marginLeft: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.payModel}
                                backdropOpacity={0.5}
                                // onBackButtonPress={() => this.setState({ isVisible: false })}
                                // onBackdropPress={() => this.setState({ isVisible: false })}
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                backdropTransitionOutTiming={0}
                                animationInTiming={100}
                                animationOutTiming={100}
                                style={{ height: height, width: width, margin: 0, backgroundColor: 'white' }}
                            >
                                <WebView
                                    style={{ flex: 1 }}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    scalesPageToFit={true}
                                    // injectedJavaScript={INJECTEDJAVASCRIPT}
                                    // onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    onShouldStartLoadWithRequest={event => {
                                        console.log('link..................transaction status.........', event.url.includes('transactionStatus=0'))
                                        if (event.url.slice(0, 37) === 'https://www.khawlafoundation.com/home') {
                                            // Linking.openURL(event.url)
                                            if (event.url.includes('transactionStatus=0')) {
                                                this.setState({ payModel: false })
                                                setTimeout(() => {
                                                    this.setState({
                                                        faildModel: true
                                                    })
                                                    this.animation.play();
                                                }, 500)
                                                setTimeout(() => {
                                                    this.setState({
                                                        faildModel: false
                                                    })
                                                }, 2500)
                                                // this.orderInfo()
                                            }
                                            else if (event.url.includes('transactionStatus=1')) {
                                                this.setState({ payModel: false, })
                                                setTimeout(() => {
                                                    this.setState({
                                                        successModel: true
                                                    })
                                                    this.animation.play();
                                                }, 500)
                                                setTimeout(() => {
                                                    this.setState({
                                                        successModel: false
                                                    })
                                                }, 2000)
                                                // this.orderInfo()
                                            } else if (event.url.includes('transactionStatus=-1')) {
                                                this.setState({ payModel: false, })
                                                setTimeout(() => {
                                                    this.setState({
                                                        declineModel: true
                                                    })
                                                }, 500)
                                                setTimeout(() => {
                                                    this.setState({
                                                        declineModel: false
                                                    })
                                                }, 2000)
                                                // this.orderInfo()
                                            }
                                            return false
                                        }
                                        return true
                                    }}
                                    // source={{uri: this.state.orderData.PaymentPortal,   body: JSON.stringify({name: 'TransactionID',value:this.state.orderData.TransactionID }) ,method:'POST'}}
                                    source={{
                                        html: `<html><body onload="document.forms[0].submit();">
                                                <form action=${this.state.orderData.PaymentPortal} method="post">
                                                <input type='Hidden' name='TransactionID' value="${this.state.orderData.TransactionID}"/>
                                                <input type="submit" value="Submit" style="opacity:0"></form></html>`}}
                                />
                            </Modal>
                            <Modal
                                isVisible={this.state.faildModel}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='slideOutRight'
                                animationInTiming={800}
                                animationOutTiming={500}
                                style={styles.modal}>
                                {!this.state.cartLoading &&
                                    <View style={styles.fullModel}>
                                        <Animation
                                            ref={animation => {
                                                this.animation = animation;
                                            }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                            }}
                                            loop={true}
                                            source={cancel}
                                        />
                                        <Text style={styles.modalTextSuccess}>Payment canceled</Text>
                                    </View>
                                }
                                {this.state.cartLoading &&
                                    <View style={styles.containerModal}>
                                        <ActivityIndicator size="small" color={PRIMARY_COLOR}></ActivityIndicator>
                                    </View>
                                }
                            </Modal>
                            <Modal
                                isVisible={this.state.successModel}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='slideOutRight'
                                animationInTiming={800}
                                animationOutTiming={500}
                                style={styles.modal}>
                                {!this.state.cartLoading &&
                                    <View style={styles.fullModel}>
                                        <Animation
                                            ref={animation => {
                                                this.animation = animation;
                                            }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                            }}
                                            loop={true}
                                            source={anim}
                                        />
                                        <Text style={styles.modalTextSuccess}>Payment success</Text>
                                    </View>
                                }
                                {this.state.cartLoading &&
                                    <View style={styles.containerModal}>
                                        <ActivityIndicator size="small" color={PRIMARY_COLOR}></ActivityIndicator>
                                    </View>
                                }
                            </Modal>
                            <Modal
                                isVisible={this.state.declineModel}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='slideOutRight'
                                animationInTiming={800}
                                animationOutTiming={500}
                                style={styles.modal}>
                                {!this.state.cartLoading &&
                                    <View style={styles.fullModel}>
                                        <IconMaterial name='error-outline' size={80} color='red' />
                                        <Text style={styles.modalTextFaild}>Payment Declined!</Text>
                                    </View>
                                }
                                {this.state.cartLoading &&
                                    <View style={styles.containerModal}>
                                        <ActivityIndicator size="small" color={PRIMARY_COLOR}></ActivityIndicator>
                                    </View>
                                }
                            </Modal>
                            <Modal
                                isVisible={this.state.isVisibleLogin}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                animationOutTiming={300}
                                onBackButtonPress={() => this.setState({ isVisibleLogin: false })}
                                onBackdropPress={() => this.setState({ isVisibleLogin: false })}
                                style={styles.modal}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalText}>Please Login to continue</Text>
                                    </View>
                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleLogin: false })}>
                                            <Text style={styles.cancel}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ isVisibleLogin: false }, () => this.props.navigation.navigate('Login', { page: 'OnlineShopping', data: this.state.artDetail }))} style={styles.button2}>
                                            <Text style={styles.subscribe}>LOGIN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.addAddrsModal}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='slideOutRight'
                                animationInTiming={800}
                                animationOutTiming={500}
                                style={styles.modal}>
                                <View style={styles.addressForm}>
                                    <Text style={styles.addAddressText}>Add Address</Text>
                                    <View style={styles.seperator2}></View>
                                    <KeyboardAvoidingView style={styles.addressContainer}>
                                        <View style={[styles.textInputBox, { marginTop: 10 }]}>
                                            <FontAwesome name='address-book-o' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        </View>
                                        <View style={styles.textInputBox}>
                                            <FontAwesome name='address-book-o' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        </View>
                                        <View style={styles.textInputBox}>
                                            <Entypo name='location' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        </View>
                                        <View style={styles.textInputBox}>
                                            <Entypo name='email' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        </View>
                                        {!this.state.emailValidate && <Text style={styles.emailValidate}>Enter valid Email</Text>}
                                        <View style={styles.textInputBox}>
                                            <IconMaterial name='local-phone' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        </View>
                                        <View style={styles.textInputBox}>
                                            <Entypo name='mobile' size={25} color={SECONDARY_COLOR} style={styles.iconSub} />
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
                                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 30 }}>
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
                                        <View style={[styles.nextButton, { marginRight: 35 }]}>
                                            <TouchableOpacity onPress={() => this.setState({ addAddrsModal: false }, this.addadrsClose)} style={styles.nextbuttonbox}>
                                                <Text style={styles.addAddressTitle}>CANCEL</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.onSave()} style={styles.nextbuttonbox}>
                                                <Text style={styles.addAddressTitle}>SAVE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </KeyboardAvoidingView>
                                </View>
                            </Modal>
                        </ScrollView>
                        {this.state.artDetail.isForSale == 0 &&
                            <TouchableOpacity onPress={() => this.setState({ isVisiblePrice: true })} style={styles.priceContainer}>
                                <Text style={styles.priceText}>{i18n.t('price_request')}</Text>
                            </TouchableOpacity>
                        }
                        {this.state.artDetail.isForSale == 1 &&
                            <TouchableOpacity onPress={() => this.onPressBuy()} style={styles.buyNowContainer}>
                                <Text style={styles.priceText}>Buy now</Text>
                            </TouchableOpacity>
                        }
                        {this.state.artDetail.isForSale == 2 &&
                            <View style={styles.soldOutContainer}>
                                <Text style={styles.priceText}>Sold out</Text>
                            </View>
                        }
                    </View>
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
    user: state.userLogin.user,
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD,
        lineHeight: 25,
        width: width - 90
    },
    titleEventPrice: {
        fontSize: 15,
        textAlign: 'left',
        paddingRight: 10,
        fontFamily: FONT_MULI_REGULAR,
        lineHeight: 25,
        width: width - 90,
    },
    titleEventA: {
        fontSize: 17,
        textAlign: 'left',
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD,
        paddingLeft: 10,
    },
    video: {
        textAlign: 'center',
        fontSize: 18,
        color: PRIMARY_COLOR,
        marginTop: 20,
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
        marginRight: 10,
        paddingLeft: 10
    },
    imageCollection: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    imageVideo: {
        height: 80,
        width: 100,
        marginTop: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 10,
        paddingLeft: 20
    },
    imageBackground: {
        height: 65,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer2: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
    },
    WebView: {
        width: width * .94,
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
    priceContainer: {
        backgroundColor: 'green',
        width: width - 100,
        alignSelf: 'center',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        position: 'absolute',
        bottom: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    buyNowContainer: {
        backgroundColor: PRIMARY_COLOR,
        width: width - 100,
        alignSelf: 'center',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        position: 'absolute',
        bottom: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    soldOutContainer: {
        backgroundColor: SECONDARY_COLOR,
        width: width - 200,
        alignSelf: 'center',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        position: 'absolute',
        bottom: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    priceText: {
        fontSize: 16,
        fontFamily: FONT_MULI_BOLD,
        color: '#fff'
    },
    contactConatainer: {
        backgroundColor: '#fff',
        margin: 8,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    mainHeading: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 10,
        fontFamily: FONT_MULI_EXTRABOLD
    },
    textInput2: {
        marginLeft: 10,
        marginRight: 10,
    },
    send: {
        height: height * .05,
        width: '28%',
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 10,
        flexDirection: 'row'
    },
    emailValidate: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        marginLeft: 10,
    },
    validateText: {
        color: PRIMARY_COLOR,
        marginLeft: 10,
    },
    artistPic: {
        height: 80,
        width: 80,
        borderRadius: 40,
        marginHorizontal: 10,
        alignSelf: 'center'
    },
    artistName: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        alignSelf: 'center'
    },
    artistDetail: {
        fontSize: 15,
        fontFamily: FONT_PRIMARY,
        alignSelf: 'center',
        color: SECONDARY_COLOR
    },
    artistContainer: {
        padding: 10,
        marginTop: 30
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height / 1.2
    },
    seperator: {
        height: .4,
        width: width - 20,
        backgroundColor: SECONDARY_COLOR,
        alignSelf: 'center',
        borderRadius: 10
    },
    addressTitle: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        color: '#fff',
        marginLeft: 10
    },
    addAddressTitle: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 15,
        color: '#fff'
    },
    addAddressTitle1: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 14,
        marginLeft: 10,
        color: SECONDARY_COLOR
    },
    addAddress: {
        flexDirection: 'row',
        padding: 5,
        borderRadius: 8,
        width: width - 18,
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ebeced',
    },
    addAddress2: {
        padding: 5,
        borderRadius: 8,
        alignSelf: 'flex-end',
        width: width - 18,
        alignSelf: 'center',
        marginBottom: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ebeced',
    },
    nextButton: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        width: width - 20,
        alignSelf: 'center',
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
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
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonCancel: {
        padding: 15,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD'
    },
    button2: {
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
    fullModel: {
        height: height,
        width: width,
        margin: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryText: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 15,
        lineHeight: 20
    },
    nextbuttonbox: {
        backgroundColor: PRIMARY_COLOR,
        height: '100%',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 7,
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2
    },
    nextbuttonboxInactive: {
        backgroundColor: PRIMARY_COLOR,
        height: '100%',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 7,
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2,
        opacity: .5
    },
    titleBar: {
        height: 32,
        backgroundColor: PRIMARY_COLOR,
        width: width,
        borderTopRightRadius: 30,
        marginLeft: -10,
        justifyContent: 'center',
        marginBottom: 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowRadius: 2,
        elevation: 2
    },
    changeButton: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        margin: 5
    },
    addressForm: {
        backgroundColor: '#fff',
        width: width - 30,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 10
    },
    addAddressText: {
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD,
        fontSize: 16
    },
    textInput: {
        height: height * .065,
        width: '90%',
        borderRadius: 10,
        paddingLeft: 5,
        alignSelf: 'center'
    },
    textInputBox: {
        width: '98%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconSub: {
        width: '10%',
    },
    emailValidate: {
        marginLeft: 45,
        color: 'red',
        marginBottom: 10
    },
    validationText: {
        marginLeft: 10,
        color: 'red'
    },
    seperator2: {
        height: 1,
        backgroundColor: '#ebeced',
        width: width - 30,
        alignSelf: 'center'
    },
    bottomModal: {
        margin: 0,
        justifyContent: 'flex-end',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    categoryList: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    qrContainer:{
        marginVertical: 30,
        alignSelf:'center'
    },
    qrImage:{
        width: width/1.2,
        height: width/1.2
    }
})
export default connect(mapStateToProps)(App)