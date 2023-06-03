import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { COLLECTION, STATIC_PAGE } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AutoHeightWebView from 'react-native-autoheight-webview'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Collection")}</Text>
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
            collection: [],
            isLoading: true,
            isList: true,
            page: 2,
            isLastPage: false,
            total: ''
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.getData = this.getData.bind(this)
        this.renderCollectionGrid = this.renderCollectionGrid.bind(this)
        this.loadData = this.loadData.bind(this)
        this.footerView = this.footerView.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
            this.setState({page: 2})
        }
    }

    getData() {

        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', COLLECTION + `language=${language}&page=${1}`)
            .then((responseJson) => {
                let res = responseJson.items
                if (responseJson) {
                    this.setState({
                        collection: res,
                        isLoading: false,
                        collectionIntro: '',
                        isLastPage: responseJson.isLastPage ? true : false,
                        total:responseJson.total
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
            

        Api('get', STATIC_PAGE + `?pageId=7&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("collection introoo", responseJson)
                    this.setState({
                        collectionIntro: responseJson,
                    })
                }
            })
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


    loadData() {

        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        Api('get', COLLECTION + `language=${language}&page=${page}`)
            .then((responseJson) => {
                let res = responseJson.items
                if (responseJson) {
                    this.setState({
                        collection: this.state.collection.concat(res),
                        isLoading: false,
                        collectionIntro: '',
                        isLastPage: responseJson.isLastPage ? true : false,
                        page: this.state.page + 1,
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

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CollectionDetail', { item: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artifactTitle}</Text>
                    <Text style={[styles.subItem, { fontWeight: '600' }, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artifactDisplayDate}</Text>
                    <Text numberOfLines={1} style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <View style={styles.imageView}>
                <Image source={{ uri: item.artifactPicture }} style={styles.imageStyle} />
                </View>
            </TouchableOpacity>
        )
    }

    renderCollectionGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CollectionDetail', { item: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.artifactPicture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artifactTitle}</Text>
                    <Text style={styles.subItemGrid}>{item.artifactDisplayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <View style={styles.mainContainer}>
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
                                data={this.state.collection}
                                renderItem={this.renderArticle}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 300 }}
                            />
                        }
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.collection}
                                renderItem={this.renderCollectionGrid}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                            />
                        }
                    </View>
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
        backgroundColor: '#fff'
    },
    itemContainer: {
        height: 90,
        flexDirection: 'row',
        width: width -40,
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
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
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'right',
        color: COLOR_SECONDARY,
        lineHeight: 20
    },
    imageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    imageView: {
        height: '100%',
        width: '25%',
        justifyContent: 'center',
    },
    itemView: {
        height: '100%',
        width: '75%',
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
        flexDirection: 'row',
        width: width - 40,
        alignSelf: 'center',
        justifyContent: 'space-between'
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
    itemContainerGrid: {
        height: 185,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: width * .033,
        marginBottom: 30,
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
    itemViewGrid: {
        height: 55,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyleGrid: {
        height: 150,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
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
        lineHeight: 16
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