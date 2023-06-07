import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView, Dimensions, FlatList, ActivityIndicator, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY, BORDER_COLOR } from '../../assets/color'
import Api from '../../common/api'
import VideoPlayer from 'react-native-video-controls';
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT } from '../../assets/fonts'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Images from '../../assets/images'
import Modal from "react-native-modal"
import i18n from '../../i18n'
import { WebView } from 'react-native-webview';
import Hyperlink from 'react-native-hyperlink'
import { ORDER_USER, CART, MY_ORDER } from '../../common/endpoints'
import product from '../onlineShopping/reducers'



const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText1}>My orders</Text>
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
            isLoading: false,
            myOrder: this.props.navigation.getParam('detail', null),
            products: []
        }
        this.onPress = this.onPress.bind(this);
        this.renderProduct = this.renderProduct.bind(this);
        this.getData = this.getData.bind(this);
    }
    componentDidMount() {
        this.getData()
    }

    getData() {
        // Api('post', MY_ORDER)
        //     .then((response) => {
        //         console.log('myyyyyyyyyyyorderrrrrrrrrrrr', response)
        //         if (response) {
        //             this.setState({ order: response, isLoading: false })
        //         }
        //         else {
        //             this.setState({ isLoading: false })
        //         }
        //     }
        //     )
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.lang != this.props.lang) {
    //         this.getData()
    //     }
    // }

    renderProduct({ item }) {
        return (
            <View style={styles.container}>
                <Image source={{ uri: item.productPicture }} resizeMode="contain" style={{ height: 100, width: 100 }} />
                <View style={{ marginLeft: 30, justifyContent: 'center' }}>
                    <Text style={[styles.productName, { marginTop: 0, fontSize: 15 }]}>{item.productName}</Text>
                    <Text style={styles.price}>{item.price} AED</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                </View>
            </View>
        )
    }
    render() {
        const order = this.state.myOrder
        console.log('mmmmmmmmyrrrrrrrr', order.products)
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView style={styles.mainContainer}>
                        <View style={{ padding: 10, paddingTop: 0}}>
                            <Text style={[styles.productName,{marginTop: 0}]}>Order Number</Text>
                            <View style={{ paddingTop: 5, paddingBottom: 5, borderTopWidth: .7, borderBottomWidth: .7, borderColor: "#d1d1d1" }}>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Order Number:   </Text>{order.orderId}</Text>
                            </View>
                            <Text style={[styles.productName]}>Shipping Address</Text>
                            <View style={{ paddingTop: 5, paddingBottom: 5, borderTopWidth: .7, borderBottomWidth: .7, borderColor: "#d1d1d1" }}>
                                <Text style={styles.categoryText}>{order.shippingAddress1}  </Text>
                                <Text style={styles.categoryText}>{order.shippingAddress2}</Text>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Country:   </Text>{order.country}</Text>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Emai:   </Text>{order.email}</Text>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Mobile:   </Text>{order.mobile}</Text>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>telephone:   </Text>{order.telephone}</Text>
                            </View>
                            <Text style={styles.productName}>Payment Detail</Text>
                            <View style={{ paddingTop: 5, paddingBottom: 5, borderTopWidth: .7, borderBottomWidth: .7, borderColor: "#d1d1d1" }}>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Order Shipping Cost:   </Text>{order.orderShippingCost} USD</Text>
                                <Text style={styles.categoryText}><Text style={styles.quantity}>Tax:   </Text>{order.orderTax} USD</Text>
                                <Text style={[styles.categoryText, { color: PRIMARY_COLOR }]}><Text style={styles.quantity}>Order amount:   </Text>{order.orderAmount} USD</Text>
                            </View>
                            <Text style={styles.productName}>Order Status</Text>
                            <View style={{ paddingTop: 5, paddingBottom: 5, borderTopWidth: .7, borderBottomWidth: .7, borderColor: "#d1d1d1" }}>
                                <Text style={styles.quantity}>{order.orderStatus == "Failed" ? <Text style={{ color: "#e34510", fontFamily: FONT_MULI_REGULAR }}>{order.orderStatus}</Text> : <Text style={{ color: 'green', fontFamily: FONT_MULI_REGULAR }}>{order.orderStatus}</Text>}</Text>
                            </View>
                            <Text style={styles.productName}>Products</Text>
                            <View style={{ paddingTop: 5, paddingBottom: 5, borderTopWidth: .7, borderBottomWidth: .7, borderColor: "#d1d1d1" }}>
                                <FlatList
                                    data={order.products}
                                    renderItem={this.renderProduct}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </ScrollView>
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
        borderBottomWidth: 1,
        flexDirection: 'row',
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
        padding: 5
    },
    imageContainer: {
        height: 90,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        height: '100%',
        width: '63%',
        padding: 10,
    },
    closeButtenContainer: {
        height: '100%',
        width: '10%',
        marginTop: 5,
    },
    mainTitleText: {
        color: '#bf8d02',
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD
    },
    mainTitleText1: {
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
        marginTop: 35,
        color: PRIMARY_COLOR
    },
    description: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    quantity: {
        fontSize: 13,
        fontFamily: FONT_MULI_REGULAR,
        color: SECONDARY_COLOR
    },
    price: {
        fontSize: 13,
        fontFamily: FONT_MULI_REGULAR,
    },
    priceText: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    categoryText: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 13,
        lineHeight: 20
    },
})
export default connect(mapStateToProps)(App)