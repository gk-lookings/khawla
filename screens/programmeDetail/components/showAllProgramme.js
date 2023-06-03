import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD, } from '../../../assets/fonts'
import Api from '../../../common/api'
import i18n from '../../../i18n'
import { ARTICLE_HOME } from '../../../common/endpoints'
import AutoHeightWebView from 'react-native-autoheight-webview'

const { height, width } = Dimensions.get('screen')
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
            article: [],
            isLoading: true,
            articleIntro: '',
            isList: false,
            page: 2,
            isLastPage: false,
            programmes: this.props.navigation.getParam('data', null),
            total:''
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
        this.getData = this.getData.bind(this)
        this.getArticles = this.getArticles.bind(this)
        this.footerView = this.footerView.bind(this)
        this.loadData = this.loadData.bind(this)
        console.log('programmmee   iiiiidi', this.state.programmes)
    }

    componentDidMount() {
        this.getData()
        this.getArticles()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
            this.getArticles()
            this.setState({page: 2})
        }
    }

    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
    }

    getArticles(){
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&page=${1}&programmeId=${this.state.programmes.programmeId}`)
            .then((responseJson) => {
                if (responseJson) {
                    let res = responseJson.items
                    this.setState({
                        article: res,
                        isLoading: false,
                        isLastPage: responseJson.isLastPage ? true : false,
                        total: responseJson.total
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        isLastPage: true
                    })
                }
            })
    }



    loadData(){
        var language = this.props.lang == 'ar' ? 1 : 2
        let page= this.state.page
        Api('get', "https://www.khawlafoundation.com/api/json_articles?" + `language=${language}&page=${page}&programmeId=${this.state.programmes.programmeId}`)
            .then((responseJson) => {
                if (responseJson) {
                    let res = responseJson.items
                    this.setState({
                        article: this.state.article.concat(res),
                        isLoading: false,
                        page: this.state.page + 1,
                        isLastPage: responseJson.isLastPage ? true : false,
                    })
                }
                else {
                    this.setState({
                        isLoading: false,
                        isLastPage: true
                    })
                }
            })
    }

    onPress() {
        this.props.navigation.navigate('Home')
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

    renderArticle({ item }) {
        var data = item.articleDescription
        var newDescription = data.split('<br>').join('\n')
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LatestFeedsDetail', { item: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.arrow}>
                    {/* {this.props.lang == 'ar' ?
                        <IconMaterial name='keyboard-arrow-left' size={28} color={'#999999'} />
                        :
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    } */}
                </View>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleTitle}</Text>
                    <Text style={[styles.subItem, { fontWeight: '600' }, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleDisplayDate}</Text>
                    {/* <Text numberOfLines={1} style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{newDescription}</Text> */}
                </View>
                <Image source={{ uri: item.articlePicture }} style={styles.imageStyle} />
            </TouchableOpacity>
        )
    }

    renderArticleGrid({ item }) {
        var data = item.articleDescription
        var newDescription = data.split('<br>').join('\n')
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LatestFeedsDetail', { item: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.articlePicture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.articleTitle}</Text>
                    <Text style={[styles.subItemGrid, { fontWeight: '600' }]}>{item.articleDisplayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
            {this.state.isLoading ?
                <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <View style={styles.showItem}>
                            <Text style={styles.showingText}>( {this.state.total} )</Text>
                        </View>
                        <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                            {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                        </TouchableOpacity>
                    </View>
                        {this.state.isList &&
                            <FlatList
                                data={this.state.article}
                                renderItem={this.renderArticle}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                onEndReached={this.loadData}
                                ListFooterComponent={this.footerView}
                            />
                        }
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.article}
                                renderItem={this.renderArticleGrid}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                                onEndReached={this.loadData}
                                ListFooterComponent={this.footerView}
                            />
                        }
                </View>
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
        width: width * .92,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: width/1.9,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
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
        color: COLOR_SECONDARY
    },
    imageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    imageStyleGrid: {
        height: width/2.5,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    imageStyleGridView: {
        height: width/2.5,
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
        width: '72%',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
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
        justifyContent:'space-between'
    },
    showItem: {
        justifyContent: 'center',
    },
    gridView: {
        justifyContent: 'center',
        alignItems: 'center'
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
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 1
    },
})
export default connect(mapStateToProps)(App)