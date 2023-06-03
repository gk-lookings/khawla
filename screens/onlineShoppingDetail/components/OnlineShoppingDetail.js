import React, { Component } from 'react'
import { View, StyleSheet, Text, StatusBar, TouchableOpacity, FlatList, Dimensions, Image, ScrollView, PixelRatio, Alert, TextInput, ImageBackground, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native'
// import { Badge, Toast, Root } from 'native-base'
import Swiper from 'react-native-swiper'
import { NavigationActions } from 'react-navigation'
import Modal from 'react-native-modal'
// import Slider from '../../../components/react-native-slider'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { COLOR_SECONDARY, NAV_COLOR, COLOR_PRIMARY, BORDER_COLOR, DRAWER_COLOR, COLOR_ERROR, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY, FONT_BOLD, FONT_MULI_REGULAR, FONT_MULI_BOLD, FONT_MEDIUM } from '../../../assets/fonts'
import Images from '../../../assets/images'
import Api from '../../../common/api'
import { CART, ADD_ORDER, SHIPPING_INFO_USER, PRODUCT_LISTING } from '../../../common/endpoints'
import { WebView } from 'react-native-webview';
import Animation from 'lottie-react-native';
import anim from '../../../assets/animation/success.json';
import cancel from '../../../assets/animation/cancel.json';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import CheckBox from 'react-native-check-box'
import i18n from '../../../i18n'
import { formatRate } from '../../../utils/formatRate'
const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
const { height, width } = Dimensions.get('screen')

var FONT_SEARCH = 16

if (PixelRatio.get() <= 2) {
    FONT_SEARCH = 14
}

class App extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            isSplitVisible: false,
            toggle: false,
            option: null,
            selectedMonth: [],
            numQuantity: 1,
            cartCount: 0,
            isFavourite: false,
            cartType: this.props.navigation.getParam('offerType', 'Standard'),
            value: 0,
            data: [],
            brandCredit: [],
            buyLoading: false,
            cartLoading: false,
            isLoading: true,
            offerDetail: null,
            cartAdded: false,
            cartItems: [],
            error: false,
            products: [],
            productData: this.props.navigation.getParam('products', null),
            buyModel: false,
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
            confirmLoader: false,
            pageShip: 2,
            isLastPageShip: false,
            addressChanged: this.props.navigation.getParam('toShop', true),
        }
        // PRIMARY_COLOR = select(store.getState())
        this.remove = this.remove.bind(this)
        this.add = this.add.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.gotoCart = this.gotoCart.bind(this)
        this.sendDetails = this.sendDetails.bind(this)
        this.buyNow = this.buyNow.bind(this)
        this.isSelected = this.isSelected.bind(this)
        this.renderAddress = this.renderAddress.bind(this)
        this.footerViewShip = this.footerViewShip.bind(this)
        this.shippingLoadMore = this.shippingLoadMore.bind(this)
    }

    componentDidMount() {
        var language = this.props.lang == 'ar' ? 1 : 2
        var productData = this.props.navigation.getParam('products', null)
        Api('get', PRODUCT_LISTING + `?language=${language}&productId=${productData.productId}`)
            .then((response) => {
                if (response) {
                    console.log('daaaaaaaaaaaaatttttttttttaaaaa', response.items[0])
                    this.setState({ products: response.items[0], pictures: response.items[0].pictures })
                }
            })
    }

    addressNavigate = data => {
        console.log('back datataaa', data)
        this.setState(data);
    };

    remove() {
        if (this.state.numQuantity > 1) {
            this.setState({ numQuantity: this.state.numQuantity - 1 })
        }
    }

    add() {
        this.setState({ numQuantity: this.state.numQuantity + 1 })
    }


    addToCart() {
        let productId = this.state.products.productId
        let quantity = this.state.numQuantity
        if (this.state.numQuantity > 0) {
            this.sendDetails({ productId, quantity })
        }
    }

    gotoCart() {
        if ((this.props.user)) {

            this.setState({ isModalVisible: false })
            this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Cart' }))
        }
        else {
            this.setState({ isVisibleCart: true })
        }
    }

    sendDetails(body) {

        let productId = body.productId
        let quantity = body.quantity
        let formData = new FormData()
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('action', 'add');
        Api('post', CART, formData)
            .then((response) => {
                console.log('respppppppppoooooooooooonsssssssssssseeeeeeeeee', response)
                if (response) {
                    console.log('succcccceesssssssss')
                    this.setState({ cartLoading: false })
                }
                else {
                    this.setState({ cartLoading: false, buyLoading: false })
                }
            }
            )
    }

    onPressBuy() {
        if ((this.props.user)) {
            this.shippingInfo(0)
        }
        else {
            this.setState({ isVisibleLogin: true })
        }
    }

    shippingInfo(data) {
        Api('post', SHIPPING_INFO_USER + `?page=${1}`)
            .then((response) => {
                console.log('shipping inffffffffffffooo', response, 'datdatdtdatd', data)
                if (response) {
                    if (data == 0) {
                        this.setState({ shippingInfo: response.shipping, addressModel: true, itemAddress: response.shipping[0] })
                    }
                    else {
                        setTimeout(() => {
                            this.setState({ shippingInfo: response.shipping, addressModel: true, itemAddress: response.shipping[0] })
                        }, 1000)
                    }
                }
            }
            )

    }

    shippingLoadMore() {
        let page = this.state.pageShip
        Api('post', SHIPPING_INFO_USER + `?page=${page}`)
            .then((response) => {
                let res = response.shipping
                if (response) {
                    this.setState({
                        shippingInfo: this.state.shippingInfo.concat(res),
                        isLastPageShip: response.isLastPage,
                        pageShip: this.state.pageShip + 1
                    })
                }
            }
            )
    }

    buyNow() {

        let productId = this.state.products.productId
        let quantity = this.state.numQuantity
        let formData = new FormData()
        let shippingId = this.state.itemAddress.shippingId
        formData.append('productId', productId);
        formData.append('productType', 1);
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

    confirmOrder() {

        let productId = this.state.products.productId
        let quantity = this.state.numQuantity
        let shippingId = this.state.itemAddress.shippingId
        let formData = new FormData()
        formData.append('productId', productId);
        formData.append('quantity', quantity);
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

        let productId = this.state.products.productId
        let productName = this.state.products.productName
        let prductNameShort = productName.substring(0, 25)
        let amount = this.state.buyDetails.totalPrice
        let orderId = this.state.confirm.orderId
        let quantity = this.state.numQuantity
        let formData = new FormData()

        formData.append('returnUrl', 'https://www.khawlafoundation.com/home')
        formData.append('productType', 1);
        formData.append('orderId', orderId)
        formData.append('amount', amount)
        formData.append('orderName', prductNameShort)
        formData.append('language', this.props.lang)
        // formData.append('customerName', 'testMerchant')

        Api('post', 'https://www.khawlafoundation.com/payment/addOrder.php', formData)
            .then((response) => {
                console.log('reeeeeeeeeeeeecattttt', response)
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
                console.log('upppppppppppppdddddddddddtee', response)
                if (response.statusCode === 200) {
                    console.log('order updated')
                    console.log('transaction iddd', this.state.orderData.TransactionID);
                    setTimeout(() => {
                        this.setState({
                            payModel: true, confirmLoader: false
                        })
                    }, 500)
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
                console.log('ordddddddddeeeeeeeeeeeerrrrrrrrrriinfo', response)
                if (response.statusCode === 200) {
                    console.log('order infof')
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
            <TouchableOpacity onPress={() => this.onSelect(item)} style={[styles.categoryList,this.props.lang == 'ar' && {flexDirection:'row-reverse'}]}>
                {this.isSelected(item) ?
                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 3 }} />
                    :
                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 3 }} />
                }
                <View style={{ marginHorizontal: 10 }}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' },this.props.lang == 'ar' && {flexDirection:'row-reverse'}]}>
                        <Text style={[styles.categoryText, { lineHeight: null },this.props.lang == 'ar' && {textAlign:'right'}]}>{item.shippingAddress1}  </Text>
                        <View style={{ width: 1, height: 12, backgroundColor: SECONDARY_COLOR, opacity: .5 }}></View>
                        <Text style={[styles.categoryText, { lineHeight: null },this.props.lang == 'ar' && {textAlign:'right'}]}>  {item.shippingAddress2}</Text>
                    </View>
                    <Text style={styles.categoryText}><Text style={[{ color: SECONDARY_COLOR, fontSize: 14 },this.props.lang == 'ar' && {textAlign:'right'}]}>{i18n.t("Email")}:</Text> {item.email}</Text>
                    <Text style={styles.categoryText}><Text style={[{ color: SECONDARY_COLOR, fontSize: 14 },this.props.lang == 'ar' && {textAlign:'right'}]}>{i18n.t("Phone")}:</Text> {item.mobile}</Text>
                    <Text style={styles.categoryText}><Text style={[{ color: SECONDARY_COLOR, fontSize: 14 },this.props.lang == 'ar' && {textAlign:'right'}]}>{i18n.t("Phone")}:</Text> {item.telephone}</Text>
                </View>
            </TouchableOpacity>
        );
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
            this.setState({ validate: null, pageShip: 2 })
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
                    console.log('address................', response)
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

    footerViewShip() {
        if (!this.state.isLastPageShip) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else return null
    }

    render() {
        const product = this.state.products
        console.log('nav from.....', this.state.addressChanged);
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='default' translucent={false} />
                <View style={styles.headerStrip}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backArrow}>
                        <Icon name='ios-arrow-back' size={24} color={NAV_COLOR} />
                    </TouchableOpacity>
                    <View style={styles.cart}>
                        <TouchableOpacity style={styles.goCart} onPress={this.gotoCart} >
                            <IconMaterial name='shopping-cart' size={28} color={NAV_COLOR} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.swiper}>
                        <Swiper
                            key={this.state.pictures.length}
                            showsPagination={true}
                            activeDotColor={PRIMARY_COLOR}
                            loop={false}
                            dotStyle={{ borderWidth: 1, borderColor: '#FFFFFF' }}
                            paginationStyle={{ position: 'absolute', top: height * .28 }}
                        >
                            {this.state.pictures.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} >
                                        <Image source={{ uri: item }} style={styles.sliderImage} />
                                    </TouchableOpacity>
                                )
                            }
                            )}
                        </Swiper>
                    </View>
                    <View style={styles.content}>
                    <Text style={styles.title2}>{product.categoryName}</Text>
                        <Text style={[styles.brand,{fontSize:20,lineHeight:28}]}>{product.productName}</Text>
                        <Text style={[styles.brand,{color:"#a78f60",fontSize:14}]} onPress={()=>this.props.navigation.navigate('ArtistDetail',{ artistId:product.artistId })}>{product.artistName} </Text>
                        
                        <Text numberOfLines={3} style={styles.title}>{product.productShortDescription}</Text>
                        <Text style={[styles.aud, { color: PRIMARY_COLOR }]}>{formatRate(product.productPriceUsd)} USD</Text>
                        <Text style={[styles.aud, { color: PRIMARY_COLOR,fontSize:16,fontFamily:FONT_MEDIUM }]}>{formatRate(product.productPriceAed)} AED</Text>
                        {product.categoryId == 2 ? null :
                        <View style={styles.row}>
                            <View style={styles.details}>
                                <Text style={styles.textDetails}>{i18n.t("category")}</Text>
                                <Text style={styles.textDetails}>{i18n.t("units")}</Text>
                                <Text style={styles.textDetails}>{i18n.t("weight")}</Text>
                                <Text style={styles.textDetails}>Manufacturing Date</Text>
                            </View>
                            
                            <View style={styles.details}>
                                <Text style={styles.detailCount}>{product.categoryName}</Text>
                                <Text style={styles.detailCount}>{product.productStock} {i18n.t("units_available")}</Text>
                                <Text style={styles.detailCount}>{product.productWeight} {product.productWeightUnit}</Text>
                                <Text style={styles.detailCount}>{product.productCreateDate}</Text>
                            </View>
                             
                        </View>
                        }
                    </View>
                    {product.categoryId == 2 ? null :
                    <View style={styles.viewQuantity}>
                        <View style={styles.orderQuantity}>
                            <Text style={styles.textOrderQuantity}>{i18n.t("quantity")}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15 }} onPress={this.remove}>
                                    <IconMaterial name='remove' size={24} color={BORDER_COLOR} />
                                </TouchableOpacity>
                                <View style={[styles.box, { borderColor: PRIMARY_COLOR }]}>
                                    <TextInput
                                        keyboardType='number-pad'
                                        maxLength={4}
                                        style={styles.number}
                                        value={this.state.numQuantity.toString()}
                                        onChangeText={(text) => this.setState({ numQuantity: text })}
                                    // onEndEditing={this.changeQuantity}
                                    />
                                </View>
                                <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15 }} onPress={this.add}>
                                    <IconMaterial name='add' size={24} color={BORDER_COLOR} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    }
                    <View style={styles.description}>
                        <Text style={styles.suggestedPrice}>{product.productLongDescription}</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.add} onPress={() => this.setState({ isModalVisible: true, cartLoading: true }, () => this.addToCart())}>

                            <Text style={styles.textBuy}>{i18n.t("add_to_cart")}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buy, { backgroundColor: PRIMARY_COLOR }]} onPress={() => this.onPressBuy()}>
                            <Text style={styles.textBuy}>{i18n.t("buy_now")}</Text>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Modal
                    isVisible={this.state.isModalVisible}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    backdropTransitionOutTiming={0}
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    onBackButtonPress={() => this.setState({ isModalVisible: false })}
                    onBackdropPress={() => this.setState({ isModalVisible: false })}
                    style={styles.modal}>
                    {!this.state.cartLoading &&
                        <View style={styles.containerModal}>
                            <View style={styles.modalClose}>
                                <IconMaterial name='close' size={24} color='#AAAAAA' onPress={() => this.setState({ isModalVisible: false })} />
                            </View>
                            <Feather name='check-circle' size={50} color='green' style={{ marginTop: 25 }} />
                            <Text style={styles.modalText}>Product successfully added to cart</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={styles.searchCategory} onPress={this.gotoCart}>
                                    <Text style={styles.buttonText2}>{i18n.t("go_to_cart")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.searchBrand2} onPress={() => this.setState({ isModalVisible: false })}>
                                    <Text style={styles.buttonText2}>{i18n.t("continue_shoppig")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {this.state.cartLoading &&
                        <View style={styles.containerModal}>
                            <ActivityIndicator size="small" color={PRIMARY_COLOR}></ActivityIndicator>
                        </View>
                    }
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
                        <View style={[{ flexDirection: 'row', alignItems: 'center', paddingBottom: 30 }, this.props.lang == 'ar' && { flexDirection: "row-reverse" }]}>
                            <Image resizeMode="contain" source={{ uri: product.productPicture }} style={{ height: 120, width: 120, marginTop: 10 }} />
                            <View style={{ marginHorizontal: 20 }}>
                                <Text numberOfLines={2} style={[{ fontSize: 20, fontFamily: FONT_MULI_BOLD, color: PRIMARY_COLOR, width: width / 2 }, this.props.lang == 'ar' && { textAlign: 'right' }]}>{product.productName}</Text>
                                <Text style={[{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }, this.props.lang == 'ar' && { textAlign: 'right' }]}>{i18n.t("quantity")}  : {this.state.numQuantity}</Text>
                                <Text style={[{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }, this.props.lang == 'ar' && { textAlign: 'right' }]}>{i18n.t("shipping_cost")}  : {this.state.buyDetails.shippingCost}</Text>
                                <Text style={[{ fontSize: 13, fontFamily: FONT_MULI_REGULAR }, this.props.lang == 'ar' && { textAlign: 'right' }]}>{i18n.t("tax")}  : {this.state.buyDetails.tax}</Text>
                                <Text style={[{ fontSize: 15, fontFamily: FONT_MULI_BOLD, color: PRIMARY_COLOR }, this.props.lang == 'ar' && { textAlign: 'right' }]}><Text style={{ fontSize: 13, color: '#000' }}>{i18n.t("total_cost")}  : </Text>{this.state.buyDetails.totalPrice} USD</Text>
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 5, marginRight: 10 }, this.props.lang == 'ar' && { flexDirection: "row-reverse" }]}>
                            <Text style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD }]}>{i18n.t("shipping_detail")}  </Text>
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
                            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.props.lang == 'ar' && { flexDirection: 'row-reverse'}]}>
                                <Text style={[styles.categoryText, { lineHeight: null }, this.props.lang == 'ar' && { textAlign: 'right'}]}>{this.state.itemAddress && this.state.itemAddress.shippingAddress1}  </Text>
                                <View style={{ width: 1, height: 12, backgroundColor: SECONDARY_COLOR, opacity: .5 }}></View>
                                <Text style={[styles.categoryText, { lineHeight: null }, this.props.lang == 'ar' && { textAlign: 'right'}]}>  {this.state.itemAddress && this.state.itemAddress.shippingAddress2}</Text>
                            </View>
                            <Text style={[styles.categoryText, this.props.lang == 'ar' && { textAlign: 'right' }]}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>{i18n.t("Email")}:</Text> {this.state.itemAddress && this.state.itemAddress.email}</Text>
                            <Text style={[styles.categoryText, this.props.lang == 'ar' && { textAlign: 'right' }]}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>{i18n.t("Phone")}:</Text> {this.state.itemAddress && this.state.itemAddress.mobile}</Text>
                            <Text style={[styles.categoryText, this.props.lang == 'ar' && { textAlign: 'right' }]}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>{i18n.t("Phone")}:</Text> {this.state.itemAddress && this.state.itemAddress.telephone}</Text>
                        </View>
                        <View style={[styles.nextButton, { marginBottom: 10 }]}>
                            <TouchableOpacity onPress={() => this.setState({ buyModel: false, pageShip: 2 })} style={styles.nextbuttonbox}>
                                <Text style={styles.addAddressTitle}>{i18n.t("CANCEL")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ confirmLoader: true, pageShip: 2 }, this.confirmOrder())} style={[styles.nextbuttonbox, { width: 180 }]}>
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
                            <Text style={[styles.addressTitle,this.props.lang == 'ar' && {textAlign:'right'}]}>{i18n.t("pick_address")}</Text>
                        </View>
                        <View>
                            {this.state.shippingInfo != "" ?
                                <FlatList
                                    data={this.state.shippingInfo}
                                    renderItem={this.renderAddress}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListHeaderComponent={this.renderFirst}
                                    style={{ maxHeight: height / 1.8 }}
                                    onEndReached={this.shippingLoadMore}
                                    ListFooterComponent={this.footerViewShip}
                                />
                                :
                                <Text style={{ marginTop: 20, marginBottom: 20, marginLeft: 5, fontFamily: FONT_MULI_REGULAR, color: SECONDARY_COLOR, fontSize: 16 }}>No address found !  please add your address</Text>
                            }
                        </View>
                        <TouchableOpacity onPress={() => this.setState({ addressModel: false }, () => this.props.navigation.navigate("Address"))} style={[styles.addAddress,this.props.lang == 'ar' && {flexDirection:'row-reverse'}]}>
                            <AntDesign name="pluscircleo" size={17} color={PRIMARY_COLOR} />
                            <Text style={styles.addAddressTitle1}>{i18n.t("add_new")}</Text>
                        </TouchableOpacity>
                        <View style={[styles.nextButton, { marginRight: 5, marginBottom: 10 }]}>
                            <TouchableOpacity onPress={() => this.setState({ addressModel: false, pageShip: 2 })} style={styles.nextbuttonbox}>
                                <Text style={styles.addAddressTitle}>{i18n.t("CANCEL")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.shippingInfo == "" ? true : false} onPress={() => this.setState({ addressModel: false }, this.buyNow())} style={[this.state.shippingInfo != '' ? styles.nextbuttonbox : styles.nextbuttonboxInactive]}>
                                <Text style={styles.addAddressTitle}>{i18n.t("next")}</Text>
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
                    style={{ height: height, width: width, margin: 0 }}
                >
                    <WebView
                        style={{ flex: 1 }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        // injectedJavaScript={INJECTEDJAVASCRIPT}
                        // onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                        onShouldStartLoadWithRequest={event => {
                            console.log('link..................134.........', event.url)
                            console.log('link..................slice.........', event.url.slice(0, 33) === 'https://www.khawlafoundation.com/')
                            console.log('link..................transaction status.........', event.url.includes('transactionStatus=0'))
                            if (event.url.slice(0, 37) === 'https://www.khawlafoundation.com/home') {
                                // Linking.openURL(event.url)
                                console.log('link...........................', event.url)
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
                        <input type="submit" value="Submit"></form></html>`}}
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
                            <TouchableOpacity onPress={() => this.setState({ isVisibleLogin: false }, () => this.props.navigation.navigate('Login', { page: 'OnlineShopping', data: this.state.products }))} style={styles.button2}>
                                <Text style={styles.subscribe}>LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={this.state.isVisibleCart}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    animationOutTiming={300}
                    onBackButtonPress={() => this.setState({ isVisibleCart: false })}
                    onBackdropPress={() => this.setState({ isVisibleCart: false })}
                    style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Please Login to continue</Text>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleCart: false })}>
                                <Text style={styles.cancel}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleCart: false }, () => this.props.navigation.navigate('Login', { page: 'OnlineShopping', data: this.state.products }))} style={styles.button2}>
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
            </SafeAreaView >
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.userLogin.user,
    lang: state.programmes.lang,
})

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: DRAWER_COLOR
    },
    headerStrip: {
        paddingRight: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: BORDER_COLOR
    },
    backArrow: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 15
    },
    cart: {
        flex: 1,
        alignItems: 'flex-end'
    },
    goCart: {
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    absoluteBadge: {
        position: 'absolute',
        right: -11,
        top: 0,
        zIndex: 10,
        borderWidth: 4,
        borderColor: DRAWER_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBadge: {
        color: 'white',
        fontSize: 11,
        textAlign: 'center'
    },
    modalSplitDelivery: {
        margin: 0
    },
    modalSplit: {
        width: '100%',
    },
    modalHeader: {
        height: 50,
        backgroundColor: COLOR_PRIMARY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    split: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    splitAvailable: {
        backgroundColor: '#333333',
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 15
    },
    available: {
        paddingLeft: 15,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    modalFlatlist: {
        paddingTop: 15
    },
    splitCard: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    color: {
        paddingLeft: 5,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        lineHeight: 20
    },
    subContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    remove: {
        backgroundColor: '#333333',
        borderWidth: 3,
        borderColor: '#333333'
    },
    boxSplit: {
        height: 30,
        width: 60,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxSplitActive: {
        height: 30,
        width: 60,
        borderWidth: 1,
        borderColor: COLOR_PRIMARY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addContainer: {
        backgroundColor: COLOR_PRIMARY,
        borderWidth: 3,
        borderColor: COLOR_PRIMARY
    },
    error: {
        textAlign: 'center',
        fontSize: 14,
        color: COLOR_ERROR,
        paddingBottom: 10,
        fontFamily: FONT_SECONDARY
    },
    splitFooter: {
        backgroundColor: '#333333',
        padding: 15
    },
    done: {
        backgroundColor: COLOR_PRIMARY,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    doneSplit: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    swiper: {
        height: height * .3,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    sliderImage: {
        height: '90%',
        width: width,
        resizeMode: 'contain',
    },
    textSecure: {
        fontSize: 30,
        fontFamily: FONT_BOLD,
        color: COLOR_PRIMARY,
        transform: [{ rotate: '320deg' }],
    },
    content: {
        paddingTop: 20,
        paddingLeft: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    absolute: {
        height: 48,
        width: 48,
        borderRadius: 24,
        position: 'absolute',
        right: 30,
        top: -24,
        zIndex: 10,
        elevation: 3,
        backgroundColor: DRAWER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: .3,
    },
    brand: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
        lineHeight: 23,
        textTransform: 'uppercase'
    },
    title: {
        fontSize: 15,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
    },
    title2: {
        fontSize: 15,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
    },
    suggestedPrice: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        paddingBottom: 10
    },
    aud: {
        fontSize: 22,
        fontFamily: FONT_SECONDARY,
        color: COLOR_PRIMARY,
        paddingBottom: 15
    },
    brandCredit: {
        paddingBottom: 15,
        alignItems: 'flex-start',
        paddingRight: 15
    },
    creditAvailable: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 20,
    },
    textCredit: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    useCredit: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR,
        paddingTop: 15,
        paddingBottom: 5
    },
    slider: {
        width: '100%'
    },
    sliderThumb: {
        height: 30,
        width: 30,
        borderRadius: 25,
        elevation: 3,
        backgroundColor: DRAWER_COLOR,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: .3,
    },
    value: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15
    },
    minValue: {
        fontSize: 15,
        fontFamily: FONT_SECONDARY,
        color: COLOR_PRIMARY
    },
    maxValue: {
        flex: 1,
        fontSize: 15,
        fontFamily: FONT_SECONDARY,
        color: COLOR_PRIMARY,
        textAlign: 'right'
    },
    row: {
        flexDirection: 'row'
    },
    details: {
        flex: 1
    },
    textDetails: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        lineHeight: 22
    },
    detailCount: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        lineHeight: 22
    },
    viewQuantity: {
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    orderQuantity: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    orderQty: {
        padding: 15,
    },
    headerQuantity: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    textHeaderQuantity: {
        fontSize: 14,
        fontFamily: FONT_SECONDARY,
        color: COLOR_SECONDARY
    },
    cardQuantity: {
        flexDirection: 'row',
        paddingBottom: 15,
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    contentQty: {
        flex: 1,
        justifyContent: 'center'
    },
    textQty: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY
    },
    contentBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxCalender: {
        height: 40,
        width: 40,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentPrice: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    textPrice: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: COLOR_PRIMARY
    },
    gst: {
        fontSize: 12,
        fontFamily: FONT_PRIMARY,
        color: COLOR_PRIMARY
    },
    textOrderQuantity: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR
    },
    quantity: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textQuantity: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR,
        marginBottom: 5
    },
    textSelect: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
    },
    flatlist: {
        paddingLeft: 15,
        paddingRight: 15
    },
    headerColor: {
        padding: 15,
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: BORDER_COLOR,
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR
    },
    textHeader: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA'
    },
    box: {
        height: 30,
        width: 60,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: COLOR_PRIMARY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    number: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
        paddingBottom: 0,
        paddingTop: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    supplierName: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        paddingBottom: 10,
        paddingTop: 10,
        textAlign: 'left',
        paddingLeft: 15,
    },
    shipping: {
        padding: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    description: {
        padding: 15
    },
    textDescription: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        lineHeight: 20
    },
    button: {
        padding: 15,
        flexDirection: 'row',
    },
    add: {
        flex: 1,
        padding: 15,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        margin: 4
    },
    textAdd: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    buy: {
        flex: 1,
        padding: 15,
        backgroundColor: COLOR_PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        margin: 4
    },
    textBuy: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    containerModal: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center'
    },
    modalClose: {
        position: 'absolute',
        top: 10,
        right: 15,
        zIndex: 1
    },
    modalText: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        lineHeight: 22,
        textAlign: 'center',
        paddingTop: 25,
        paddingBottom: 10
    },
    modalTextFaild: {
        fontSize: 20,
        fontFamily: FONT_PRIMARY,
        color: 'red',
        lineHeight: 22,
        textAlign: 'center',
        paddingTop: 25,
        paddingBottom: 10
    },
    modalTextSuccess: {
        fontSize: 20,
        fontFamily: FONT_PRIMARY,
        color: 'green',
        lineHeight: 22,
        textAlign: 'center',
        paddingTop: 25,
        paddingBottom: 10
    },
    buttonText2: {
        fontSize: 13,
        fontFamily: FONT_MEDIUM,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    buttonText: {
        fontSize: FONT_SEARCH,
        fontFamily: FONT_PRIMARY,
        color: '#FFFFFF',
    },
    searchBrand: {
        backgroundColor: '#AAAAAA',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        marginTop: 10
    },
    searchBrand2: {
        backgroundColor: '#AAAAAA',
        width: '50%',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        padding: 5,
    },
    searchCategory: {
        backgroundColor: PRIMARY_COLOR,
        width: '50%',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        paddingVertical: 10
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
        backgroundColor: 'white',
    },
    addressTitle: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        color: '#fff',
        marginHorizontal: 10
    },
    addAddressTitle: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 15,
        color: '#fff'
    },
    addAddressTitle1: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 14,
        marginHorizontal: 10,
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
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD'
    },
    button2: {
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
        color: '#000',
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
})