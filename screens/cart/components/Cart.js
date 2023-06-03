import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView, Dimensions, FlatList, ActivityIndicator, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY, BORDER_COLOR } from '../../../assets/color'
import Api from '../../../common/api'
import VideoPlayer from 'react-native-video-controls';
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT, FONT_MEDIUM } from '../../../assets/fonts'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Images from '../../../assets/images'
import Modal from "react-native-modal"
import i18n from '../../../i18n'
import { WebView } from 'react-native-webview';
import Hyperlink from 'react-native-hyperlink'
import { ORDER_USER, CART, SHIPPING_INFO_USER, ADD_ORDER, } from '../../../common/endpoints'
import Animation from 'lottie-react-native';
import anim from '../../../assets/animation/success.json';
import cancel from '../../../assets/animation/cancel.json';
import { TextField, OutlinedTextField } from 'react-native-material-textfield';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import CheckBox from 'react-native-check-box'
import { formatRate } from '../../../utils/formatRate'
const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '



const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>Cart</Text>
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
            isLoading: true,
            cart: [],
            addressModel: false,
            shippingInfo: [],
            itemAddress: [],
            buyDetails: '',
            addLoader: false,
            buyLoader: false,
            confirm: [],
            orderData: [],
            confirmLoader: false,
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
            payModel: false,
            successModel: false,
            declineModel: false,
            cartLoading: false,
            page: 1,
            isLastPage: false,
            pageShip: 2,
            isLastPageShip: false
        }
        this.onPress = this.onPress.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.renderCart = this.renderCart.bind(this);
        this.getData = this.getData.bind(this);
        this.onPressClose = this.onPressClose.bind(this);
        this.isSelected = this.isSelected.bind(this)
        this.renderAddress = this.renderAddress.bind(this)
        this.buyNow = this.buyNow.bind(this)
        this.confirmOrder = this.confirmOrder.bind(this)
        this.onSave = this.onSave.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.footerView = this.footerView.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.footerViewShip = this.footerViewShip.bind(this)
        this.shippingLoadMore = this.shippingLoadMore.bind(this)
    }
    componentDidMount() {
        this.getData()
    }

    getData() {
        let page = this.state.page
        let formData = new FormData()
        formData.append('page', 1);
        formData.append('language', 2);
        Api('post', ORDER_USER + `?page=${page}`, formData)
            .then((response) => {
                console.log('ussssssssssssseeeeeeeeeeeeerrrrrrrrrr', response)
                if (response) {
                    let res = response.items
                    this.setState({
                        cart: this.state.cart.concat(res),
                        isLoading: false,
                        isLastPage: response.isLastPage,
                        page: this.state.page + 1
                    })
                }
                else {
                    this.setState({ isLoading: false })
                }
            }
            )
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    onPressClose(item) {
        Alert.alert(
            "Do you want to remove product from your cart?",
            "",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.removeItem(item) }
            ],
            { cancelable: false }
        );
    }

    removeItem(item) {
        let formData = new FormData()
        formData.append('productId', item.productId);
        formData.append('quantity', item.quantity);
        formData.append('action', 'delete');
        Api('post', CART, formData)
            .then((response) => {
                if (response) {
                    console.log('reeeeeeeeemmooooooooooov', response)
                    this.setState({page: 1, isLoading: true, cart: []})
                    this.getData()
                }
            }
            )
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.lang != this.props.lang) {
    //         this.getData()
    //     }
    // }

    renderCart({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OnlineShoppingDetail', { products: item })} style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.productPicture }} style={styles.image} resizeMode='contain' />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.productCartDescription}</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.price}><Text style={styles.priceText}>Price:</Text> {formatRate(item.productPriceUsd)} USD</Text>
                    <Text style={styles.priceText1}><Text style={styles.priceText1}>          :</Text> {formatRate(item.productPriceAed)} AED</Text>
                </View>
                <TouchableOpacity onPress={() => this.onPressClose(item)} style={styles.closeButtenContainer}>
                    <AntDesign name="closecircleo" size={20} color="#AAAAAA" />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    renderCartListing({ item }) {
        return (
            <View style={styles.containerList}>
                <View style={styles.imageContainerList}>
                    <Image source={{ uri: item.productPicture }} style={styles.image} resizeMode='contain' />
                </View>
                <View style={styles.itemContainer}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.price}><Text style={styles.priceText}>Price:</Text> {item.price} USD</Text>
                </View>
            </View>
        )
    }

    openLink(link) {
        Linking.canOpenURL(link)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle url: " + link)
                } else {
                    return Linking.openURL(link)
                }
            })
            .catch((err) => console.error('An error occurred', err))
    }

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
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

    shippingInfo(data) {
        Api('post', SHIPPING_INFO_USER + `?page=${1}`)
            .then((response) => {
                console.log('shipping inffffffffffffooo', response, 'datdatdtdatd', data)
                if (response) {
                    if (data == 0) {
                        this.setState({ 
                            shippingInfo: response.shipping, 
                            addressModel: true, 
                            itemAddress: response.shipping[0], 
                            addLoader: false 
                        })
                    }
                    else {
                        setTimeout(() => {
                            this.setState({ shippingInfo: response.shipping, 
                                addressModel: true, 
                                itemAddress: response.shipping[0], 
                                addLoader: false 
                            })
                        }, 1000)
                    }
                }
            }
            )

    }

    shippingLoadMore(){
        let page = this.state.pageShip
        Api('post', SHIPPING_INFO_USER + `?page=${page}`)
            .then((response) => {
                let res= response.shipping
                if (response) {
                        this.setState({ 
                            shippingInfo: this.state.shippingInfo.concat(res), 
                            isLastPageShip: response.isLastPage,
                            pageShip: this.state.pageShip+1
                        })
                }
            }
            )
    }

    renderAddress({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onSelect(item)} style={styles.categoryList}>
                {this.isSelected(item) ?
                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 3 }} />
                    :
                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} style={{ marginTop: 3 }} />
                }
                <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
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

    confirmOrder() {
        let productId = this.state.cart[0].productId
        let quantity = (this.state.cart && this.state.cart.reduce((a, v) => a = a + v.quantity, 0))
        let shippingId = this.state.itemAddress.shippingId
        let formData = new FormData()
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('action', 'orderCart');
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

    buyNow() {

        let productId = this.state.cart[0].productId
        let quantity = (this.state.cart.reduce((a, v) => a = a + v.quantity, 0))
        let formData = new FormData()
        let shippingId = this.state.itemAddress.shippingId
        formData.append('productId', productId);
        formData.append('quantity', quantity);
        formData.append('action', 'confirmCart');
        formData.append('language', 2);
        formData.append('shippingId', shippingId);
        Api('post', ADD_ORDER, formData)
            .then((response) => {
                console.log('byyyyyyyyyyyyyyyyynnwwwwwwwwwww', response)
                if (response.statusCode === 200) {
                    setTimeout(() => {
                        this.setState({
                            buyModel: true, buyDetails: response, buyLoader: false,
                        })
                    }, 500)
                }
                else {
                    this.setState({ buyLoading: false })
                }
            }
            )

    }

    // createOrder() {

    //     let productId = this.state.cart[0].productId
    //     let productName = this.state.cart[0].productName
    //     let amount = this.state.buyDetails.totalPrice
    //     let orderId = this.state.confirm.orderId
    //     let quantity = (this.state.cart.reduce((a, v) => a = a + v.quantity, 0))
    //     let formData = new FormData()
    //     formData.append('productId', productId);
    //     formData.append('productName', productName);
    //     formData.append('amount', amount);
    //     formData.append('unique', Date.now().toString());
    //     formData.append('quantity', quantity);
    //     formData.append('returnUrl', `https://www.khawlafoundation.com/product/${productId}/0`);
    //     formData.append('orderId', orderId);
    //     Api('post', 'https://www.khawlafoundation.com/createOrder.php', formData)
    //         .then((response) => {
    //             console.log('reeeeeeeeeeeeecattttt', response)
    //             if (response.statusCode === 200) {
    //                 this.setState({ orderData: response, buyModel: false, })
    //                 this.orderUpdate()
    //             }
    //         }
    //         )

    // }

    createOrder() {

        let productId = this.state.cart[0].productId
        let productName = this.state.cart[0].productName
        let prductNameShort = productName.substring(0, 25)
        let amount = this.state.buyDetails.totalPrice
        let orderId = this.state.confirm.orderId
        let quantity = (this.state.cart.reduce((a, v) => a = a + v.quantity, 0))
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
                    setTimeout(() => {
                        this.setState({
                            confirmLoader: false, payModel: true
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
                console.log('ordddddddddeeeeeeeeeeeerrrrrrrrrriinfo', response)
                if (response.statusCode === 200) {
                    console.log('order infof')
                }
            }
            )

    }

    changeModel() {
        setTimeout(() => {
            this.setState({
                addressModel: true,
                changeLoader: false
            })
        }, 1000)
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
                        this.shippingInfo()
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

    loadMore() {
        if (!this.state.isLoading && !this.state.isLastPage)
            this.getData()
    }

    footerView() {
        if (!this.state.isLastPage) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else return null
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
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <View style={styles.mainContainer}>
                        {this.state.cart.length > 0 ?
                            <View>
                                <FlatList
                                    data={this.state.cart}
                                    renderItem={this.renderCart}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    onEndReached={this.loadMore}
                                    ListFooterComponent={this.footerView}
                                    removeClippedSubviews={true}
                                    refreshing={false}
                                />
                                <View style={styles.seperator}></View>
                                <Text style={styles.pricetitle}>Price Detail</Text>
                                <View style={styles.seperator2}></View>
                                <View style={[styles.priceDetail, { marginLeft: 15 }]}>
                                    <Text style={styles.price2}>Total Quantity  :</Text>
                                    <Text style={styles.price2}>{(this.state.cart.reduce((a, v) => a = a + v.quantity, 0))}</Text>
                                </View>
                                <View style={[styles.priceDetail, { marginLeft: 15 }]}>
                                    <Text style={styles.price2}>Subtotal  :</Text>
                                    <Text style={styles.price2}>{(this.state.cart.reduce((a, v) => a = a + v.price * v.quantity, 0))} USD</Text>
                                </View>
                                <View style={styles.seperator2}></View>
                                <Text style={styles.pricetotal}>Total cost  :  {formatRate(this.state.cart.reduce((a, v) => a = a + v.price * v.quantity, 0))} USD</Text>
                                <Text style={styles.pricetotal1}>            :  {formatRate(this.state.cart.reduce((a, v) => a = a + v.productPriceAed* v.quantity, 0))} AED</Text>
                                <TouchableOpacity onPress={() => this.setState({ addLoader: true }, this.shippingInfo())} style={styles.submitButton}>
                                    <Text style={styles.submitText}>PROCEED TO CHECKOUT</Text>
                                    {this.state.addLoader &&
                                        <ActivityIndicator size="small" color='#fff' style={{ marginLeft: 10 }} />
                                    }
                                </TouchableOpacity>
                                <View style={[styles.seperator, { marginTop: 10 }]}></View>
                            </View>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: height / 1.2 }}>
                                <Image resizeMode="contain" source={Images.cart} style={{ height: 200 }} />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OnlineShopping')} style={{ padding: 10, backgroundColor: PRIMARY_COLOR, marginTop: 50, borderRadius: 10 }}>
                                    <Text style={{ color: '#fff', fontFamily: FONT_MULI_BOLD }}>Continue shopping</Text>
                                </TouchableOpacity>
                            </View>
                        }
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
                            <View style={{ backgroundColor: '#fff', padding: 10, borderTopRightRadius: 30, paddingTop: 0 }}>
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
                                            onEndReached={this.shippingLoadMore}
                                            ListFooterComponent={this.footerViewShip}
                                        />
                                        :
                                        <Text style={{ marginTop: 20, marginBottom: 20, marginLeft: 5, fontFamily: FONT_MULI_REGULAR, color: SECONDARY_COLOR, fontSize: 16 }}>No address found !  please add your address</Text>
                                    }
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ addressModel: false } ,()=> this.props.navigation.navigate("Address"))} style={styles.addAddress}>
                                    <AntDesign name="pluscircleo" size={17} color={PRIMARY_COLOR} />
                                    <Text style={styles.addAddressTitle1}> Add new address</Text>
                                </TouchableOpacity>
                                <View style={styles.nextButton}>
                                    <TouchableOpacity onPress={() => this.setState({ addressModel: false, pageShip: 2 })} style={styles.nextbuttonbox}>
                                        <Text style={styles.addAddressTitle}>CANCEL</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={this.state.shippingInfo == "" ? true : false} onPress={() => this.setState({ buyLoader: true, addressModel: false }, this.buyNow())} style={[this.state.shippingInfo != '' ? styles.nextbuttonbox : styles.nextbuttonboxInactive]}>
                                        <Text style={styles.addAddressTitle}>NEXT</Text>
                                        <AntDesign name="doubleright" size={16} color="#ffff" style={{ marginLeft: 5 }} />
                                    </TouchableOpacity>
                                </View>
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
                                <Text style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD, marginTop: 10 }]}>Products  </Text>
                                <View style={styles.seperator3}></View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 30 }}>
                                    <FlatList
                                        data={this.state.cart}
                                        renderItem={this.renderCartListing}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                    />
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
                                <Text style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD, marginLeft: 5, marginTop: 20, }]}>Price Details  </Text>
                                <View style={styles.addAddress2}>
                                    <View style={styles.priceDetail2}>
                                        <Text style={styles.price2}>Subtotal  :</Text>
                                        <Text style={styles.price2}>{(this.state.cart.reduce((a, v) => a = a + v.price * v.quantity, 0))} USD</Text>
                                    </View>
                                    <View style={styles.priceDetail2}>
                                        <Text style={styles.price2}>Shipping Cost  :</Text>
                                        <Text style={styles.price2}>{formatRate(this.state.buyDetails.shippingCost)} USD</Text>
                                    </View>
                                    <View style={styles.priceDetail2}>
                                        <Text style={styles.price2}>Tax  :</Text>
                                        <Text style={styles.price2}>{this.state.buyDetails.tax} USD</Text>
                                    </View>
                                    <View style={styles.priceDetail2}>
                                        <Text style={[styles.price2, { color: PRIMARY_COLOR, fontFamily: FONT_MEDIUM }]}>Total Price  :</Text>
                                        <Text style={[styles.price, { color: PRIMARY_COLOR, fontFamily: FONT_MEDIUM }]}>{formatRate(this.state.buyDetails.totalPriceUSD)} USD</Text>
                                    </View>
                                    <View style={styles.priceDetail2}>
                                        <Text style={[styles.price2, { color: PRIMARY_COLOR, fontFamily: FONT_MEDIUM }]}>            </Text>
                                        <Text style={[styles.price, { color: SECONDARY_COLOR, fontFamily: FONT_MEDIUM }]}>{formatRate(this.state.buyDetails.totalPriceAed)} AED</Text>
                                    </View>
                                </View>
                                <View style={styles.nextButton}>
                                    <TouchableOpacity onPress={() => this.setState({ buyModel: false,pageShip: 2 })} style={styles.nextbuttonbox}>
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
                                            this.setState({ payModel: false ,pageShip: 2})
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
                                            this.setState({ payModel: false, pageShip: 2})
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
                                            this.setState({ payModel: false, pageShip: 2})
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
                                <View style={styles.addressContainer}>
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
                                    <View style={[styles.nextButton, { marginRight: 5 }]}>
                                        <TouchableOpacity onPress={() => this.setState({ addAddrsModal: false }, this.addadrsClose)} style={styles.nextbuttonbox}>
                                            <Text style={styles.addAddressTitle}>CANCEL</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onSave()} style={styles.nextbuttonbox}>
                                            <Text style={styles.addAddressTitle}>SAVE</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                }
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
        backgroundColor: '#fff',
    },
    container: {
        width: width - 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: BORDER_COLOR,
        backgroundColor: '#fff',
        margin: 5,
        alignSelf: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        borderRadius: 5
    },
    containerList: {
        width: width - 16,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: BORDER_COLOR,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        alignSelf: 'center',
    },
    imageContainer: {
        height: 100,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainerList: {
        height: 60,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        width: '63%',
        padding: 10,
        paddingVertical: 2
    },
    closeButtenContainer: {
        height: '100%',
        width: '10%',
        marginTop: 5,
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    image: {
        height: '70%',
        width: '70%'
    },
    productName: {
        fontSize: 16,
        fontFamily: FONT_MULI_BOLD,
    },
    description: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    quantity: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    price: {
        fontSize: 15,
        fontFamily: FONT_MULI_REGULAR,
        lineHeight: 20
    },
    price2: {
        fontSize: 15,
        fontFamily: FONT_MULI_REGULAR,
    },
    priceText: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    priceText1: {
        fontSize: 13,
        fontFamily: FONT_MEDIUM,
        color: "#aaa"
    },
    seperator: {
        width: width,
        height: 1,
        marginTop: 50,
        backgroundColor: '#d1d1d1'
    },
    pricetitle: {
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD,
        marginLeft: 15,
        marginTop: 10
    },
    seperator3: {
        width: width - 20,
        height: .5,
        backgroundColor: '#d1d1d1',
        alignSelf: 'center'
    },
    pricetotal: {
        fontSize: 15,
        fontFamily: FONT_MEDIUM,
        marginLeft: 15,
        alignSelf: 'flex-end',
        marginRight: 15
    },
    pricetotal1: {
        fontSize: 15,
        fontFamily: FONT_MEDIUM,
        marginLeft: 15,
        alignSelf: 'flex-end',
        marginRight: 15,
        color:'#aaa'
    },
    submitButton: {
        height: 35,
        width: width - 30,
        alignSelf: 'center',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row'
    },
    submitText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: FONT_MEDIUM
    },
    bottomModal: {
        margin: 0,
        justifyContent: 'flex-end',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
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
        borderRadius: 5,
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        padding: 5
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
    seperator2: {
        height: 1,
        backgroundColor: '#ebeced',
        width: width - 30,
        alignSelf: 'center'
    },
    nextButton: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        width: width - 20,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
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
    categoryList: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    categoryText: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 15,
        lineHeight: 20
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullModel: {
        height: height,
        width: width,
        margin: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
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
    containerModal: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center'
    },
    priceDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        alignItems: 'center'
    },
    priceDetail2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        alignItems: 'center'
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
        marginBottom: 10,
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
})
export default connect(mapStateToProps)(App)