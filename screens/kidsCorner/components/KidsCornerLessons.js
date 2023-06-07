import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT } from '../../../assets/fonts'
import Api from '../../../common/api'
import { LESSON_COURSES, ONLINE_SECTION } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import AutoHeightWebView from 'react-native-autoheight-webview'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Images from '../../../assets/images'

const { height, width } = Dimensions.get('screen')
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
            online: [],
            isLoading: true,
            isVisible: false,
            course: '',
            isVisibleImage: false,
            page: 1,
            isLastPage: true,
            courseData: this.props.navigation.getParam('articledata', null),
            courseId: this.props.navigation.getParam('courseId', null),
        }
        this.onPress = this.onPress.bind(this)
        this.renderOnline = this.renderOnline.bind(this)
        this.getData = this.getData.bind(this)
        this.onPressItem = this.onPressItem.bind(this)
        this.footerView = this.footerView.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }

    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page

        var language = this.props.lang == 'ar' ? 1 : 2
        var id = this.state.courseId == null ? this.state.courseData.courseId : this.state.courseId
        Api('get', LESSON_COURSES + `?language=${language}&courseId=${id}&age=1`)
            .then((response) => {
                if (response) {
                    console.log('courseeeeeee......s', response)
                    let res = response.items[0]
                    this.setState({
                        course: res,
                    })
                }
            })

        Api('get', ONLINE_SECTION + `language=${language}&courseId=${id}&page=${page}`)
            .then((response) => {
                if (response) {
                    console.log('lesssions....', response)
                    let res = response.items
                    this.setState({
                        online: this.state.online.concat(res),
                        isLoading: false,
                        page: this.state.page + 1,
                        isLastPage: response.isLastPage ? true : false,
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

    onPressItem({ item, index }) {
        if (this.props.user) {
            this.props.navigation.navigate("KidsCornerDetail", { onlineData: item, onlineIndex: index })
        }
        else if (item.isLoginRequired) {
            this.setState({ isVisible: true })
        }
        else {
            this.props.navigation.navigate("KidsCornerDetail", { onlineData: item })
        }
    }

    footerView() {
        if (!this.state.isLastPage) {
            return (
                <View style={{ margin: 20 }}>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else
            return null
    }

    renderOnline({ item, index }) {
        return (
            <TouchableOpacity onPress={() => this.onPressItem({ item: item, index: index })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                <View style={{ height: '100%', width: width * .7, justifyContent: 'center', paddingRight: 20, paddingLeft: 20 }}>
                    <Text numberOfLines={1} style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.lessonTitle}</Text>
                    <Text numberOfLines={1} style={[styles.description, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.displayDate}</Text>
                    <Text numberOfLines={1} style={[styles.description, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <View style={{}}>
                    <Image
                        source={{ uri: item.lessonPicture }}
                        style={styles.imageContainer}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContainer}>
                        <ImageBackground source={Images.design} style={{}}>
                        <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true })} style={styles.imageContainer1}>
                            <Image source={{ uri: this.state.course.picture }} style={styles.imageStyle} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 20 }]}>{this.state.course.title}</Text>
                        <View style={[styles.dateContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                            <AntDesign name="calendar" size={16} color={COLOR_SECONDARY} style={[styles.icon, this.props.lang == 'ar' && { marginRight: 10, marginLeft: 0 }]} />
                            <Text numberOfLines={3} style={[styles.title2, this.props.lang == 'ar' && { textAlign: 'right' }]}>{this.state.course.displayDate}</Text>
                        </View>
                        {this.state.course.artistName != "" &&
                            <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center' }, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]} onPress={() => this.props.navigation.navigate("ArtistDetail", { artistId: this.state.course.artistId })}>
                                <Text numberOfLines={3} style={[styles.titleArtist, this.props.lang == 'ar' && { textAlign: 'right', paddingRight: 10, paddingLeft: 3 }]}>{this.state.course.artistName}</Text>
                                <EvilIcons name="external-link" size={20} color={PRIMARY_COLOR} style={{ opacity: .7 }} />
                            </TouchableOpacity>
                        }
                        </ImageBackground>
                        <View style={styles.spec}>
                            <View style={styles.level}>
                                <Text style={styles.levelTitle}>Level</Text>
                                <Text style={styles.levelText}>{this.state.course.level}</Text>
                            </View>
                            <View style={styles.level}>
                                <Text style={styles.levelTitle}>Duration</Text>
                                <Text style={styles.levelText}>{this.state.course.duration}</Text>
                            </View>
                            <View style={styles.level}>
                                <Text style={styles.levelTitle}>Lessons</Text>
                                <Text style={styles.levelText}>{this.state.course.lessonsCount}</Text>
                            </View>
                        </View>
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
                            source={{ html: this.state.course.description }}
                            scalesPageToFit={true}
                            viewportContent={'width=device-width, user-scalable=yes'}
                            scrollEnabled={false}
                        />
                        <View>
                            <FlatList
                                data={this.state.online}
                                renderItem={this.renderOnline}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                ListFooterComponent={this.footerView}

                            />
                        </View>
                        <Modal
                            isVisible={this.state.isVisible}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            useNativeDriver={true}
                            hideModalContentWhileAnimating={true}
                            animationOutTiming={300}
                            onBackButtonPress={() => this.setState({ isVisible: false })}
                            onBackdropPress={() => this.setState({ isVisible: false })}
                            style={styles.modal}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalText}>You need to login to view this content. Please Login. Not a Member? Join Us.</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisible: false })}>
                                        <Text style={styles.cancel}>{i18n.t("CANCEL")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ isVisible: false }, () => this.props.navigation.navigate('Login'))} style={styles.button}>
                                        <Text style={styles.subscribe}>{i18n.t("LOGIN")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
                                <Image source={{ uri: this.state.course.picture }} resizeMode="contain" style={styles.imageFull} />
                            </View>
                            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                                <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                            </TouchableOpacity>
                        </Modal>
                    </ScrollView>
                }
            </View>
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
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
    },
    imageContainer: {
        width: 65,
        height: 65,
        borderRadius: 10,
    },
    imageContainer1: {
    },
    mediaContainer: {
        padding: 10,
        alignItems: 'center',
        width: '97%',
        height: 90,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'right',
        color: COLOR_SECONDARY,
        lineHeight: 20
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
        fontSize: 18,
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
    imageStyle: {
        height: 220,
        width: width * .9,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    titleEvent: {
        fontSize: 19,
        textAlign: 'left',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 10,
    },
    title2: {
        fontSize: 13,
        textAlign: 'left',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    description2: {
        fontSize: 16,
        textAlign: 'left',
        paddingLeft: 10,
        fontFamily: FONT_LIGHT,
        paddingRight: 10,
        marginTop: 20,
        marginBottom: 15
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
    titleArtist: {
        fontSize: 14,
        textAlign: 'left',
        paddingRight: 3,
        paddingLeft: 10,
        color: '#ad6183',
        fontFamily: FONT_MULI_BOLD
    },
    level:{
        padding: 5,
        backgroundColor:'#fff',
        width: width/3.5,
        justifyContent:'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0.5,
            height: 0.5
        },
        shadowRadius: 0.5,
        shadowOpacity: 0.5,
        elevation: 1,
        borderRadius: 5
    },
    levelText:{
        fontSize: 14,
        fontFamily: FONT_MULI_REGULAR,
        lineHeight: 20
    },
    spec:{
        flexDirection:'row',
        width: width,
        justifyContent:'space-around',
        marginVertical: 10
    },
    levelTitle:{
        fontSize:12,
        fontFamily:FONT_LIGHT,
    }
})
export default connect(mapStateToProps)(App)