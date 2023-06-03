import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import i18n from '../../../i18n'
import Modal from "react-native-modal"
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ARTICLE, PROGRAMMES } from '../../../common/endpoints'
import Api from '../../../common/api'
import AutoHeightWebView from 'react-native-autoheight-webview'

const { height, width } = Dimensions.get('screen')

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
            programmes: this.props.navigation.getParam('data', null),
            eventDetails: [],
            isLoading: true,
            loading: true,
            isVisibleImage: false,
            article: [],
            child: ''
        }
        this.onPress = this.onPress.bind(this);
        this.renderArticles = this.renderArticles.bind(this);
        this.renderProgrammes = this.renderProgrammes.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&programmeId=${this.state.programmes.programmeId}`)
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
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', PROGRAMMES + `language=${language}&programmeId=${this.state.programmes.programmeId}`)
            .then((responseJson) => {
                console.log('chilllllllllllllldddddddddddd', responseJson[0])
                if (responseJson) {
                    this.setState({
                        child: responseJson[0],
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

    renderProgrammes({ item }) {
        return (
            <TouchableOpacity style={styles.prgrmContainer} onPress={() => this.props.navigation.navigate('secondChildProgrammes', { data: item })}>
                <View style={styles.renderimageContain}>
                    <Image source={{ uri: item.eventCover }} style={styles.renderImage} resizeMode="contain" />
                </View>
                <View style={styles.renderTitle}>
                    <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const programmes = this.state.child
        return (
            <SafeAreaView style={styles.mainContainer}>
                <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.imageContainer} onPress={() => this.setState({ isVisibleImage: true })}>
                        <Image source={{ uri: programmes.eventCover }} style={styles.image} resizeMode="contain" />
                    </TouchableOpacity>
                    <Text style={[styles.titleEvent, this.props.lang == 'ar' && { textAlign: 'right', fontSize: 22 }]}>{programmes.title}</Text>
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
                        source={{ html: programmes.description}}
                        scalesPageToFit={true}
                        viewportContent={'width=device-width, user-scalable=yes'}
                    />
                    {this.state.child.children != '' &&
                        <View style={{ marginTop: 10 }}>
                            <FlatList
                                data={this.state.child.children}
                                ItemSeparatorComponent={this.renderHeader}
                                renderItem={this.renderProgrammes}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                            />
                        </View>
                    }
                    {this.state.article != '' &&
                        <View style={{ marginTop: 30 }}>
                            <FlatList
                                data={this.state.article}
                                ItemSeparatorComponent={this.renderHeader}
                                renderItem={this.renderArticles}
                                keyExtractor={(item, index) => index.toString()}
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: 10, marginLeft: 5 }}
                                horizontal={true}
                            />
                        </View>
                    }
                </ScrollView>
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
        fontSize: 18,
        textAlign: 'right',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_PRIMARY,
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
    titleText: {
        fontFamily: FONT_MULI_BOLD,
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
    prgrmContainer: {
        height: 185,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    renderimageContain: {
        height: 140,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15,
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
    renderTitle: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        textAlign: 'justify',
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: FONT_MULI_REGULAR,
        marginTop: 10
    },
})
export default connect(mapStateToProps)(App)