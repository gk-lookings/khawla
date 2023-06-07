import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_LIGHT, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import AutoHeightWebView from 'react-native-autoheight-webview'


const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Latest_updates")}</Text>
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
            newsDetail: this.props.navigation.getParam('news', null),
            eventDetails: [],
            isLoading: true,
            loading: true,
            isVisible: false,
            isVisibleImage: false
        }
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
        const newsDetail = this.state.newsDetail
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true })}>
                        <Image source={{ uri: `data:image/gif;base64,${newsDetail.newsPicture}` }} resizeMode="contain" style={styles.imageCollection} />
                    </TouchableOpacity>
                    <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 20 }]}>{newsDetail.newsTitle}</Text>
                    <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                        <AntDesign name="calendar" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                        <Text style={[styles.title, this.props.lang == 'ar' && { textAlign: 'right'  }]}>{newsDetail.newsDate}</Text>
                    </View>
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
                    source={{ html: newsDetail.newsDescription }}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=yes'}
                />
                    {newsDetail.video != '' && newsDetail.video &&
                        <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                            <View style={[styles.videoView, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>
                                <ImageBackground blurRadius={3} source={{ uri: `data:image/gif;base64,${newsDetail.newsPicture}` }} style={styles.imageBackground} borderRadius={10}>
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
                            source={{ uri: newsDetail.video }}
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
                            <Image source={{ uri: `data:image/gif;base64,${newsDetail.newsPicture}` }} resizeMode="contain" style={styles.imageFull} />
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
    title: {
        fontSize: 13,
        textAlign: 'left',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
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
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
    },
    titleD: {
        fontSize: 16,
        textAlign: 'justify',
        paddingRight: 10,
        paddingLeft: 10,
        marginTop: 20,
        fontFamily: FONT_MULI_REGULAR,
    },
    imageBackground: {
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    imageCollection: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    videoView: {
        height: 90,
        width: 90,
        marginTop: 20,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
    dateContainer: {
        flexDirection: 'row'
    },
    icon: {
        marginLeft: 10,
    },
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf:'center'
    },
})
export default connect(mapStateToProps)(App)