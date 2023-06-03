import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_LIGHT, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import i18n from '../../../i18n'
import { WebView } from 'react-native-webview';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Video from 'react-native-video';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { COLLECTION } from '../../../common/endpoints'
import Api from '../../../common/api'

const { height, width } = Dimensions.get('screen')
var videoLink = ''

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Collection")}</Text>
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
            collectionDetail: '',
            eventDetails: [],
            isLoading: true,
            loading: true,
            isVisible: false,
            isVisibleImage: false,
            videoLink: [],
            playing: false,
            collectionData: this.props.navigation.getParam('item', null),
            collectionId: this.props.navigation.getParam('collectionId', null),
        }
        console.log('test', this.state.collectionDetail)
        this.onPress = this.onPress.bind(this);
        this.WebView = this.WebView.bind(this);
        this.vimeoPlay = this.vimeoPlay.bind(this);
    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        var id = this.state.collectionId == null ? this.state.collectionData.artifactId : this.state.collectionId
        Api('get', COLLECTION + `language=${language}&artifactId=${id}`)
            .then((responseJson) => {
                let res = responseJson.items[0]
                if (responseJson) {
                    this.setState({
                        collectionDetail: res,
                        isLoading: false,
                    }),
                        this.vimeoPlay()
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

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    WebView(item) {
        if (item.includes('vimeo')) {
            var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
            var match = item.match(regExp);
            if (match) {
                const VIMEO_ID = match[2]
                console.log('VIMEO_ID', VIMEO_ID)
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

 
    vimeoPlay() {
        if (this.state.collectionDetail && this.state.collectionDetail.videoURL.includes('vimeo')) {
            if (this.state.collectionDetail.videoURL) {
                var url = this.state.collectionDetail.videoURL;
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
                    this.setState({ videoLink: videoLink, videoName: this.state.collectionDetail.videoTitle1 })
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

    render() {
        const collectionDetail = this.state.collectionDetail
        const imageClct = this.state.collectionDetail.artifactPicture
        console.log('imaageee', imageClct)
        const url = collectionDetail.videoURL
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
                        <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 19 }]}>{collectionDetail.artifactTitle}</Text>
                        <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                            <AntDesign name="calendar" size={17} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                            <Text style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{collectionDetail.artifactDisplayDate}</Text>
                        </View>
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
                            source={{ html: collectionDetail.artifactDescription }}
                            scalesPageToFit={true}
                            viewportContent={'width=device-width, user-scalable=yes'}
                            scrollEnabled={false}
                        />
                    </View>
                    {collectionDetail.isVideoAvailable == 2 &&
                        <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                            <View style={[styles.imageVideo, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>
                                <ImageBackground blurRadius={3} source={{ uri: imageClct }} style={styles.imageBackground} borderRadius={10}>
                                    <AntDesign name="playcircleo" size={40} color="#fff" style={styles.iconContainer2} />
                                </ImageBackground>
                            </View>
                        </TouchableOpacity>
                    }
                    {collectionDetail.isVideoAvailable == 1 &&
                        <View style={styles.videoContainer}>
                            {this.state.playing && this.state.videoLink != '' ?
                                <View>
                                    {this.renderOptions()}
                                </View>
                                :
                                <TouchableOpacity style={styles.videoContainerMain} onPress={() => this.setState({ playing: true })}>
                                    <View style={styles.imageVideoBG}>
                                        <Image style={styles.imageVideoImage} source={{ uri: imageClct }} />
                                    </View>
                                    <FontAwesome5 style={styles.videoIcon} name='play' size={40} color={PRIMARY_COLOR} />
                                </TouchableOpacity>}
                            <View style={styles.videoTitleContainer}>
                                <Text numberOfLines={1} style={styles.videoTitle}>{collectionDetail.artifactTitle}</Text>
                            </View>
                        </View>
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
                            source={{ uri: collectionDetail.videoURL }}
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
    title: {
        fontSize: 13,
        textAlign: 'right',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    title2: {
        fontSize: 16,
        textAlign: 'justify',
        paddingLeft: 10,
        fontFamily: FONT_MULI_REGULAR,
        paddingRight: 10,
        marginTop: 20
    },
    titleEvent: {
        fontSize: 20,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
    },
    video: {
        textAlign: 'center',
        fontSize: 18,
        color: PRIMARY_COLOR,
        marginTop: 20,
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
        marginRight: 10,
        marginLeft: 10
    },
    imageCollection: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    imageVideo: {
        height: 90,
        width: 90,
        marginTop: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 10
    },
    imageBackground: {
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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
        height: 250,
        marginTop: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        margin: 5
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
        width: '100%'
    },
    videoTitle: {
        textAlign: 'center',
        fontSize: 18,
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
    WebViewD: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
})
export default connect(mapStateToProps)(App)