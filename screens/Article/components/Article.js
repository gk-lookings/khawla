import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, TextInput, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD, } from '../../../assets/fonts'
import Api from '../../../common/api'
import i18n from '../../../i18n'
import { ARTICLE, SEARCH, STATIC_PAGE } from '../../../common/endpoints'
import AutoHeightWebView from 'react-native-autoheight-webview'
import Modal from "react-native-modal"

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Article")}</Text>
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
                <TouchableOpacity onPress={navigation.getParam('onPress')} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <AntDesign name='closecircleo' size={20} color={'#000'} style={{}} />
                </TouchableOpacity>),
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <IconMaterial name='sort' size={30} color='black' />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            article: [],
            isLoading: true,
            articleIntro: '',
            isList: false,
            isVisibleInfo: false,
            searchResult: [],
            searchKeyword: '',
            isSearchLoading: false,
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
        this.getData = this.getData.bind(this)
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
        Api('get', ARTICLE + `language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Article/////", responseJson)
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

        Api('get', STATIC_PAGE + `?pageId=6&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Article introoo", responseJson)
                    this.setState({
                        articleIntro: responseJson,
                    })
                }
            })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderArticle({ item }) {
        var data = item.articleDescription
        var newDescription = data.split('<br>').join('\n')
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArticleDetail', { item: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleTitle}</Text>
                    <Text style={[styles.subItem, { fontWeight: '600' }, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleDisplayDate}</Text>
                </View>
                <View style={[styles.imageView ,this.props.lang == 'ar' && { paddingLeft: 20}]}>
                <Image source={{ uri: item.articlePicture }} style={styles.imageStyle} />
                </View>
            </TouchableOpacity>
        )
    }

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArticleDetail', { item: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.articlePicture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.articleTitle}</Text>
                    <Text style={styles.subItemGrid}>{item.articleDisplayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR}/>
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={styles.header}>
                                <Text style={styles.showingText}>( {this.state.article.length} )</Text>
                                <View style={{flexDirection:'row'}}>
                            {this.state.articleIntro.description != null &&
                                <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isVisibleInfo: true })}>
                                    <Feather name="info" size={23} />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView>
                            {this.state.isList &&
                                <FlatList
                                    data={this.state.article}
                                    renderItem={this.renderArticle}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            }
                            {!this.state.isList &&
                                <FlatList
                                    data={this.state.article}
                                    renderItem={this.renderArticleGrid}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                />
                            }
                        </ScrollView>
                        <Modal
                            isVisible={this.state.isVisibleInfo}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            useNativeDriver={true}
                            hideModalContentWhileAnimating={true}
                            animationOutTiming={300}
                            onBackButtonPress={() => this.setState({ isVisibleInfo: false })}
                            onBackdropPress={() => this.setState({ isVisibleInfo: false })}
                            style={styles.modal}>
                            <View style={styles.modalContainer}>
                                <View style={styles.filterContainer}>
                                    <View style={styles.filterTextBox}>
                                    </View>
                                    <TouchableOpacity onPress={() => this.setState({ isVisibleInfo: false })} style={styles.iconContainer}>
                                        <AntDesign name="close" size={22} color="#000" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
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
                                        source={{ html: this.state.articleIntro.description }}
                                        scalesPageToFit={true}
                                        viewportContent={'width=device-width, user-scalable=yes'}
                                    />
                                </ScrollView>
                            </View>
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
    Description: {
        fontSize: 16,
        textAlign: 'right',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        paddingBottom: 10
    },
    itemContainer: {
        height: 95,
        flexDirection: 'row',
        width: width -40,
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: 185,
        width: width / 2 - 30,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 20,
        marginBottom: 30,
    },
    arrow: {
        height: '100%',
        width: width * .08,
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
    subItem: {
        fontSize: 13,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'right',
        color: COLOR_SECONDARY
    },
    eventTitleGrid: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_MULI_BOLD,
        paddingLeft: 5,
        paddingRight: 5
    },
    subItemGrid: {
        fontSize: 11,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'center',
        color: COLOR_SECONDARY,
        lineHeight: 20
    },
    imageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10,
    },
    imageStyleGrid: {
        height: 150,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    imageStyleGridView: {
        height: 150,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    itemView: {
        height: '100%',
        width: '75%',
        justifyContent: 'center',
    },
    imageView: {
        height: '100%',
        width: '25%',
        justifyContent: 'center', 
        paddingRight: 20,
    },
    itemViewGrid: {
        height: 55,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 40,
        flexDirection: 'row',
        width: width-40,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'space-between'
    },
    showItem: {
        width: '79%',
        justifyContent: 'center',
    },
    gridView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
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
    searchBox: {
        height: 45,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    search: {
        height: 43,
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        flexDirection: 'row'
    },
    searchTextContainer: {
        width: '63%',
        height: '100%'
    },
    searchIcon: {
        height: '100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        height: '100%',
        width: '100%',
        paddingRight: 10,
        fontFamily: FONT_MULI_REGULAR
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        height: height - 100,
        padding: 10,
        paddingTop: 0
    },
    filterContainer: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        marginTop: 5
    },
    filterTextBox: {
        width: '90%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContainer: {
        width: '10%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: '#fff',
    },
    loader:{
        flex: 2,
        justifyContent:'center',
        alignItems:'center'
    }
})
export default connect(mapStateToProps)(App)