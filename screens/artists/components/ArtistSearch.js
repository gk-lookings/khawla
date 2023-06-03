import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD, FONT_LIGHT } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS, ARTISTS_COUNTRY, ARTIST_CATEGORIES } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ModalDropdown from 'react-native-modal-dropdown'
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Modal from "react-native-modal"
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
            searchResult: [],
            searchKeyword: '',
            isSearchLoading: false,
            isList: true,
            page: 2,
            isLastPage: false,
            page1: 1,
            country: [],
            category: [],
            isVisible: false,
            catSelect: '',
            countrySelect: ''
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
        this.renderArtistGrid = this.renderArtistGrid.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
        this.renderItemSearchGrid = this.renderItemSearchGrid.bind(this)
        this.footerView = this.footerView.bind(this)
        this.loadData = this.loadData.bind(this)
        this.renderCategory = this.renderCategory.bind(this)
        this.isSelected = this.isSelected.bind(this)
        this.categoryHeader = this.categoryHeader.bind(this)
        this.renderCountry = this.renderCountry.bind(this)
        this.countryHeader = this.countryHeader.bind(this)
    }

    componentDidMount() {
        setTimeout(()=>{this.textInputRef.focus()},100)
                var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS_COUNTRY + `?language=${language}`)
            .then((response) => {
                console.log('testdatdatdat', response)
                if (response) {
                    this.setState({
                        country: response,
                        isLoading: false
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })
        Api('get', ARTIST_CATEGORIES + `?language=${language}`)
            .then((response) => {
                console.log('testdatdatdat', response)
                if (response) {
                    this.setState({
                        category: response,
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

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.setState({ page: 2 })
        }
    }

    loadData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        let data = new FormData()
        data.append('searchtext', this.state.searchKeyword)
        if (this.state.catSelect != "") {
            data.append('categoryId', this.state.catSelect.categoryId)
        }
        if (this.state.countrySelect != "") {
            data.append('countryId', this.state.countrySelect.countryId)
        }
        Api('post', ARTISTS + `?language=${language}&page=${page}`, data)
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

    searchItem(keyword) {
        console.log('keywwword       ;lkjkjkj', keyword)
        this.setState({ isSearchLoading: true, searchResult: [], })
        let page = this.state.page1
        var language = this.props.lang == 'ar' ? 1 : 2
        let data = new FormData()
        data.append('searchtext', keyword)
        if (this.state.catSelect != "") {
            data.append('categoryId', this.state.catSelect.categoryId)
        }
        if (this.state.countrySelect != "") {
            data.append('countryId', this.state.countrySelect.countryId)
        }
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


    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: item })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistDetail', { artists: item })} style={styles.itemContainerGrid}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistDetail', { artists: item })} style={styles.itemContainerGrid}>
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate("ArtistDetail", { artists: item })} style={[styles.mediaContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
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

    onSelect(value) {
        if (this.state.catSelect != null) {
            this.setState({ catSelect: value, }),
            this.searchItem(this.state.searchKeyword)
        }
    }
    isSelected(name) {
        let status = false
        if (this.state.catSelect.categoryId === name.categoryId)
            status = true
        return status
    }

    renderCategory({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onSelect(item)}>
                {!this.isSelected(item) ?
                    <View style={styles.category}>
                        <Text style={styles.categoryText}>{item.title}</Text>
                    </View> :
                    <View style={[styles.category, { borderColor: PRIMARY_COLOR }]}>
                        <Text style={styles.categoryText}>{item.title}</Text>
                    </View>
                }
            </TouchableOpacity>
        )
    }

    categoryHeader() {
        return (
            <TouchableOpacity onPress={() => this.setState({ catSelect: "" }, this.searchItem(this.state.searchKeyword))}>
                {this.state.catSelect != "" ?
                    <View style={[styles.category, { marginLeft: 20 }]}>
                        <Text style={styles.categoryText}>All</Text>
                    </View>
                    :
                    <View style={[styles.category, { marginLeft: 20, borderColor: PRIMARY_COLOR }]}>
                        <Text style={styles.categoryText}>All</Text>
                    </View>
                }
            </TouchableOpacity>

        )
    }


    renderButtonText(rowData) {
        return `${rowData.title}`;
    }

    renderCountry({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ countrySelect: item, isVisible: false }, this.searchItem(this.state.searchKeyword))} style={styles.country}>
                <Text style={styles.countryText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }
    countryHeader() {
        return (
            <TouchableOpacity onPress={() => this.setState({ countrySelect: "", isVisible: false }, this.searchItem(this.state.searchKeyword))} style={styles.country}>
                <Text style={[styles.countryText, { color: PRIMARY_COLOR }]}>All</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.mainContainer}>
                    <View style={styles.searchBox}>
                        <View style={styles.search}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.searchIcon}>
                                    <AntDesign name="search1" size={25} />
                                </View>
                                <View style={styles.searchTextContainer}>
                                    <TextInput
                                        ref={ref => this.textInputRef = ref}
                                        autoFocus={true}
                                        style={styles.textInput}
                                        placeholder={i18n.t('search')}
                                        placeholderTextColor={SECONDARY_COLOR}
                                        keyboardType="web-search"
                                        onChangeText={(text) => this.searchItem(text)}
                                    />
                                </View>
                            </View>
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
                            <FlatList
                                data={this.state.category}
                                renderItem={this.renderCategory}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                horizontal
                                style={{ marginTop: 10 }}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={this.categoryHeader}
                            />
                            <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={styles.dropStyles}>
                                {this.state.countrySelect == "" ? <Text>Country</Text> : <Text>{this.state.countrySelect.title}</Text>}
                                <AntDesign name="caretdown" size={13} color={SECONDARY_COLOR} />
                            </TouchableOpacity>
                            {this.state.isList &&
                                <FlatList
                                    data={this.state.artist}
                                    renderItem={this.renderArtists}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    // ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                    contentContainerStyle={{ paddingBottom: 150 }}
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
                                    // ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                    contentContainerStyle={{ paddingBottom: 150 }}
                                />
                            }
                            <Modal
                                isVisible={this.state.isVisible}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                hasBackdrop={true}
                                backdropColor='black'
                                backdropOpacity={.7}
                                onBackButtonPress={() => this.setState({ isVisible: false })}
                                onBackdropPress={() => this.setState({ isVisible: false })}
                                style={styles.modal}
                            >
                                <View style={styles.modalView}>
                                    <FlatList
                                        data={this.state.country}
                                        renderItem={this.renderCountry}
                                        keyExtractor={(item, index) => index.toString()}
                                        style={{ maxHeight: height / 1.8 }}
                                        ListHeaderComponent={this.countryHeader}
                                    />
                                </View>
                            </Modal>
                        </View>
                    }
                </View>
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
        justifyContent: 'space-between'
    },
    searchTextContainer: {
        width: '70%',
        height: '100%'
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
    category: {
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderColor: COLOR_SECONDARY,
        marginBottom: 10
    },
    categoryText: {
        fontSize: 12,
        fontFamily: FONT_LIGHT,
        paddingVertical: 2,
        paddingHorizontal: 10
    },
    modalDropContainer: {
        height: 35,
        paddingHorizontal: 15
    },
    dropText: {
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD
    },
    dropDown: {
        borderWidth: 1,
        marginTop: 5,
        alignSelf: 'center',
        width: 200
    },
    dropStyles1: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        height: '100%'
    },
    dropStyles: {
        height: 30,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        width: 200,
        alignSelf: 'center',
        borderRadius: 5,
        paddingHorizontal: 20,
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        width: width / 1.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center'
    },
    country: {
        width: width / 1.5,
        borderBottomWidth: .5,
        borderColor: COLOR_SECONDARY,
        paddingHorizontal: 20
    },
    countryText: {
        fontSize: 15,
        fontFamily: FONT_MULI_REGULAR
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
})
export default connect(mapStateToProps)(App)