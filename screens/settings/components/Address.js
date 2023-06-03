import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native'
import Images from '../../../assets/images'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SHIPPING_INFO_USER } from '../../../common/endpoints'
import Api from '../../../common/api'
import { SafeAreaView } from 'react-navigation'
import { COLOR_SECODARY, COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import i18n from '../../../i18n'
import { connect } from 'react-redux'
import { FONT_EXTRA_LIGHT, FONT_LIGHT, FONT_MEDIUM } from '../../../assets/fonts'

const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>My Addresses</Text>
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
            isLoading: true
        }
        this.renderArticle = this.renderArticle.bind(this)
    }

    componentDidMount() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let formD = new FormData
        formD.append('language', language)
        // formD.append('courseId', this.state.onlineData.courseId)
        Api('post', SHIPPING_INFO_USER, formD)
            .then((response) => {
                if (response) {
                    console.log('address....', response.shipping)
                    this.setState({
                        address: response.shipping,
                        isLoading: false,
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
    }


    componentWillMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.setState({isLoading: true})
            this.componentDidMount();
            //Put your Data loading function here instead of my this.LoadData()
        });
    }


    makeDefault(item) {
        this.setState({isLoading: true})
        var language = this.props.lang == 'ar' ? 1 : 2
        let formD = new FormData
        formD.append('language', language)
        formD.append('shippingId', item.shippingId)
        formD.append('action', 'default')
        Api('post', SHIPPING_INFO_USER, formD)
            .then((response) => {
                if (response) {
                    console.log('address', response)
                    this.componentDidMount()
                    this.setState({isLoading: false})
                }
                else{
                    this.setState({isLoading: false})
                }
            })
    }

    deleteAddress(item) {
        this.setState({isLoading: true})
        var language = this.props.lang == 'ar' ? 1 : 2
        let formD = new FormData
        formD.append('language', language)
        formD.append('shippingId', item.shippingId)
        formD.append('action', 'delete')
        Api('post', SHIPPING_INFO_USER, formD)
            .then((response) => {
                if (response) {
                    console.log('address', response.shipping)
                    this.componentDidMount()
                    this.setState({isLoading: false})
                }
                else{
                    this.setState({isLoading: false})
                }
            })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderArticle({ item }) {
        return (
            <View style={styles.listStyle}>
                <View style={styles.iconContainer}>
                    <FontAwesome name='address-book-o' size={30} color={SECONDARY_COLOR} />
                </View>
                <View style={styles.seperater}>

                </View>
                <View style={styles.addressMainContainer}>
                    <View style={styles.addressContainer}>
                        <Fontisto name='at' size={15} color={SECONDARY_COLOR} />
                        <Text style={styles.programText}>{item.email}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <IconMaterial name='local-phone' size={15} color={SECONDARY_COLOR} />
                        <Text style={styles.programText}>{item.telephone}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <Entypo name='mobile' size={15} color={SECONDARY_COLOR} />
                        <Text style={styles.programText}>{item.mobile}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <EvilIcons name='location' size={20} color={SECONDARY_COLOR} />
                        <Text style={styles.programText}>{item.shippingAddress1}, {item.shippingAddress2}, {item.country}</Text>
                    </View>
                    <View style={styles.addressFooter}>
                        {item.isdefault == 0 &&
                            <TouchableOpacity onPress={() => this.makeDefault(item)} style={styles.default}>
                                <Text style={styles.defaultText}>make it default</Text>
                            </TouchableOpacity>
                        }
                        {item.isdefault == 1 &&
                            <View style={styles.addressFooter}>
                                <View style={styles.defaultBox}>
                                    <AntDesign name='checkcircle' size={17} color='green' style={{ opacity: .5 }} />
                                    <Text style={styles.defaultText}>default</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.deleteAddress(item)} style={styles.deleteContainer}>
                    <EvilIcons name='close' size={22} color={SECONDARY_COLOR} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={this.state.address}
                                renderItem={this.renderArticle}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{paddingBottom: 100}}
                            />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("AddressDetail")} style={styles.addAddress}>
                            <Entypo name='plus' size={25} color='#fff' />
                        </TouchableOpacity>
                        </View>
                }
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
        fontSize: 15,
        marginLeft: 10,
        fontFamily: FONT_LIGHT
    },
    date: {
        fontSize: 15,
        color: SECONDARY_COLOR,
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
        backgroundColor: 'white',
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        margin: 5,
        borderWidth: 1,
        borderColor: SECONDARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0
    },
    addressContainer: {
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    addressFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    default: {
        backgroundColor: '#e3e3e3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: 'grey',
        borderRadius: 5,
        alignSelf: 'flex-end',
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
        padding: 3,
    },
    delete: {
        height: 30,
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    defaultBox: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderRadius: 10,
        padding: 3,
        borderColor: SECONDARY_COLOR,
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
        width: 55,
        height: 55,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
        marginTop: 5,
        position: 'absolute',
        bottom: 20,
        right: 20
    },
    addresstext: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
    },
    iconContainer: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressMainContainer: {
        width: '65%',
    },
    deleteContainer: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seperater: {
        width: .5,
        height: '90%',
        backgroundColor: SECONDARY_COLOR,
        marginRight: '5%',
    },
    defaultText: {
        fontSize: 12,
        fontFamily: FONT_MEDIUM,
        marginLeft: 5
    },
    activityIndicator:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    }
})
export default connect(mapStateToProps)(App)