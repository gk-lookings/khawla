import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput, Platform } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS_TREE, ARTISTS_LIST } from '../../../common/endpoints'
import i18n from '../../../i18n'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import Foundation from 'react-native-vector-icons/Foundation'
const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text numberOfLines={1} style={styles.mediaText}>{i18n.t("artists_World")}</Text>
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
            sub: this.props.navigation.getParam('item', null),
            cat: this.props.navigation.getParam('cat', null),
            page: 1,
            isLastPage: true,
            isList: true
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
        this.getData = this.getData.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
        this.footerView = this.footerView.bind(this)
        this.renderArtistGrid = this.renderArtistGrid.bind(this)
        this.renderItemSearchGrid = this.renderItemSearchGrid.bind(this)
        console.log('sub.....',this.state.sub)
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }

    getData() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        Api('get', ARTISTS_LIST + `?subcategoryId=${this.state.sub.subcategoryId}&categoryId=${this.state.cat}` + `&language=${language}&page=${page}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Artists...", responseJson)
                    let res = responseJson.items
                    this.setState({
                        artist: this.state.artist.concat(res),
                        page: this.state.page + 1,
                        isLastPage: responseJson.isLastPage ? false : true,
                        isLoading: false
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

    renderArtistGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item, country: this.state.country })} style={styles.itemContainerGrid}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item, country: this.state.country })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artistTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item, country: this.state.country })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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

    renderItemSearch({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item, country: this.state.country })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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

    searchItem(keyword) {
        console.log('keywwword', keyword)
        this.setState({ isSearchLoading: true, searchResult: [] })
        var language = this.props.lang == 'ar' ? 1 : 2
        // if (keyword != '' || keyword.length > 0) {
        let data = new FormData()
        data.append('searchtext', keyword)
        Api('post', ARTISTS_LIST + `?subcategoryId=${this.state.sub.subcategoryId}&categoryId=${this.state.cat}` + `&language=${language}`, data)
            .then((response) => {
                console.log("response", response);
                if (response) {
                    let res = responseJson.items
                    this.setState({
                        searchResult: response, 
                        isSearchLoading: false, 
                        searchKeyword: keyword,
                        artist: this.state.artist.concat(res),
                        page: this.state.page + 1,
                        isLastPage: responseJson.isLastPage ? false : true,
                    })
                }
                else {
                    this.setState({
                        isSearchLoading: false, searchKeyword: keyword
                    })
                }
            })
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                        <ScrollView style={styles.mainContainer}>
                            <View style={styles.searchBox}>
                                <View style={styles.search}>
                                    <View style={styles.searchIcon}>
                                        <AntDesign name="search1" size={25} />
                                    </View>
                                    <View style={styles.searchTextContainer}>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder={i18n.t('search')}
                                            placeholderTextColor={SECONDARY_COLOR}
                                            keyboardType="web-search"
                                            onChangeText={(text) => this.searchItem(text)}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.header}>
                                    <Text numberOfLines={2} style={styles.countryText}>({this.state.artist.length})</Text>
                                <View style={styles.iconHead}>
                                    <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                        {!this.state.isList ? <Feather name="list" size={25} /> : <Icon name="view-grid" size={23} />}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {this.state.searchResult.length == 0 && this.state.searchKeyword == [] &&
                                <View>
                                    {this.state.isList &&
                                        <FlatList
                                            data={this.state.artist}
                                            renderItem={this.renderArtists}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
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
                                        />
                                    }
                                </View>
                            }
                            {this.state.searchResult.length != 0 && this.state.isList &&
                                <FlatList
                                    data={this.state.searchResult}
                                    renderItem={this.renderItemSearch}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    extraData={this.state}
                                    numColumns={2}
                                />
                            }
                            {this.state.searchResult.length != 0 && !this.state.isList &&
                                <FlatList
                                    data={this.state.searchResult}
                                    renderItem={this.renderItemSearchGrid}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    extraData={this.state}
                                    numColumns={2}
                                />
                            }
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
        borderRadius: 35,
        marginRight: 10
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
    searchBox: {
        height: 45,
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
        flexDirection: 'row'
    },
    searchTextContainer: {
        width: '62%',
        height: '100%',
    },
    searchIcon: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20
    },
    country: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countryIcon: {
        height: '100%',
        width: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    countryImage: {
        height: 15,
        width: 15,
        borderRadius: 8,
    },
    countryText: {
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR,
        color: PRIMARY_COLOR,
    },
    textInput: {
        height: '100%',
        width: '100%',
        paddingRight: 10,
        fontFamily: FONT_MULI_REGULAR
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15,
    },
    header: {
        height: 40,
        flexDirection: 'row',
        width: width-40,
        alignSelf:'center',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    showItem: {
        width: '65%',
        justifyContent: 'center',
        marginLeft: 20
    },
    gridView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
    iconHead: {
        flexDirection: 'row'
    },
    itemContainerGrid: {
        height: height/4,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: width * .033,
        marginBottom: 30,
    },
    imageStyleGridView: {
        height: height/5,
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
        height: height/5,
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
})
export default connect(mapStateToProps)(App)