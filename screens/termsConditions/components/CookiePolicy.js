import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_MULI_BOLD, FONT_PRIMARY } from '../../../assets/fonts'
import Api from '../../../common/api'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { STATIC_PAGE } from '../../../common/endpoints'

const { height, width } = Dimensions.get('screen')


class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15,marginBottom:10 ,width:width/2}}>
            <Image resizeMode ='contain' source={Images.logoLetterNew} style={{ height: 45, width: width / 2 }} />
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
                <TouchableOpacity onPress={navigation.getParam('onPress')} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <AntDesign name='closecircleo' size={26} color={'#000'} style={{}} />
                </TouchableOpacity>),
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='menu' size={26} color='black' />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            library: ''
        }
        this.onPress = this.onPress.bind(this)
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', STATIC_PAGE + `?pageId=22&language=${language}`)
            .then((responseJson) => {
                console.log('cookieess',responseJson)
                if (responseJson) {
                    this.setState({
                        library: responseJson,
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

    onPress() {
        this.props.navigation.navigate('Home')
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <ScrollView style={styles.mainContainer}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={styles.iconContainer}>
                            <Entypo name="chevron-small-left" size={50} />
                        </TouchableOpacity>
                        <View style={styles.container}>
                        <Text style={[styles.title, this.props.lang == 'ar' && { textAlign: 'right' }]}>{this.state.library.title}</Text>
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
                                    text-align: justify;
                                }
                                p {
                                    font-size: 17px;
                                }`
                                }
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                source={{ html: this.state.library.description }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                scrollEnabled={false}
                                startInLoadingState={true}
                            />
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
    },
    title: {
        fontSize: 22,
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_BOLD,
        marginHorizontal: 10
    },
    content: {
        textAlign: 'right',
        fontSize: 17,
    },
    container: {
        padding: 8,
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
        borderRadius: 7,
    },
    iconContainer: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 2,
        marginLeft: 10,
        marginTop: 10,
    },
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default connect(mapStateToProps)(App)