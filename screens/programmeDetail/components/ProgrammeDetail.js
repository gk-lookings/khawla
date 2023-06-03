import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Api from '../../../common/api'
import AutoHeightWebView from 'react-native-autoheight-webview'
import Video from 'react-native-video';
import { LESSON_COURSES, PROGRAMMES } from '../../../common/endpoints'

const { height, width } = Dimensions.get('screen')
var videoLink = ''

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Programmes")}</Text>
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
            programmes: '',
            eventDetails: [],
            isLoading: true,
            loading: true,
            isVisibleImage: false,
            article: [],
            videoLink: [],
            showPlayer: false,
            playing: false,
            programmesData: this.props.navigation.getParam('data', null),
            programmeId: this.props.navigation.getParam('programmeId', null),
            lesson: []
        }
        this.onPress = this.onPress.bind(this);
        this.renderProgrammes = this.renderProgrammes.bind(this);
        this.renderArticles = this.renderArticles.bind(this);
        this.articleFooter = this.articleFooter.bind(this);
        this.renderLessons = this.renderLessons.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        var id = this.state.programmeId == null ? this.state.programmesData.programmeId : this.state.programmeId
        Api('get', PROGRAMMES + `language=${language}&programmeId=${id}`)
            .then((responseJson) => {
                if (responseJson) {
                    this.setState({
                        programmes: responseJson[0],
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

        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
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

            Api('get', LESSON_COURSES + `?language=${language}&programmeId=${id}`)
                .then((responseJson) => {
                    if (responseJson) {
                        this.setState({
                            lesson: responseJson.items,
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

    renderProgrammes({ item }) {
        return (
            <TouchableOpacity style={styles.prgrmContainer} onPress={() => this.props.navigation.navigate('ChildProgrammes', { data: item })}>
                <View style={styles.renderimageContain}>
                    <Image source={{ uri: item.eventCover }} style={styles.renderImage} resizeMode="contain" />
                </View>
                <View style={styles.renderTitle}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArticles({ item }) {
        return (
            <TouchableOpacity style={styles.articleContainer} onPress={() => this.props.navigation.navigate('ArticleDetail', { item: item })}>
                <View style={styles.renderImageArtcle}>
                    <Image source={{ uri: item.articlePicture }} style={styles.renderImage1} />
                </View>
                <View style={styles.renderTitle1}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.articleTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderLessons({ item }) {
        return (
            <TouchableOpacity style={styles.articleContainer} onPress={() => this.props.navigation.navigate('OnlineSection', { courses: item })}>
                <View style={styles.renderImageArtcle}>
                    <Image source={{ uri: item.picture }} style={styles.renderImage1} />
                </View>
                <View style={styles.renderTitle1}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    vimeoPlay() {
        if (this.state.programmes && this.state.programmes.videoURL.includes('vimeo')) {
            if (this.state.programmes.videoURL) {
                var url = this.state.programmes.videoURL;
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
                    this.setState({ videoLink: videoLink })
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

    articleFooter() {
        return (
            <View style={styles.showAll}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('showAllProgramme', { data: this.state.programmes })} style={styles.showBox}>
                    <Text style={styles.showText}>Show All</Text>
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        const programmes = this.state.programmes
        const article = this.state.article
        const filteredItem = article.filter(item => item.programmeId == programmes.programmeId)
        const filteredItems = filteredItem.slice(0, 6)
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator1}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => this.setState({ isVisibleImage: true })}>
                            <Image source={{ uri: programmes.eventCover }} style={styles.image} resizeMode="contain" onLoadEnd={this._onLoadEnd} />
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                animating={this.state.loading}
                            />
                        </TouchableOpacity>
                        <View>
                            <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 22 }]}>{programmes.title}</Text>
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                            * {
                              font-family: 'Cairo-Black';
                            }
                            p {
                              font-size: 16px;
                            }
                          `}
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                source={{ html: programmes.description }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                            />
                        </View>
                        {this.state.programmes.videoURL != '' &&
                            <View style={styles.videoContainer}>
                                {this.state.playing && this.state.videoLink != '' ?
                                    <View>
                                        {this.renderOptions()}
                                    </View>
                                    :
                                    <TouchableOpacity style={styles.videoContainerMain} onPress={() => this.setState({ playing: true })}>
                                        <View style={styles.imageVideoBG}>
                                            {/* <Image style={styles.imageVideoImage} source={{ uri: imageClct }} /> */}
                                        </View>
                                        <FontAwesome5 style={styles.videoIcon} name='play' size={40} color={PRIMARY_COLOR} />
                                    </TouchableOpacity>}
                                <View style={styles.videoTitleContainer}>
                                    <Text numberOfLines={1} style={styles.videoTitle}>{programmes.title}</Text>
                                </View>
                            </View>
                        }
                        {this.state.programmes.children != '' &&
                            <View style={{ marginTop: 10 }}>
                                <FlatList
                                    data={this.state.programmes.children}
                                    ItemSeparatorComponent={this.renderHeader}
                                    renderItem={this.renderProgrammes}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                />
                            </View>
                        }
                        {filteredItems != '' &&
                            <View style={{ marginTop: 30 }}>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("Latest_Feeds")}</Text>
                                <FlatList
                                    data={filteredItems}
                                    ItemSeparatorComponent={this.renderHeader}
                                    renderItem={this.renderArticles}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginTop: 10, marginLeft: 5 }}
                                    horizontal={true}
                                    ListFooterComponent={this.articleFooter}
                                />
                            </View>
                        }
                        {this.state.lesson != '' &&
                            <View style={{ marginTop: 30 }}>
                                <Text style={[styles.aboutText, this.props.lang == 'en' && { textAlign: 'left' }]}>{i18n.t("Distance_Learning")}</Text>
                                <FlatList
                                    data={this.state.lesson}
                                    ItemSeparatorComponent={this.renderHeader}
                                    renderItem={this.renderLessons}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginTop: 10, marginLeft: 5 }}
                                    horizontal={true}
                                />
                            </View>
                        }
                    </ScrollView>
                }
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
                        <Image source={{ uri: programmes.eventCover }} resizeMode="contain" style={styles.imageFull} />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                        <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </Modal>
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
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_MULI_REGULAR,
        marginTop: 10
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
    activityIndicator1: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2
    },
    image: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
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
    prgrmContainer: {
        height: 185,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
    },
    renderimageContain: {
        height: 140,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15,
    },
    articleContainer: {
        height: 230,
        width: width / 1.9,
        margin: 5,
        borderRadius: 10,
    },
    renderImageArtcle: {
        height: 200,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: .5,
    },
    renderImage: {
        height: 140,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    renderImage1: {
        height: 195,
        width: '98%',
        alignSelf: "center",
        marginTop: 3,
        borderRadius: 15,
    },
    renderTitle: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    renderTitle1: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    titleText: {
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 14,
        paddingLeft: 3,
        paddingRight: 3
    },
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
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
        flexDirection: 'row'
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
    backgroundVideo: {
        height: 200,
        borderRadius: 20,
        marginTop: 25,
        width: '95%',
        alignSelf: 'center'
    },
    aboutText: {
        textAlign: 'right',
        marginRight: 10,
        fontSize: 17,
        fontFamily: FONT_MULI_BOLD,
        marginTop: 30,
        paddingLeft: 10
    },
    showAll: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 200,
        width: width / 1.9,
        margin: 5,
    },
    showBox: {
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    showText: {
        color: PRIMARY_COLOR,
        fontFamily: FONT_MULI_BOLD,
        paddingHorizontal: 20,
        paddingVertical: 5
    }
})
export default connect(mapStateToProps)(App)