import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_LIGHT, FONT_MULI_BOLD, FONT_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { ARTISTS_LIST } from '../../../common/endpoints'
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
            artist: this.props.navigation.getParam('item', null),
            country: this.props.navigation.getParam('country', null),
            isLoading: true,
            loading: true,
            events: [],
            isVisible: false,
            isVisibleImage: false,
            videoLink: [],
            playing: false,
            artistDetail: [],
            isVisibleCV: false,
            item: '',
            article: []
        }
        this.onPress = this.onPress.bind(this);
        this.eventId = this.eventId.bind(this)
        this.vimeoPlay = this.vimeoPlay.bind(this);
        this.renderMasters = this.renderMasters.bind(this);
        this.renderStudents = this.renderStudents.bind(this);
        this.renderArticle = this.renderArticle.bind(this);
        this.onPressItem = this.onPressItem.bind(this);
        this.renderCertificates = this.renderCertificates.bind(this);
    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        // this.etId(this.state.artist.events)
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS_LIST + `?artistId=${this.state.artist.artistId}` + `&categoryId=${this.state.artist.categoryId ? this.state.artist.categoryId: 1}` + `&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Artists..gggggetai.", responseJson.items)
                    this.setState({
                        artistDetail: responseJson.items[0],
                        isLoading: false
                    }),
                        this.vimeoPlay()
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })

        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&artistId=${this.state.artist.artistId}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Articccccccleeeeeeeeeeee.", responseJson)
                    this.setState({
                        article: responseJson.items,
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
    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    // WebView(item) {
    //     if (item.includes('vimeo')) {
    //         var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
    //         var match = item.match(regExp);
    //         if (match) {
    //             const VIMEO_ID = match[2]
    //             console.log('VIMEO_ID', VIMEO_ID)
    //             return (
    //                 <WebView
    //                     style={styles.WebView}
    //                     javaScriptEnabled={true}
    //                     domStorageEnabled={true}
    //                     source={{ uri: `https://player.vimeo.com/video/${VIMEO_ID}` }}
    //                 />
    //             )
    //         }
    //     }
    //     else if ((item.includes('youtu.be')) || (item.includes('youtube'))) {
    //         if (item.includes("watch?v=")) {
    //             var SplitedVideo = item.split("watch?v=")
    //             var Embed = SplitedVideo.join("embed/")
    //         }
    //         else if (item.includes("youtu.be")) {
    //             var link = item.replace("youtu.be", "www.youtube.com")
    //             var Embed = link.replace(".com", "-nocookie.com/embed/")
    //         }
    //         return (
    //             <WebView
    //                 style={styles.WebView}
    //                 javaScriptEnabled={true}
    //                 domStorageEnabled={true}
    //                 source={{ uri: Embed + '?rel=0&autoplay=0&showinfo=0&controls=0' }}
    //             />
    //         )
    //     }
    // }
    eventId() {
        return this.state.events && this.state.events.map((data) => {
            return (
                <TouchableOpacity style={[styles.related, this.props.lang == 'en' && { alignSelf: 'center' }]} onPress={() => this.props.navigation.navigate('EventDetail', { item: data })}>
                    <Image
                        source={{ uri: data.eventCover }}
                        style={styles.imageEvent}
                    />
                    <Text style={styles.title2}>{data.title}</Text>
                </TouchableOpacity>
            )
        })

    }

    // etId(events) {
    //     let ss = []
    //     for (let index = 0; index < events.length; index++) {
    //         Api('get', EVENTS_DETAIL + '&eventId=' + events[index])
    //             .then((responseJson) => {
    //                 if (responseJson) {
    //                     ss.push(responseJson)
    //                 }
    //                 this.setState({
    //                     events: ss,
    //                 })
    //             })
    //     }

    // }


 
    vimeoPlay() {
        if (this.state.artistDetail && this.state.artistDetail.videoURL.includes('vimeo')) {
            if (this.state.artistDetail.videoURL) {
                var url = this.state.artistDetail.videoURL;
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
                    this.setState({ videoLink: videoLink, videoName: this.state.artistDetail.videoTitle1 })
                }
            }
        }
    }

    onPressItem(item) {
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS_LIST + `?artistId=${item.artistId}` + `&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Artists..daaaaaaaaaattttttttttt.", responseJson)
                    this.setState({
                        artistDetail: responseJson[0],
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

    renderMasters({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push('ArtistWorldDetail', { item: item })} style={styles.mastersItem}>
                <Image source={{ uri: item.picture }} style={styles.mastersImage} />
                <Text style={styles.masterNameText}>{item.artistTitle}</Text>
            </TouchableOpacity>
        )
    }

    renderStudents({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.push('ArtistWorldDetail', { item: item })} style={styles.mastersItem}>
                <Image source={{ uri: item.picture }} style={styles.mastersImage} />
                <Text style={styles.masterNameText}>{item.artistTitle}</Text>
            </TouchableOpacity>
        )
    }

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LatestFeedsDetail', { item: item })} style={styles.mastersItem}>
                <Image source={{ uri: item.articlePicture }} style={[styles.mastersImage, { borderRadius: 5 }]} />
                <Text numberOfLines={2} style={styles.masterNameText}>{item.articleTitle}</Text>
            </TouchableOpacity>
        )
    }

    renderCertificates({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisibleCV: true, item: item })} style={styles.certificate}>
                <Image source={{ uri: item.picture }} resizeMode="contain" style={styles.certificateImage} />
            </TouchableOpacity>
        )
    }

    renderOptions = () => {
        if (this.state.videoLink && this.state.videoLink.length > 0) {
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
        const artist = this.state.artistDetail
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
                            <Image source={{ uri: this.state.artistDetail.picture }} style={styles.image} resizeMode="contain" onLoadEnd={this._onLoadEnd} />
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                animating={this.state.loading}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.titleEvent, this.props.lang == 'en' && { textAlign: 'left', fontSize: 19 }]}>{this.state.artistDetail.artistTitle}</Text>
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
                        {this.state.events != "" &&
                            <View>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("related_events")}</Text>
                                <View style={{ paddingBottom: 15, paddingTop: 10 }}>
                                    {this.state.events && this.eventId()}
                                </View>
                            </View>
                        }
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
                        {
                            artist && artist.certificates != '' &&
                            <View style={styles.masters}>
                                <Text style={styles.mastersText}>Certificates</Text>
                                <FlatList
                                    data={artist.certificates}
                                    renderItem={this.renderCertificates}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                />
                            </View>
                        }
                        {
                            artist && artist.masters != '' &&
                            <View style={styles.masters}>
                                <Text style={styles.mastersText}>{i18n.t('masters')}</Text>
                                <FlatList
                                    data={artist.masters}
                                    renderItem={this.renderMasters}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                />
                            </View>
                        }
                        {
                            artist && artist.students != '' &&
                            <View style={styles.masters}>
                                <Text style={styles.mastersText}>{i18n.t('students')}</Text>
                                <FlatList
                                    data={artist.students}
                                    renderItem={this.renderStudents}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                />
                            </View>
                        }
                        {
                            this.state.article != '' &&
                            <View style={styles.masters}>
                                <FlatList
                                    data={this.state.article}
                                    renderItem={this.renderArticle}
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
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: 15 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
                        <Modal
                            isVisible={this.state.isVisibleCV}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            hasBackdrop={true}
                            backdropColor='black'
                            backdropOpacity={.9}
                            onBackButtonPress={() => this.setState({ isVisibleCV: false })}
                            onBackdropPress={() => this.setState({ isVisibleCV: false })}
                            style={{}}
                        >
                            <View style={styles.imageFull}>
                                <Image source={{ uri: this.state.item.picture }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleCV: false })} style={{ marginTop: 15 }}>
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
        fontSize: 17,
        textAlign: 'right',
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        paddingRight: 10,
        marginTop: 20
    },
    title2: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        paddingRight: 10,
        marginTop: 5,
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
        height: 260,
        width: '100%',
    },
    related: {
        height: 270,
        width: 300,
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
        marginBottom: 40
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
    masters: {
        marginTop: 30
    },
    mastersText: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        padding: 10,
        alignSelf: 'center'
    },
    mastersItem: {
        width: 100,
        borderRadius: 15,
        margin: 10,
        marginTop: 5
    },
    mastersImage: {
        height: 100,
        width: 100,
        borderRadius: 75
    },
    certificateImage: {
        height: 100,
        width: 100,
        borderRadius: 5
    },
    certificate: {
        width: 100,
        borderRadius: 5,
        margin: 10,
        marginTop: 5
    },
    masterNameText: {
        alignSelf: 'center',
        textAlign: 'center',
        padding: 5,
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR
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
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})
export default connect(mapStateToProps)(App)