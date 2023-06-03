import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_LIGHT, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { ARTISTS, EVENTS_DETAIL } from '../../../common/endpoints'
import Api from '../../../common/api'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import { WebView } from 'react-native-webview';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Video from 'react-native-video';
import AutoHeightWebView from 'react-native-autoheight-webview'

const { height, width } = Dimensions.get('screen')
var videoLink = ''

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Artists")}</Text>
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
            artist: '',
            isLoading: true,
            loading: true,
            events: [],
            isVisible: false,
            isVisibleImage: false,
            videoLink: [],
            playing: false,
            artistData: this.props.navigation.getParam('artists', null),
            artistId: this.props.navigation.getParam('artistId', null),
            eventData: this.props.navigation.getParam('eventData', null),
            article: [],
            artworkSelected: '',
            isVisibleArt: false
        }
        console.log('evenetetettet', this.state.artistData)
        this.onPress = this.onPress.bind(this);
        this.renderArticle = this.renderArticle.bind(this)
        this.renderArtworks = this.renderArtworks.bind(this)
        this.renderCourses = this.renderCourses.bind(this)
        this.WebView = this.WebView.bind(this);
        this.vimeoPlay = this.vimeoPlay.bind(this);
    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })

        var language = this.props.lang == 'ar' ? 1 : 2
        var id = this.state.artistId == null ? this.state.artistData.artistId : this.state.artistId
        Api('get', ARTISTS + `?language=${language}&artistId=${id}${this.state.eventData != null ? `&eventId=${this.state.eventData.eventId}` : ''}`)
            .then((response) => {
                if (response) {
                    let res = response.items[0]
                    console.log("Artists...", response)
                    this.setState({
                        artist: res,
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
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&artistId=${id}`)
            .then((responseJson) => {
                if (responseJson) {
                    let res = responseJson.items
                    console.log("Artists.articleeee..", res)
                    this.setState({
                        article: res,
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
    renderArtworks({ item }) {
        return (
            <TouchableOpacity style={[styles.relatedArt, this.props.lang == 'en' && { alignSelf: 'center' }]} onPress={() => this.setState({artworkSelected: item, isVisibleArt: true})}>
                <Image
                    source={{ uri: item.picture }}
                    style={styles.imageEventArt}
                    resizeMode="contain"
                /> 
              <Text numberOfLines={1} style={styles.title2}>{item.title}</Text> 
            </TouchableOpacity>
        )
    }
    renderArticle({ item }) {
        return (
            <TouchableOpacity style={[styles.related, this.props.lang == 'en' && { alignSelf: 'center' }]} onPress={() => this.props.navigation.navigate('LatestFeedsDetail', { item: item })}>
                <Image
                    source={{ uri: item.articlePicture }}
                    style={styles.imageEvent}
                />
                <Text numberOfLines={1} style={styles.title2}>{item.articleTitle}</Text>
            </TouchableOpacity>
        )
    }
    renderCourses({ item }) {
        return (
            <TouchableOpacity style={[styles.related, this.props.lang == 'en' && { alignSelf: 'center' }]} onPress={() => this.props.navigation.navigate('OnlineSection', { courses: item })}>
                <Image
                    source={{ uri: item.picture }}
                    style={styles.imageEvent}
                />
                <Text numberOfLines={1} style={styles.title2}>{item.title}</Text>
            </TouchableOpacity>
        )
    }


    vimeoPlay() {
        if (this.state.artist && this.state.artist.videoURL.includes('vimeo')) {
            if (this.state.artist.videoURL) {
                var url = this.state.artist.videoURL;
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
                    this.setState({ videoLink: videoLink, videoName: this.state.artist.videoTitle1 })
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
        const artist = this.state.artist
        var data = artist.artistDescription
        const url = artist.videoURL
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator1}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => this.setState({ isVisibleImage: true })}>
                            <Image source={{ uri: artist.picture }} style={styles.image} resizeMode="contain" onLoadEnd={this._onLoadEnd} />
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                animating={this.state.loading}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.titleEvent, this.props.lang == 'en' && { textAlign: 'left', fontSize: 19 }]}>{artist.artistTitle}</Text>
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
                            source={{ html: data }}
                            scalesPageToFit={true}
                            viewportContent={'width=device-width, user-scalable=yes'}
                            scrollEnabled={false}
                        />
                        {artist.isVideoAvailable == 2 &&
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
                                <View style={[styles.imageVideo, this.props.lang == 'en' && { alignSelf: 'flex-start' }]}>
                                    <ImageBackground blurRadius={3} source={{ uri: artist.picture }} style={styles.imageBackground}>
                                        <AntDesign name="playcircleo" size={40} color="#fff" style={styles.iconContainer2} />
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        }
                        {artist.isVideoAvailable == 1 &&
                            <View style={styles.videoContainer}>
                                {this.state.playing && this.state.videoLink != '' ?
                                    <View>
                                        {this.renderOptions()}
                                    </View>
                                    :
                                    <TouchableOpacity style={styles.videoContainerMain} onPress={() => this.setState({ playing: true })}>
                                        <View style={styles.imageVideoBG}>
                                            <Image style={styles.imageVideoImage} source={{ uri: artist.picture }} />
                                        </View>
                                        <FontAwesome5 style={styles.videoIcon} name='play' size={40} color={PRIMARY_COLOR} />
                                    </TouchableOpacity>}
                                <View style={styles.videoTitleContainer}>
                                    <Text numberOfLines={1} style={styles.videoTitle}>{artist.artistTitle}</Text>
                                </View>
                            </View>
                        }
                        {artist.artworks && artist.artworks.length > 0 &&
                            <View>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("art_works")}</Text>
                                <FlatList
                                    data={artist.artworks}
                                    renderItem={this.renderArtworks}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                />
                            </View>
                        }
                        {this.state.article != "" &&
                            <View>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("Latest_Feeds")}</Text>
                                <FlatList
                                    data={this.state.article}
                                    renderItem={this.renderArticle}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                />
                            </View>
                        }
                        {artist.courses != "" &&
                            <View>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("Distance_Learning")}</Text>
                                <FlatList
                                    data={artist.courses}
                                    renderItem={this.renderCourses}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
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
                                source={{ uri: artist.videoURL }}
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
                                <Image source={{ uri: artist.picture }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
                        <Modal
                            isVisible={this.state.isVisibleArt}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            hasBackdrop={true}
                            backdropColor='black'
                            backdropOpacity={.7}
                            onBackButtonPress={() => this.setState({ isVisibleArt: false })}
                            onBackdropPress={() => this.setState({ isVisibleArt: false })}
                            style={{}}
                        >
                            <View style={styles.artWorksModal}>
                                <ScrollView>
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: this.state.artworkSelected.picture }} style={styles.image} resizeMode="contain" onLoadEnd={this._onLoadEnd} />
                                    <ActivityIndicator
                                        style={styles.activityIndicator}
                                        animating={this.state.loading}
                                    />
                                </View>
                                <Text style={[styles.titleEvent, this.props.lang == 'en' && { textAlign: 'left', fontSize: 19 }]}>{this.state.artworkSelected.title}</Text>
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
                                    source={{ html: this.state.artworkSelected.description }}
                                    scalesPageToFit={true}
                                    viewportContent={'width=device-width, user-scalable=yes'}
                                    scrollEnabled={false}
                                />
                                <TouchableOpacity onPress={()=>this.setState({isVisibleArt: false})} style={styles.artClose}>
                                    <Text style={styles.artCloseText}>{i18n.t("Close")}</Text>
                                </TouchableOpacity>
                                </ScrollView>
                            </View>
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
        fontSize: 16,
        textAlign: 'justify',
        paddingLeft: 10,
        fontFamily: FONT_MULI_REGULAR,
        paddingRight: 10,
        marginTop: 20
    },
    title2: {
        fontSize: 15,
        textAlign: 'center',
        paddingRight: 10,
        marginTop: 5,
        fontFamily: FONT_MULI_REGULAR
    },
    imageContainer: {

    },
    image: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    aboutText: {
        textAlign: 'right',
        marginRight: 10,
        fontSize: 17,
        fontFamily: FONT_MULI_BOLD,
        marginTop: 30,
        paddingLeft: 10
    },
    imageEvent: {
        height: 190,
        width: '100%',
        borderRadius: 20
    },
    related: {
        height: 200,
        width: 200,
        alignSelf: 'center',
        padding: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        marginBottom: 40,
        marginLeft: 5
    },
    imageEventArt: {
        height: 190,
        width: '100%',
    },
    relatedArt: {
        height: 200,
        width: 200,
        alignSelf: 'center',
        padding: 5,
        marginBottom: 40,
        marginLeft: 10,
        borderWidth: .5,
        borderColor: SECONDARY_COLOR,
    },
    titleEvent: {
        fontSize: 20,
        textAlign: 'right',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
    },
    imageVideo: {
        height: 90,
        width: 90,
        marginTop: 5,
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
        height: 250,
        marginTop: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        margin: 5,
        marginBottom: 15
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
    activityIndicator1: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndicator: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        position: 'absolute'
    },
    artWorksModal: {
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
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    artClose:{
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        paddingHorizontal: 25,
        paddingVertical: 5
    },
    artCloseText:{
        fontFamily: FONT_MULI_BOLD,
        fontSize: 15,
        color: "white"
    }
})
export default connect(mapStateToProps)(App)