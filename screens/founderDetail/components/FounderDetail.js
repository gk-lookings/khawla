import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import i18n from '../../../i18n'
import AutoHeightWebView from 'react-native-autoheight-webview'


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
            isVisibleImage: false
        }
        console.log('test', this.state.artDetail)
        this.onPress = this.onPress.bind(this);
    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }
    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }
    render() {
        const artDetail = this.state.artDetail
        const imageClct = this.state.artDetail && this.state.artDetail.artPicture
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true })}>
                        <Image
                            source={{ uri: imageClct }}
                            style={styles.imageCollection}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right' }]}>{artDetail.artTitle}</Text>
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
                            /*
                            other react-native-webview props
                            */
                            />
                        }
                    </View>
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
                </ScrollView>
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
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD,
        marginTop: 10
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
})
export default connect(mapStateToProps)(App)