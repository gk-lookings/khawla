import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ART_GALLERY, ARTICLE_FOUNDER, STATIC_PAGE } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AutoHeightWebView from 'react-native-autoheight-webview'
import Modal from "react-native-modal"

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Founder")}</Text>
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

            headerRight: (
                <TouchableOpacity style={{ paddingRight: 15, paddingLeft: 15 }}>
                    {/* <AntDesign name='closecircleo' size={20} color={'#000'} style={{}} /> */}
                </TouchableOpacity>),
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
            artGallery: [],
            isLoading: true,
            isList: true,
            intro: '',
            isVisibleImage: false,
            article: [],
            page: 1,
            isLastPage: false,
        }
        this.onEndReachedCalledDuringMomentum = true;
        this.onPress = this.onPress.bind(this)
        this.renderArt = this.renderArt.bind(this)
        this.getData = this.getData.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
        this.renderArticles = this.renderArticles.bind(this);
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
        Api('get', ART_GALLERY + `?language=${language}&page=${page}`)
            .then((response) => {
                if (response) {
                    let res = response.items
                    console.log("Art,.,..,...", response)
                    this.setState({
                        artGallery: this.state.artGallery.concat(res),
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
        Api('get', STATIC_PAGE + "?pageId=13" + `&language=${language}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        intro: response,
                    })
                }
            })

        Api('get', ARTICLE_FOUNDER + `?language=${language}`)
            .then((response) => {
                if (response) {
                    console.log("founderrrrrrrrrrrrrrrrr,.,..,...", response)
                    this.setState({
                        article: response.items,
                    })
                }
            })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('FounderDetail', { artdata: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.artPicture }} style={styles.imageStyleGrid} resizeMode="contain" />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArt({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('FounderDetail', { artdata: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.arrow}>
                    {/* {this.props.lang == 'ar' ?
                        <IconMaterial name='keyboard-arrow-left' size={28} color={'#999999'} />
                        :
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    } */}
                </View>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artTitle}</Text>
                </View>
                <Image source={{ uri: item.artPicture }} style={styles.imageStyle} resizeMode="contain" />
            </TouchableOpacity>
        )
    }

    renderArticles({ item }) {
        return (
            <TouchableOpacity style={styles.articleContainer} onPress={() => this.props.navigation.navigate('ArticleDetail', { item: item })}>
                <View style={styles.renderImageArtcle}>
                    <Image source={{ uri: item.articlePicture }} style={styles.renderImage1} />
                </View>
                <View style={styles.renderTitle}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.articleTitle}</Text>
                </View>
            </TouchableOpacity>
        )
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

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading ?
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size={"large"} color={PRIMARY_COLOR}/>
                </View>
                :
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <TouchableOpacity style={styles.imageContainer} onPress={() => this.setState({ isVisibleImage: true })}>
                            <Image source={{ uri: this.state.intro.picture }} style={styles.image} resizeMode="contain" />
                        </TouchableOpacity>
                        <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 22 }]}>{this.state.intro.title}</Text>
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
                            source={{ html: this.state.intro.description }}
                            scalesPageToFit={true}
                            viewportContent={'width=device-width, user-scalable=yes'}
                            scrollEnabled={false}
                        />
                    </View>
                    <View>
                        {this.state.article != '' &&
                            <FlatList
                                data={this.state.article}
                                renderItem={this.renderArticles}
                                keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: 10, marginLeft: 5 }}
                                horizontal={true}
                            />
                        }

                    </View>
                    {this.state.artGallery != '' &&
                        <View>
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                    {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                                </TouchableOpacity>
                            </View>
                            <View>
                                {this.state.isList &&
                                    <FlatList
                                        data={this.state.artGallery}
                                        renderItem={this.renderArt}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        ListFooterComponent={this.footerView}
                                        onEndReached={this.getData}
                                        contentContainerStyle={{paddingBottom: 30}}
                                        extraData = {this.state}
                                    />
                                }
                                {!this.state.isList &&
                                    <FlatList
                                        data={this.state.artGallery}
                                        renderItem={this.renderArticleGrid}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={2}
                                        style={{ alignSelf: 'center' }}
                                        ListFooterComponent={this.footerView}
                                        onEndReached={this.getData}
                                        contentContainerStyle={{paddingBottom: 30}}
                                    />
                                }
                            </View>
                        </View>
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
                            <Image source={{ uri: this.state.intro.picture }} resizeMode="contain" style={styles.imageFull} />
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
    lang: state.programmes.lang
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: PRIMARY_COLOR,
    },
    itemContainer: {
        height: 85,
        width: '95%',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        flexDirection: 'row'
    },
    arrow: {
        height: '100%',
        width: width * .1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
    },
    imageStyle: {
        height: 60,
        width: 60,
        marginLeft: 10,
    },
    itemView: {
        height: '100%',
        width: '67%',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    header: {
        height: 40,
        alignItems: 'flex-end'
    },
    showItem: {
        width: '80%',
        justifyContent: 'center',
    },
    gridView: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
    imageStyleGrid: {
        height: 140,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    imageStyleGridView: {
        height: 140,
        width: '100%',
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: 185,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
    },
    itemViewGrid: {
        height: 45,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventTitleGrid: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_MULI_BOLD,
        paddingLeft: 5,
        paddingRight: 5
    },
    image: {
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
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
    articleContainer: {
        height: 190,
        width: width / 2.5,
        margin: 5,
        borderRadius: 10,
    },
    renderImageArtcle: {
        height: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: .5,
        shadowOpacity: 0.5,
        elevation: .5,
        borderRadius: 15,
    },
    renderImage1: {
        height: 150,
        width: '100%',
        alignSelf: "center",
        borderRadius: 15,
    },
    renderTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    activityIndicator:{
        justifyContent:'center',
        alignItems:'center',
        flex: height/2
    }
})
export default connect(mapStateToProps)(App)