import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const { height, width } = Dimensions.get('screen')
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
            artist: [],
            isLoading: true,
            searchResult: [],
            searchKeyword: '',
            isSearchLoading: false,
            isList: true,
            page: 2,
            isLastPage: false,
            page1: 1,
            eventData: this.props.navigation.getParam('item', null),
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
        this.renderArtistGrid = this.renderArtistGrid.bind(this)
        this.getData = this.getData.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
        this.renderItemSearchGrid = this.renderItemSearchGrid.bind(this)
        this.footerView = this.footerView.bind(this)
        this.loadData = this.loadData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
            this.setState({ page: 2 })
        }
    }

    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        var eventId = this.state.eventData.eventId
        Api('get', 'http://www.khawlafoundation.com/api/json_event_artists.php' + `?language=${language}&eventId=${eventId}&page=${1}`)
            .then((response) => {
                if (response) {
                    let res = response.items
                    console.log("Artists...", response)
                    this.setState({
                        artist: res,
                        isLoading: false,
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

    loadData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        var eventId = this.state.eventData.eventId
        Api('get', 'http://www.khawlafoundation.com/api/json_event_artists.php' + `?language=${language}&eventId=${eventId}&page=${page}`)
            .then((response) => {
                if (response) {
                    let res = response.items
                    console.log("Artists...", response)
                    this.setState({
                        artist: this.state.artist.concat(res),
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

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: item, eventData: this.state.eventData })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                <View style={{ height: '100%', width: '75%', justifyContent: 'center', paddingHorizontal: 10 }}>
                    <Text numberOfLines={1} style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artistTitle}</Text>
                    <Text numberOfLines={2} style={[styles.description, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <Image
                    source={{ uri: item.picture }}
                    style={styles.imageContainer}
                />
            </TouchableOpacity>
        )
    }

    renderArtistGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistDetail', { artists: item, eventData: this.state.eventData })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artistTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemSearchGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistDetail', { artists: item, eventData: this.state.eventData })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artistTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemSearch({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: item, eventData: this.state.eventData })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                <View style={{ height: '100%', width: width * .7, justifyContent: 'center', paddingRight: 10, paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artistTitle}</Text>
                    <Text numberOfLines={2} style={[styles.description, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <View style={{}}>
                    <Image
                        source={{ uri: item.picture }}
                        style={styles.imageContainer}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    renderFooter() {
        if (this.state.isSearchLoading)
            return (
                <View style={{ padding: 15 }}>
                    <ActivityIndicator size='large' color={PRIMARY_COLOR} />
                </View>
            )
        else if (this.state.searchKeyword == [])
            return (
                <Text style={{ padding: 15, fontSize: 18, fontFamily: FONT_PRIMARY, color: '#333333', textAlign: 'center' }}>{i18n.t("No_Results")}</Text>
            )
        else return null
    }

    searchItem(keyword) {
        console.log('keywwword', keyword)
        this.setState({ isSearchLoading: true, searchResult: [], })
        let page = this.state.page1
        var language = this.props.lang == 'ar' ? 1 : 2
        // if (keyword != '' || keyword.length > 0) {
        let data = new FormData()
        data.append('searchtext', keyword)
        Api('post', ARTISTS + `?language=${language}&page=${page}`, data)
            .then((response) => {
                console.log("response", response);
                if (response) {
                    this.setState({
                        artist: response.items,
                        isSearchLoading: false,
                        searchKeyword: keyword,
                        page: this.state.page1 + 1,
                        isLastPage: response.isLastPage ? true : false,
                    })
                }
                else {
                    this.setState({
                        isSearchLoading: false, searchKeyword: keyword
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

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <View style={styles.mainContainer}>
                        <View style={styles.searchBox}>
                            <View style={styles.search}>
                                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistSearch')} style={{ flexDirection: 'row' }}>
                                    <View style={styles.searchIcon}>
                                        <AntDesign name="search1" size={25} />
                                    </View>
                                    <View style={styles.searchTextContainer}>
                                        <Text>{i18n.t('search')}</Text>
                                    </View>
                                </TouchableOpacity> */}
                                <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                    {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.isSearchLoading ?
                            <View style={styles.loading}>
                                <ActivityIndicator size="small" color={PRIMARY_COLOR} style={{ marginTop: 50 }} />
                            </View>
                            :
                            <View>
                                {this.state.isList &&
                                    <FlatList
                                        data={this.state.artist}
                                        renderItem={this.renderArtists}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        ListFooterComponent={this.footerView}
                                        onEndReached={this.loadData}
                                        contentContainerStyle={{ paddingBottom: 70 }}
                                    />
                                }
                                {!this.state.isList &&
                                    <FlatList
                                        data={this.state.artist}
                                        renderItem={this.renderArtistGrid}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={2}
                                        style={{ marginTop: 10 }}
                                        ListFooterComponent={this.footerView}
                                        onEndReached={this.loadData}
                                        contentContainerStyle={{ paddingBottom: 70 }}
                                    />
                                }
                            </View>
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
    title: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
    },
    mediaText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    imageContainer: {
        width: 65,
        height: 65,
        borderRadius: 40,
        marginRight: 10
    },
    mediaContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        width: width - 40,
        height: 90,
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
    searchBox: {
        height: 45,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
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
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    searchTextContainer: {
        width: '70%',
        height: '100%',
        justifyContent: 'center'
    },
    searchIcon: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    },
    textInput: {
        height: '100%',
        width: '100%',
        paddingRight: 10,
        fontFamily: FONT_MULI_REGULAR
    },
    showItem: {
        width: '80%',
        justifyContent: 'center',
        height: 30
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
    itemContainerGrid: {
        height: width / 2.5,
        width: width / 2 - 30,
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 20,
        marginBottom: 30,
    },
    imageStyleGridView: {
        height: width / 3,
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
        height: 35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyleGrid: {
        height: width / 3,
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
    gridView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
})
export default connect(mapStateToProps)(App)