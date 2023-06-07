import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Dimensions, Linking, Platform } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { STATIC_PAGE } from '../../../common/endpoints'
import Hyperlink from 'react-native-hyperlink'


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
            vision: '',
            mission: '',
            aboutus: '',
            library: '',
            goals: '',
            isLoading: true,
            loading: true
        }
        this.onPress = this.onPress.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    async getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2

        await Api('get', STATIC_PAGE + `?pageId=1&language=${language}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        aboutus: response,
                    })
                }
            });

        await Api('get',  STATIC_PAGE + `?pageId=2&language=${language}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        vision: response,
                    })
                }
            });

        await Api('get', STATIC_PAGE + `?pageId=3&language=${language}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        mission: response,
                    })
                }
            });

        await Api('get', STATIC_PAGE + `?pageId=8&language=${language}`)
            .then((response) => {
                if (response) {
                    console.log('goal', response)
                    this.setState({
                        goals: response,
                        isLoading: false
                    })
                }
                else {0
                    this.setState({
                        isLoading: false
                    })
                }
            });

    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    transform = (data) => {
        if (data) {
          return data.replace(/<[^>]+>/g, "");
        }
        return data;
      };


    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView style={{ flex: 1 }}>
                        <SafeAreaView style={styles.mainContainer}>
                            <View style={{ width: '100%', height: height / 1.65, marginTop: -200 }} >
                                <Image
                                    source={Images.khawlaTop}
                                    style={{ width: '100%', height: '100%', backgroundColor: '#fff', }}
                                    onLoadEnd={this._onLoadEnd}
                                    resizeMode="stretch"
                                />
                                <ActivityIndicator
                                    style={styles.activityIndicator}
                                    animating={this.state.loading}
                                />
                            </View>
                            <View style={{ backgroundColor: '#fff' }}>

                                {/* about us */}

                            <Text style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' },{marginTop:10}]}>{this.state.aboutus.title}</Text>
                            <Text style={styles.content}>{this.transform(this.state.aboutus.description)}</Text>

                                {/* vision */}

                            <Text style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{this.state.vision.title}</Text>
                            <Text style={styles.content}>{this.transform(this.state.vision.description)}</Text>

                                {/* mission */}

                            <Text style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{this.state.mission.title}</Text>
                            <Text style={styles.content}>{this.transform(this.state.mission.description)}</Text>

                                {/* goals */}

                            <Text style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{this.state.goals.title}</Text>
                            <Text style={styles.content}>{this.transform(this.state.goals.description)}</Text>

                            </View>
                            <Image
                                source={Images.khawlaBottom}
                                style={{ width: '100%', height: height / 2.5, backgroundColor: '#fff' }}
                                onLoadEnd={this._onLoadEnd}
                                resizeMode="stretch"
                            />
                        </SafeAreaView>
                    </ScrollView>
                }
            </View>
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
    titleMain: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'right',
        color: "#fff",
        padding: 5
    },
    title: {
        fontSize: 18,
        textAlign: 'right',
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_BOLD,
        paddingHorizontal:20,
        marginTop:70
    },
    content: {
        textAlign: 'justify',
        fontSize: 16,
        fontFamily: FONT_MULI_REGULAR,
        marginTop: 10,
        paddingHorizontal:20
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
})
export default connect(mapStateToProps)(App)