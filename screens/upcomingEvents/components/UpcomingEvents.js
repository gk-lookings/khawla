import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView, Dimensions, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import Api from '../../../common/api'
import VideoPlayer from 'react-native-video-controls';
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_LIGHT } from '../../../assets/fonts'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import i18n from '../../../i18n'
import { ARTISTS, EVENTS } from '../../../common/endpoints'
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import AutoHeightWebView from 'react-native-autoheight-webview'
const EVENTSS = "https://www.khawlafoundation.com/api/json_event_indetail.php?"
var videoLink = ''
const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Events")}</Text>
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
            eventDetails: {},
            // eventDetails: [],
            isLoading: false,
            loading: true,
            isVisible: false,
            videoLinks: "",
            artistDetails: '',
            isVisibleImage: false,
            image: "",
            videoLink: [],
            playing: false,
            isVisiblePic: false,
            image: '',
            eventId: this.props.navigation.getParam('eventId', null),
            eventInDetails:'',
            eventinDetails:''
        }
        this.renderVideos = this.renderVideos.bind(this)
        this.renderImage = this.renderImage.bind(this)
        this.onPress = this.onPress.bind(this);
        this.artistDetails = this.artistDetails.bind(this)
        this.vimeoPlay = this.vimeoPlay.bind(this)
        this.eventInDetails = this.eventInDetails.bind(this)
    }
    
    componentDidMount() {
        
        var language = this.props.lang == 'ar' ? 1 : 2
        let tempArray = []
        var today = this.formatDate(new Date())
        this.setState({isLoading: true})
        Api('get',EVENTS +`language=${language}`)
            .then((response) => {
                if (response) {
                    console.log('responsee,,,,',response.items);
                    response.items.forEach(element => {
                       if(element.eventDateTo >= today)
                       {
                         tempArray.push(element)
                       }
                   });
                   const res= response.items
                   if (tempArray.length > 0)
                   {
                    this.setState({
                        eventDetails: tempArray[0],
                        isLoading: false,
                    });
                    
                    this.eventInDetails();
                     
                    this.vimeoPlay() 
                }
                else{
                    this.setState({
                        eventDetails: [],
                        isLoading: false,
                    });
                }
                }
                else {
                    this.setState({
                        isLoading: false,
                    })                }
            },
            )
        this.props.navigation.setParams({ onPress: this.onPress })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }
    eventInDetails() {
       
        const artistId = this.state.eventDetails.artistId
        let eventId = this.state.eventDetails.eventId
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', `https://www.khawlafoundation.com/api/json_event_indetail.php?eventId=${eventId}&language=${language}`)
            .then((response) => {
                
                if (response) {
                    this.setState({
                        eventinDetails: response,
                    })
                   
                    this.artistDetails() 
                }
                else {
                    this.setState({
                        eventinDetails: '',
                    })                
                }
            })
    }
    
    artistDetails() {
        const artistId = this.state.eventinDetails.artistId
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS + '?artistId=' + artistId + `&language=${language}`)
            .then((response) => {
                if (response.items.length > 0) {
                    this.setState({
                        artistDetails: response.items[0],
                    })
                }
                else {
                    this.setState({
                        artistDetails: '',
                    })                
                }
            })
    }
    
   
    renderVideos({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: true, videoLinks: item })} style={styles.videoImage}>
                <ImageBackground
                    source={{ uri: this.state.eventDetails&&this.state.eventDetails.eventCover }}
                    style={{ height: 95, width: 95, borderRadius: 10 }}
                    borderRadius={10}
                    blurRadius={2}
                >
                    <View style={{ width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', opacity: .5, borderRadius: 10 }}>
                        <AntDesign name="playcircleo" size={25} color="#fff" style={styles.iconContainer2} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
    // onPress={() => this.setState({ isVisibleImage: true, image: item })}
    renderImage({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisiblePic: true, image: item })} style={styles.imageList}>
                <Image
                    source={{ uri: item }}
                    style={styles.imageItem}
                />
            </TouchableOpacity>
        );
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }


    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    vimeoPlay() {
        if (this.state.eventDetails && this.state.eventDetails.videoURL.includes('vimeo')) {
            if (this.state.eventDetails.videoURL) {
                var url = this.state.eventDetails.videoURL;
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
                    this.setState({ videoLink: videoLink, videoName: this.state.eventDetails.videoTitle1 })
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
        
        var today = this.formatDate(new Date())
        var eventDate = this.state.eventDetails&&this.state.eventDetails.eventDateFrom
        const events = this.state.eventinDetails
       
        return (
            <SafeAreaView style={styles.mainContainer}>
               
                {this.state.isLoading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }

                {!this.state.isLoading &&
                <View style={{flex: 1}}>
                    {true?
                    <ScrollView style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => this.setState({ isVisibleImage: true })}>
                            <Image source={{ uri: events&&events.eventCover }} style={styles.imageStyle} onLoadEnd={this._onLoadEnd} resizeMode="contain" />
                            <ActivityIndicator
                                style={styles.activityIndicator}
                                animating={this.state.loading}
                            />
                        </TouchableOpacity>
                        <View>
                            {events.title != '' &&
                                <Text numberOfLines={3} style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right' }]}>{events.title}</Text>
                            }
                            <View>
                                {events.eventDisplayDate != '' &&
                                    <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                                        <AntDesign name="calendar" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                                        <Text numberOfLines={1} style={[styles.eventDate, this.props.lang == 'ar' && { textAlign: 'right' }]}>{events && events.eventDateFrom}</Text>
                                    </View>
                                }
                                {events.eventTime != " " &&
                                    <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                                        <AntDesign name="clockcircleo" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                                        <Text numberOfLines={3} style={[styles.eventDate, this.props.lang == 'ar' && { textAlign: 'right' }]}>{events.eventTime}</Text>
                                    </View>
                                }
                                {events.location != " " &&
                                    <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                                        <SimpleLineIcons name="location-pin" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 },]} />
                                        <Text numberOfLines={3} style={[styles.eventDate, this.props.lang == 'ar' && { textAlign: 'right' }]}>{events.location}</Text>
                                    </View>
                                }
                            </View>
                            {this.state.artistDetails!= '' &&
                                <TouchableOpacity style={[{ flexDirection: 'row', alignItems:'center' }, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]} onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: this.state.artistDetails })}>
                                    <Text numberOfLines={3} style={[styles.titleArtist, this.props.lang == 'ar' && { textAlign: 'right', paddingRight: 10, paddingLeft: 3 }]}>{this.state.artistDetails && this.state.artistDetails.artistTitle}</Text>
                                    <EvilIcons name="external-link" size={20} color={PRIMARY_COLOR} style={{ opacity: .7 }} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.descriptionView}>
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                                * {
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
                                source={{ html: events.description }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={styles.artButtonContainer}>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('ArtGalleryUpcomingEvents',{event: this.state.eventDetails})} style={styles.artButtons}>
                                    <Text style={styles.artText}>{i18n.t("art_works")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('ArtistsUpcomingEvents',{item: events})} style={styles.artButtons}>
                                    <Text style={styles.artText}>{i18n.t("Artists")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('HHcollection',{item: events})} style={styles.artButtons}>
                                    <Text style={styles.artText}>{i18n.t("hhcollection")}</Text>
                                </TouchableOpacity>
                        </View>
                        {this.state.eventDetails.eventPhotos != "" &&
                            <View style={styles.videosContainer}>
                                {/* <Text style={styles.videoText}>{i18n.t("Event_images")}</Text> */}
                                <FlatList
                                    data={this.state.eventDetails.eventPhotos}
                                    renderItem={this.renderImage}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    style={{ marginTop: 15, marginLeft: 5 }}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        }
                        {/* {this.state.eventDetails.isVideoAvailable == 2 &&
                            <View style={styles.videosContainer}>
                                <FlatList
                                    data={this.state.eventDetails.eventVideos}
                                    renderItem={this.renderVideos}
                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginTop: 5, marginLeft: 5 }}
                                />
                            </View>
                        } */}
                        {this.state.eventDetails.videoURL && this.state.eventDetails && this.state.eventDetails.videoURL != "" &&
                            <View style={styles.videoContainer}>
                                {this.state.playing && this.state.videoLink != '' ?
                                    <View>
                                        {this.renderOptions()}
                                    </View>
                                    :
                                    <TouchableOpacity style={styles.videoContainerMain} onPress={() => this.setState({ playing: true })}>
                                        <View style={styles.imageVideoBG}>
                                            <Image style={styles.imageVideoImage} source={{ uri: this.state.eventDetails&&this.state.eventDetails.eventCover }} />
                                        </View>
                                        <FontAwesome5 style={styles.videoIcon} name='play' size={40} color={PRIMARY_COLOR} />
                                    </TouchableOpacity>}
                                <View style={styles.videoTitleContainer}>
                                    <Text numberOfLines={1} style={styles.videoTitle}>{this.state.eventDetails.title}</Text>
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
                                source={{ uri: this.state.videoLinks }}
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
                                <Image source={{ uri: events&&events.eventCover }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
                        <Modal
                            isVisible={this.state.isVisiblePic}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            hasBackdrop={true}
                            backdropColor='black'
                            backdropOpacity={.9}
                            onBackButtonPress={() => this.setState({ isVisiblePic: false })}
                            onBackdropPress={() => this.setState({ isVisiblePic: false })}
                            style={{}}
                        >
                            <View style={styles.imageFull}>
                                <Image source={{ uri: this.state.image }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisiblePic: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
                    </ScrollView>
                    :
                    <View style={styles.noData}>
                        <Text style={styles.noDataText}>No data found !</Text>
                        </View>
    }
                    </View>
                }
                {eventDate >= today &&
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RegisterEvent', { item: events })} >
                        <LinearGradient
                            colors={['#b34f77', '#b3406e', '#b3406e']}
                            style={styles.register}
                        >
                            <Text style={styles.registerText}>{i18n.t("Register")}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
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
        fontFamily: FONT_LIGHT,
        paddingRight: 10
    },
    eventDate: {
        fontSize: 14,
        textAlign: 'left',
        paddingRight: 7,
        paddingLeft: 7,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    imageContainer: {
        backgroundColor: '#fff',
    },
    titleEvent: {
        fontSize: 20,
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
        height: 95,
        width: 95,
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageList: {
        margin: 5,
        height: 95,
        width: 95,
        justifyContent: 'center',
        borderRadius: 10,
    },
    titleArtist: {
        fontSize: 15,
        textAlign: 'left',
        paddingRight: 3,
        paddingLeft: 10,
        color: '#ad6183',
        fontFamily: FONT_LIGHT
    },
    imageStyle: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    videosContainer: {
        backgroundColor: '#fff',
        width: '100%',
        marginTop: 30
    },
    register: {
        width: '80%',
        height: 40,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
        margin: 5
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    descriptionView: {
        marginTop: 25,
        margin: 10
    },
    imageItem: {
        height: 95,
        width: 95,
        borderRadius: 10
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
    registerText: {
        color: '#fff',
        fontFamily: FONT_MULI_BOLD,
        fontSize: 15
    },
    icon: {
        marginLeft: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    videoContainer: {
        height: 265,
        borderRadius: 20,
        marginHorizontal: 13,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: .5,
        marginBottom: 5,
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
    WebView: {
        width: '100%',
        marginTop: 20,
        backgroundColor: '#fff',
    },
    artButtonContainer:{
        marginTop: 15,
        flexDirection:'row',
    },
    artButtons:{
        paddingHorizontal: 13,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        marginLeft: 10,
        borderRadius:10
    },
    artText:{
        fontFamily: FONT_MULI_BOLD,
        color: PRIMARY_COLOR
    },
    noData:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    noDataText:{
        fontFamily: FONT_MULI_BOLD,
        color: COLOR_SECONDARY,
        fontSize: 16
    }
})
export default connect(mapStateToProps)(App)