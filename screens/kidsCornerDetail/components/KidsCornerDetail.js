import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView, Dimensions, FlatList, ActivityIndicator, Linking } from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import Api from '../../../common/api'
import VideoPlayer from 'react-native-video-controls';
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_LIGHT, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import i18n from '../../../i18n'
import { WebView } from 'react-native-webview';
import { ONLINE_SECTION } from '../../../common/endpoints'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Video from 'react-native-video';
import AutoHeightWebView from 'react-native-autoheight-webview'
import Images from '../../../assets/images'

const { height, width } = Dimensions.get('screen')
var videoLink = ''

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Little_Artist")}</Text>
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
            onlineData: this.props.navigation.getParam('onlineData', null),
            onlineIndex: this.props.navigation.getParam('onlineIndex', null),
            isLoading: true,
            loading: true,
            isVisible: false,
            videoLinks: "",
            artistDetails: '',
            isVisibleImage: false,
            image: "",
            videoPlay: false,
            videoVimeo: '',
            online: [],
            isVisibleLogin: false,
            videoLink: [],
            playing: false
        }
        this.renderVideos = this.renderVideos.bind(this)
        this.onPress = this.onPress.bind(this);
        this.WebView = this.WebView.bind(this)
        this.openLink = this.openLink.bind(this)
        this.getData = this.getData.bind(this)
        this.renderOnline = this.renderOnline.bind(this)
        this.vimeoPlay = this.vimeoPlay.bind(this);
    }
    componentDidMount() {
        this.getData()
        this.vimeoPlay()
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }


    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ONLINE_SECTION + `language=${language}&courseId=${this.state.onlineData.courseId}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        online: response.items,
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

    renderVideos({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: true, videoLinks: item })} style={styles.videoImage}>
                <ImageBackground
                    source={{ uri: this.state.onlineData.articlePicture }}
                    style={{ height: '98%', width: '99%' }}
                    borderRadius={10}
                    blurRadius={2}
                >
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: .5 }}>
                        <AntDesign name="playcircleo" size={50} color="#fff" style={styles.iconContainer2} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    WebView(item) {
        if (item.includes('vimeo')) {
            var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
            var match = item.match(regExp);
            if (match) {
                const VIMEO_ID = match[2]
                return (
                    <WebView
                        style={styles.WebView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        source={{ uri: `https://player.vimeo.com/video/${VIMEO_ID}` }}
                    />
                )
            }
        }
        else if ((item.includes('youtu.be')) || (item.includes('youtube'))) {
            if (item.includes("watch?v=")) {
                var SplitedVideo = item.split("watch?v=")
                var Embed = SplitedVideo.join("embed/")
            }
            else if (item.includes("youtu.be")) {
                var link = item.replace("youtu.be", "www.youtube.com")
                var Embed = link.replace(".com", "-nocookie.com/embed/")
            }
            return (
                <WebView
                    style={styles.WebView}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: Embed + '?rel=0&autoplay=0&showinfo=0&controls=0' }}
                />
            )
        }
    }

    onPressItem({ item }) {
        if (this.props.user) {
            this.props.navigation.push('KidsCornerDetail', { onlineData: item })
        }
        else if (item.isLoginRequired) {
            this.setState({ isVisibleLogin: true })
        }
        else {
            this.props.navigation.push('KidsCornerDetail', { onlineData: item })
        }
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

    renderOnline({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onPressItem({ item: item })} style={styles.mediaContainer}>
                <View style={{}}>
                    <Image
                        source={{ uri: item.lessonPicture }}
                        style={styles.imageContainer2}
                    />
                </View>
                <View style={{ height: 50, width: '80%' }}>
                    <Text numberOfLines={1} style={styles.onlineTitle}>{item.lessonTitle}</Text>
                    <Text numberOfLines={1} style={styles.onlineDate}>{item.displayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    vimeoPlay() {
        if (this.state.onlineData && this.state.onlineData.videoURL.includes('vimeo')) {
            if (this.state.onlineData.videoURL) {
                var url = this.state.onlineData.videoURL;
                var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
                var urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
                var path = urlParts[2];
                var tempArray = path.split('/').splice(path.split('/').length - 2, path.split('/').length - 1)
                var match = url.match(regExp);
                if (match) {
                    const VIMEO_ID = match[2]
                    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config?h=${tempArray[1]}`)
                        .then(res => res.json())
                        .then(res => this.setState({
                            videoLink: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url.trim(),
                            loading: false
                        })
                        )
                        .catch(err =>{
                            console.log("err", err);
                        })
                    return videoLink
                        
                }
                if (this.state.videoLink != videoLink) {
                    this.setState({ videoLink: videoLink, videoName: this.state.onlineData.videoTitle1 })
                }
            }
        }
    }

    renderOptions = () => {
        if (this.state.videoLink.length > 0) {
            console.log('link,,,fuction,,', this.state.videoLink)
            return (
                <View style={{}}>
                    <Video
                        ref={ref => {
                            this.player = ref;
                        }}
                        source={{ uri: this.state.videoLink }}
                        playInBackground={false}
                        paused={false}
                        playInBackground={true}
                        playWhenInactive={true}
                        fullscreenOrientation={'landscape'}
                        navigator={this.props.navigator}
                        onLoad={() => this.setState({ videoLoad: null })}
                        controls={true}
                        resizeMode={'contain'}
                        style={[styles.backgroundVideo, { backgroundColor: this.state.loading ? '#EDEDED' : '#000' }]}
                    />
                </View>
            )
        }
    }

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }
    render() {
        var url = this.state.onlineData.videoURL;
        const online = this.state.onlineData
        const onlineList = this.state.online.slice(0, 6)
        const index = this.state.onlineIndex
        const filteredItems = onlineList.filter(item => item.lessonId !== online.lessonId)
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView style={{ flex: 1 }}>
                        <ImageBackground source={Images.design} style={{}}>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true })} style={styles.imageContainer}>
                                <Image source={{ uri: online.lessonPicture }} style={styles.imageStyle} onLoadEnd={this._onLoadEnd} resizeMode="contain" />
                                <ActivityIndicator
                                    style={styles.activityIndicator}
                                    animating={this.state.loading}
                                />
                            </TouchableOpacity>
                            <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 20 }]}>{online.lessonTitle}</Text>
                            <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                                <AntDesign name="calendar" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                                <Text numberOfLines={3} style={[styles.title2, this.props.lang == 'ar' && { textAlign: 'right' }]}>{online.displayDate}</Text>
                            </View>
                        </ImageBackground>
                        {this.state.onlineData.isVideoAvailable == 2 &&
                            <View>
                                <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={styles.eventVideo}>
                                    <ImageBackground borderRadius={10} source={{ uri: online.lessonPicture }} style={styles.imageStyleVideo} onLoadEnd={this._onLoadEnd} resizeMode="stretch" >
                                        <View style={styles.imageStyleVideo}>
                                            <AntDesign name="playcircleo" size={50} color="#fff" style={styles.iconContainer2} />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        }
                        {this.state.onlineData.isVideoAvailable == 1 &&
                            <View style={styles.videoContainer}>
                                {this.state.playing && this.state.videoLink != '' ?
                                    <View>
                                        {this.renderOptions()}
                                    </View>
                                    :
                                    <TouchableOpacity style={styles.videoContainerMain} onPress={() => this.setState({ playing: true })}>
                                        <View style={styles.imageVideoBG}>
                                            <Image style={styles.imageVideoImage} source={{ uri: online.lessonPicture }} />
                                        </View>
                                        <FontAwesome5 style={styles.videoIcon} name='play' size={40} color={PRIMARY_COLOR} />
                                    </TouchableOpacity>}
                                <View style={styles.videoTitleContainer}>
                                    <Text numberOfLines={1} style={styles.videoTitle}>{online.lessonTitle}</Text>
                                </View>
                            </View>
                        }
                        <View style={styles.description}>
                            <AutoHeightWebView
                                style={styles.WebViewD}
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
                                source={{ html: online.lessonDescription }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                scrollEnabled={false}
                            />
                            {online.pdfExists &&
                                <View style={styles.linkConatainer}>
                                    <TouchableOpacity style={[{ flexDirection: 'row', marginTop: 10 }, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]} onPress={() => this.openLink(online.pdfFile)}>
                                        <Text style={[styles.linkTitle, this.props.lang == 'ar' && { textAlign: 'right' }]}>{online.pdfName}</Text>
                                        <Entypo name="download" size={16} color="blue" style={{ marginLeft: 3, marginRight: 3, marginTop: 10 }} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        <View style={styles.titleHead}>
                            <Text style={styles.similer}>{i18n.t("Similar_items")}</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={styles.box}>
                                <Text style={styles.boxText}>{i18n.t("See_more")}</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={filteredItems}
                            renderItem={this.renderOnline}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            style={{ marginLeft: 5 }}
                        />
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
                                source={{ uri: online.video }}
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
                                <Image source={{ uri: online.lessonPicture }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
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
                                    <Text style={styles.modalText}>You need to login to view this content. Please Login. Not a Member? Join Us.</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleLogin: false })}>
                                        <Text style={styles.cancel}>{i18n.t("CANCEL")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ isVisibleLogin: false }, () => this.props.navigation.navigate('Login'))} style={styles.button}>
                                        <Text style={styles.subscribe}>{i18n.t("LOGIN")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
    user: state.userLogin.user
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        textAlign: 'justify',
        paddingLeft: 10,
        fontFamily: FONT_MULI_REGULAR,
        paddingRight: 10
    },
    title2: {
        fontSize: 13,
        textAlign: 'left',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    imageContainer: {
    },
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
    },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    iconContainer2: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 5,
    },
    videoImage: {
        margin: 5,
        height: 110,
        width: 100,
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageStyle: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    eventVideo: {
        height: 250,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10
    },
    imageStyleVideo: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    WebView: {
        height: 250,
        marginTop: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        margin: 5
    },
    description: {
        marginTop: 20
    },
    linkConatainer: {
    },
    linkTitle: {
        fontSize: 15,
        textAlign: 'left',
        color: 'blue',
        padding: 10,
        fontFamily: FONT_MULI_BOLD
    },
    imageContainer2: {
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 10
    },
    mediaContainer: {
        alignItems: 'center',
        width: 160,
        height: 200,
        borderRadius: 1,
        justifyContent: 'center',
    },
    onlineDate: {
        textAlign: 'center',
        fontFamily: FONT_MULI_REGULAR
    },
    onlineTitle: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: FONT_MULI_BOLD
    },
    similer: {
        fontSize: 17,
        padding: 10,
        fontFamily: FONT_MULI_BOLD,
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
    modalText: {
        textAlign: 'center',
        fontSize: 15,
        fontFamily: FONT_PRIMARY,
        color: 'black',
        opacity: .9
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
    button: {
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
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 10,
    },
    videoContainer: {
        height: 265,
        borderRadius: 20,
        marginHorizontal: 13,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: .5,
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 3,
        marginTop: 20
    },
    videoContainerMain: {
        position: 'absolute',
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: '100%'
    },
    imageVideoBG: {
        backgroundColor: '#000',
        height: 210,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 20,
        justifyContent: 'center'
    },
    imageVideoImage: {
        height: 210,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 20,
        opacity: .7
    },
    videoTitleContainer: {
        height: 40,
        justifyContent: 'center',
        bottom: 0,
        position: 'absolute',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10
    },
    videoTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: FONT_MULI_BOLD
    },
    videoIcon: {
        position: 'absolute'
    },
    backgroundVideo: {
        height: 200,
        borderRadius: 20,
        marginTop: 25,
        width: '95%',
        alignSelf: 'center'
    },
    box: {
        height: 20,
        width: 75,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 15,
        backgroundColor: '#fff',
    },
    boxText: {
        color: PRIMARY_COLOR,
        fontSize: 11,
        fontFamily: FONT_MULI_REGULAR
    },
    titleHead: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    WebViewD: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
})
export default connect(mapStateToProps)(App)