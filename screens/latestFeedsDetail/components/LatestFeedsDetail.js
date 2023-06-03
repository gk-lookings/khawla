import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_LIGHT, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import i18n from '../../../i18n'
import { WebView } from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview'
import Video from 'react-native-video';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { ARTICLE_HOME } from '../../../common/endpoints'
import Api from '../../../common/api'


const { height, width } = Dimensions.get('screen')
var videoLink = ''

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Latest_Feeds")}</Text>
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
            articleDetail: '',
            eventDetails: [],
            isLoading: true,
            loading: true,
            isVisible: false,
            isVisibleImage: false,
            videoLink: [],
            showPlayer: false,
            playing: false,
            articleData: this.props.navigation.getParam('item', null),
            latestFeedId: this.props.navigation.getParam('latestFeedId', null),
            feedList: [],
            filteredItems: [],
            page: 1,
            image: ''
        }
        console.log('test', this.state.articleDetail)
        this.onPress = this.onPress.bind(this);
        this.vimeoPlay = this.vimeoPlay.bind(this);
        this.renderOnline = this.renderOnline.bind(this);
        this.getSimiler = this.getSimiler.bind(this);
        this.renderImage = this.renderImage.bind(this);

    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        var id = this.state.latestFeedId == null ? this.state.articleData.articleId : this.state.latestFeedId
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&articleId=${id}`)
            .then((responseJson) => {
                if (responseJson) {
                    let res = responseJson.items[0]
                    this.setState({
                        articleDetail: res,
                        isLoading: false,
                    }),
                        this.vimeoPlay(),
                        this.getSimiler()
                }
                else {
                    this.setState({
                        isLoading: false,
                    })
                }
            })
    }
    getSimiler() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&page=${page}`)
            .then((responseJson) => {
                if (responseJson) {
                    let res = responseJson.items
                    let resfil = res.filter(item => item.articleId != this.state.articleDetail.articleId)
                    let resfilled = resfil.filter(item => item.programmeId === this.state.articleDetail.programmeId)
                    this.setState({
                        feedList: this.state.feedList.concat(res),
                        filteredItems: this.state.filteredItems.concat(resfilled),
                        page: this.state.page + 1,
                        isLastPage: responseJson.isLastPage ? false : true,
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
                return (
                    <WebView
                        style={styles.WebView2}
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
                    style={styles.WebView2}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: Embed + '?rel=0&autoplay=0&showinfo=0&controls=0' }}
                />
            )
        }
    }


    vimeoPlay() {
        if (this.state.articleDetail && this.state.articleDetail.videoURL.includes('vimeo')) {
            if (this.state.articleDetail.videoURL) {
                var url = this.state.articleDetail.videoURL;
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
                    this.setState({ videoLink: videoLink, videoName: this.state.articleDetail.videoTitle1 })
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

    renderOnline({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push('LatestFeedsDetail', { item: item })} style={styles.mediaContainer}>
                <View style={{}}>
                    <Image
                        source={{ uri: item.articlePicture }}
                        style={styles.imageContainer2}
                    />
                </View>
                <View style={{ height: 50, width: '80%' }}>
                    <Text numberOfLines={1} style={styles.onlineTitle}>{item.articleTitle}</Text>
                    <Text numberOfLines={1} style={styles.onlineDate}>{item.articleDisplayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderImage({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ image: item, isVisibleImage: true })} style={styles.extraImageContainer}>
                <Image
                    source={{ uri: item }}
                    style={styles.extraImage}
                />
            </TouchableOpacity>
        )
    }

    render() {
        const articleDetail = this.state.articleDetail
        const imageClct = this.state.articleDetail.articlePicture
        const url = articleDetail.videoURL
        const filteredItems = this.state.filteredItems.slice(0, 4)
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ isVisibleImage: true, image: imageClct })}>
                            <Image
                                source={{ uri: imageClct }}
                                style={styles.imageCollection}
                                resizeMode="contain"
                            />
                        </TouchableWithoutFeedback>
                        {/* <View style={styles.seperator}></View> */}
                        <View>
                            <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 20 }]}>{articleDetail.articleTitle}</Text>
                            <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                                <AntDesign name="calendar" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                                <Text style={[styles.title, this.props.lang == 'ar' && { textAlign: 'right' }]}>{articleDetail.articleDisplayDate}</Text>
                            </View>
                            <Text style={[styles.title, { marginHorizontal: 5 }, this.props.lang == 'ar' && { textAlign: 'right' }]}>{articleDetail.programmeName}</Text>
                            {articleDetail.artistName != "" &&
                                <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center' }, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]} onPress={() => this.props.navigation.navigate("ArtistDetail", { artistId: articleDetail.artistId })}>
                                    <Text numberOfLines={3} style={[styles.titleArtist, this.props.lang == 'ar' && { textAlign: 'right', paddingRight: 10, paddingLeft: 3 }]}>{articleDetail.artistName}</Text>
                                    <EvilIcons name="external-link" size={20} color={PRIMARY_COLOR} style={{ opacity: .7 }} />
                                </TouchableOpacity>
                            }
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
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
                                source={{ html: articleDetail.articleDescription }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                scrollEnabled={false}
                            />
                        </View>
                        {articleDetail.extraPictures != "" &&
                            <View>
                                <FlatList
                                    data={articleDetail.extraPictures}
                                    renderItem={this.renderImage}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    horizontal={true}
                                    style={{ marginLeft: 5, marginVertical: 20 }}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        }
                        {articleDetail.isVideoAvailable == 2 &&
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                <View style={[styles.imageVideo, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>
                                    <ImageBackground blurRadius={3} source={{ uri: imageClct }} borderRadius={10} style={styles.imageBackground}>
                                        <AntDesign name="playcircleo" size={40} color="#fff" style={styles.iconContainer2} />
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        }
                        {articleDetail.isVideoAvailable == 1 &&
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
                                    <Text numberOfLines={1} style={styles.videoTitle}>{articleDetail.articleTitle}</Text>
                                </View>
                            </View>
                        }
                        {filteredItems != "" &&
                            <View>
                                <View style={styles.titleHead}>
                                    <Text style={styles.similer}>{i18n.t("Similar_items")}</Text>
                                </View>
                                <FlatList
                                    data={filteredItems}
                                    renderItem={this.renderOnline}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    horizontal={true}
                                    style={{ marginLeft: 5 }}
                                    showsHorizontalScrollIndicator={false}
                                    onEndReached={this.getSimiler}
                                />
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
                                source={{ uri: articleDetail.video }}
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
                                <Image source={{ uri: this.state.image }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
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
    title: {
        fontSize: 13,
        textAlign: 'left',
        paddingRight: 5,
        paddingLeft: 5,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
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
        marginTop: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 25,
        paddingLeft: 20,
        borderRadius: 10,
        marginBottom: 20
    },
    imageBackground: {
        height: 90,
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
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
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    WebView2: {
        height: 250,
        marginTop: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        margin: 5
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
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
    backgroundVideo: {
        height: 200,
        borderRadius: 20,
        marginTop: 25,
        width: '95%',
        alignSelf: 'center'
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 10,
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
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2
    },
    titleArtist: {
        fontSize: 14,
        textAlign: 'left',
        paddingRight: 3,
        paddingLeft: 10,
        color: '#ad6183',
        fontFamily: FONT_MULI_BOLD
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
    similer: {
        fontSize: 17,
        padding: 10,
        fontFamily: FONT_MULI_BOLD,
    },
    imageContainer2: {
        width: width / 2,
        height: 150,
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 10,
    },
    mediaContainer: {
        alignItems: 'center',
        width: width / 2,
        height: 200,
        borderRadius: 1,
        justifyContent: 'center',
        marginRight: 20
    },
    extraImageContainer: {
        alignItems: 'center',
        width: width / 3,
        height: width / 3,
        borderRadius: 1,
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    extraImage: {
        width: width / 3,
        height: width / 3,
        borderRadius: 10,
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
})
export default connect(mapStateToProps)(App)