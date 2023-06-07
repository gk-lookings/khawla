import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView, Dimensions, FlatList, ActivityIndicator, Linking, Alert } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY, BORDER_COLOR } from '../../assets/color'
import Api from '../../common/api'
import VideoPlayer from 'react-native-video-controls';
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT, FONT_BOLD } from '../../assets/fonts'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Images from '../../assets/images'
import Modal from "react-native-modal"
import i18n from '../../i18n'
import { WebView } from 'react-native-webview';
import Hyperlink from 'react-native-hyperlink'
import { ORDER_USER, CART, MY_ORDER } from '../../common/endpoints'



const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>My orders</Text>
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
            order: [],
            page: 1,
            isLastPage: false
        }
        this.onPress = this.onPress.bind(this);
        this.renderOrder = this.renderOrder.bind(this);
        this.getData = this.getData.bind(this);
        this.footerView = this.footerView.bind(this);
    }
    componentDidMount() {
        this.getData()
    }

    getData() {
        let page = this.state.page
        Api('post', MY_ORDER + `?page=${page}`)
            .then((response) => {
                console.log('myyyyyyyyyyyorderrrrrrrrrrrr', response)
                if (response) {
                    let res = response.items
                    this.setState({
                        order: this.state.order.concat(res),
                        isLoading: false,
                        isLastPage: response.isLastPage,
                        page: this.state.page + 1
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            }
            )
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.lang != this.props.lang) {
    //         this.getData()
    //     }
    // }
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

    renderOrder({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyOrderDetail', { detail: item })} style={styles.container}>
                <View style={styles.productPicContainer}>
                    {item.products.length > 2 &&
                        <View style={{ flexDirection: 'row',width: 110,justifyContent:'center', alignItems:'center' }}>
                            <View style={styles.productMore}>
                                <Text style={styles.more}>.....</Text>
                            </View>
                            <Image source={{ uri: item.products[1].productPicture }} style={styles.productImage} />
                            <Image source={{ uri: item.products[0].productPicture }} style={styles.productImage2} />
                        </View>
                    }
                    {item.products.length == 2 &&
                        <View style={{ flexDirection: 'row',width: 90, }}>
                            <Image source={{ uri: item.products[1].productPicture }} style={styles.productImageTwo} />
                            <Image source={{ uri: item.products[0].productPicture }} style={styles.productImage2Two} />
                        </View>
                    }
                    {item.products.length == 1 &&
                        <View style={{ flexDirection: 'row',width: 60, }}>
                            <Image source={{ uri: item.products[0].productPicture }} style={styles.productImageOne} />
                        </View>
                    }
                    <Text style={styles.productName}>Order {item.orderId}</Text>
                </View>
                <View style={{ width: '45%' }}>
                    {item.orderStatus == 'Failed' ?
                        <Text style={styles.orderTextFailed}>Order {item.orderStatus}</Text>
                        :
                        <Text style={styles.orderTextSuccess}>Order {item.orderStatus}</Text>
                    }
                    <Text style={styles.priceText}>{item.orderDate}</Text>
                    <Text style={styles.price}><Text style={styles.priceText}>Price:</Text> {item.orderAmount} AED</Text>
                </View>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                    <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                </View>
            </TouchableOpacity>
        )
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
                        {this.state.order.length > 0 ?
                            <FlatList
                                data={this.state.order}
                                renderItem={this.renderOrder}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                onEndReached={this.getData}
                                ListFooterComponent={this.footerView}
                            />
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: height / 1.2 }}>
                                <Image resizeMode="contain" source={Images.cart} style={{ height: 200 }} />
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OnlineShopping')} style={{ padding: 10, backgroundColor: PRIMARY_COLOR, marginTop: 50, borderRadius: 10 }}>
                                    <Text style={{ color: '#fff', fontFamily: FONT_MULI_BOLD }}>Continue shopping</Text>
                                </TouchableOpacity>
                            </View>
                        }
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
        width: width - 20,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent:'space-between'
    },
    imageContainer: {
        height: 90,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
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
        fontSize: 14,
        fontFamily: FONT_MULI_REGULAR,
        alignSelf:'center'
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
        fontFamily: FONT_MULI_REGULAR
    },
    priceText: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    productImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft: -90,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'grey'
    },
    productImage2: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft: -90,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'grey'
    },
    productImage2Two: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft: -90,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'grey'
    },
    productImageTwo: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft: 30,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'grey'
    },
    productImageOne: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginLeft: 0,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'grey'
    },
    productMore: {
        height: 50,
        width: 50,
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems:'center',
        borderColor: 'grey'
    },
    productPicContainer: {
    },
    orderTextFailed: {
        color: 'red',
        fontFamily: FONT_MULI_REGULAR
    },
    orderTextSuccess: {
        color: 'green',
        fontFamily: FONT_MULI_REGULAR
    },
    more: {
        fontSize: 20,
        lineHeight: 10
    }
})
export default connect(mapStateToProps)(App)