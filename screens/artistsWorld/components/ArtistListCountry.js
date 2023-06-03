import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS_LIST } from '../../../common/endpoints'
import i18n from '../../../i18n'
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
            country: this.props.navigation.getParam('item', null),
            category: this.props.navigation.getParam('category', null),
            total: ''
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
        this.getData = this.getData.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
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
        Api('get', ARTISTS_LIST + `?countryId=${this.state.country.countryId}&categoryId=${this.state.category.categoryId}` + `&language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Artists...", responseJson)
                    this.setState({
                        artist: responseJson.items,
                        isLoading: false,
                        total: responseJson.total
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
    }

    searchItem(keyword) {
        console.log('keywwword', keyword)
        this.setState({ isSearchLoading: true, searchResult: [] })
        var language = this.props.lang == 'ar' ? 1 : 2
        // if (keyword != '' || keyword.length > 0) {
        let data = new FormData()
        data.append('searchtext', keyword)
        data.append('countryId', this.state.country.countryId)
        Api('post', ARTISTS_LIST + `?countryId=${this.state.country.countryId}&categoryId=${this.state.category.categoryId}` + `&language=${language}`, data)
            .then((response) => {
                console.log("response", response);
                if (response) {
                    this.setState({
                        artist: response.items, isSearchLoading: false, searchKeyword: keyword
                    })
                }
                else {
                    this.setState({
                        isSearchLoading: false, searchKeyword: keyword
                    })
                }
            })
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistWorldDetail", { item: item })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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
                                <View style={styles.country}>
                                    <Text numberOfLines={2} style={styles.countryText}>{this.state.country.title} ({this.state.total})</Text>
                                </View>
                            </View>
                        </View>
                        {this.state.artist != '' ?
                            <View>
                                <FlatList
                                    data={this.state.artist}
                                    renderItem={this.renderArtists}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                            :
                            <View>
                                <Text style={styles.notFound}>No data found !</Text>
                            </View>
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
        flexDirection: 'row'
    },
    searchTextContainer: {
        width: '62%',
        height: '100%',
    },
    searchIcon: {
        height: '100%',
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
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
        color: PRIMARY_COLOR
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
        marginLeft: 15,
    },
    notFound: {
        fontSize: 16,
        fontFamily: FONT_MULI_BOLD,
        color: SECONDARY_COLOR,
        alignSelf: 'center',
        marginTop: 20
    }
})
export default connect(mapStateToProps)(App)