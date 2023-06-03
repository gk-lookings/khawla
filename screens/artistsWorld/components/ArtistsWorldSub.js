import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS_SUB_CAT } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
            isList: false,
            category: this.props.navigation.getParam('item', null)
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
        this.renderArtistGrid = this.renderArtistGrid.bind(this)
        this.getData = this.getData.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
        this.renderItemSearchGrid = this.renderItemSearchGrid.bind(this)
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
        Api('get', ARTISTS_SUB_CAT + `?categoryId=${this.state.category.categoryId}` + `&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Artists...", responseJson)
                    this.setState({
                        artist: responseJson.items,
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

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistListSub", { item: item, cat:this.state.category.categoryId })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                <View style={{ height: '100%', width: width * .7, justifyContent: 'center', paddingRight: 10, paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
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

    renderArtistGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistListSub', { item: item, cat: this.state.category.categoryId })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemSearchGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistListSub', { item: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemSearch({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistListSub", { item: item })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
                <View style={{ height: '100%', width: width * .7, justifyContent: 'center', paddingRight: 10, paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={[styles.title, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
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
        this.setState({ isSearchLoading: true, searchResult: [] })
        var language = this.props.lang == 'ar' ? 1 : 2
        // if (keyword != '' || keyword.length > 0) {
        let data = new FormData()
        data.append('searchtext', keyword)
        Api('post', ARTISTS_SUB_CAT+ `?categoryId=${this.state.category.categoryId}` + `&language=${language}`, data)
            .then((response) => {
                console.log("response", response);
                if (response) {
                    this.setState({
                        searchResult: response, isSearchLoading: false, searchKeyword: keyword
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
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView style={styles.mainContainer}>
                        <View style={styles.header}>
                            <View style={styles.showItem}>
                                <Text style={styles.showingText}>( {this.state.artist.length} )</Text>
                            </View>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
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
        width: '73%',
        height: '100%'
    },
    searchIcon: {
        height: '100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
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
        height: 190,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        marginLeft: width * .033,
        marginBottom: 30,
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
    imageStyleGridView: {
        height: 150,
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
    },
    itemViewGrid: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyleGrid: {
        height: 150,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 10
    },
    eventTitleGrid: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_MULI_BOLD,
        paddingLeft: 5,
        paddingRight: 5
    },
    header: {
        height: 40,
        flexDirection: 'row'
    },
    showItem: {
        width: '80%',
        justifyContent: 'center',
    },
    gridView: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
})
export default connect(mapStateToProps)(App)