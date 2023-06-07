import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Dimensions, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_MEDIUM } from '../../../assets/fonts'
import Api from '../../../common/api'
import { LIBRARY_LIST, LIBRARY_CATEGORY, LIBRARY_LANGUAGE, STATIC_PAGE } from '../../../common/endpoints'
import Modal from "react-native-modal"
import i18n from '../../../i18n'
import AutoHeightWebView from 'react-native-autoheight-webview'
const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Library")}</Text>
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
                    <Entypo name='info-with-circle' size={23} color={PRIMARY_COLOR} />
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
            library: '',
            libraryList: [],
            isVisible: false,
            item: '',
            isLoading: true,
            category: [],
            isVisibleFilter: false,
            filterItem: null,
            filterItem1: null,
            searchResult: [],
            searchKeyword: '',
            isSearchLoading: false,
            language: '',
            isList: false,
            isSearch: false,
            isVisibleInfo: false,
            languageFilter: [],
            item1: '',
            isSelect: false,
            page: 1,
            isLastPage: true
        }
        this.onPress = this.onPress.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.libraryView = this.libraryView.bind(this)
        this.renderItemCategory = this.renderItemCategory.bind(this)
        this.renderItemLanguage = this.renderItemLanguage.bind(this)
        this.renderFirst = this.renderFirst.bind(this)
        this.renderFirst1 = this.renderFirst1.bind(this)
        this.searchItem = this.searchItem.bind(this)
        this.renderItemSearch = this.renderItemSearch.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.searchView = this.searchView.bind(this)
        this.getData = this.getData.bind(this)
        this.renderItemList = this.renderItemList.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.onSelect2 = this.onSelect2.bind(this)
        this.footerView = this.footerView.bind(this)
        this.getList = this.getList.bind(this)
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
        Api('get', STATIC_PAGE + `?pageId=4&language=${language}`)
            .then((response) => {
                if (response) {
                    this.setState({
                        library: response,
                    })
                }
            })
        this.getList()

        Api('get', LIBRARY_CATEGORY + `language=${language}`)
            .then((response) => {
                if (response) {
                    console.log('librartyyy category.', response)
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



        Api('get', LIBRARY_LANGUAGE + `?language=${language}`)
            .then((response) => {
                if (response) {
                    console.log('librartyyy laaanguaage.', response)
                    this.setState({
                        languageFilter: response,
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

    getList() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        Api('get', LIBRARY_LIST + `language=${language}&page=${page}`)
            .then((response) => {
                if (response) {
                    console.log('librartyyylistt..', response)
                    let res = response.items
                    this.setState({
                        libraryList: this.state.libraryList.concat(res),
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
        this.setState({ isVisibleInfo: true })
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

    renderHeader() {
        return (
            <View style={styles.seprator}>

            </View>
        )
    }


    renderItem({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: true, item: item })} style={styles.bookContainer}>
                <View style={{ margin: 4 }}>
                    <Image
                        resizeMethod="resize"
                        resizeMode="stretch"
                        source={{ uri: item.bookPicture }}
                        style={{ height: '80%', width: '100%' }}
                    />
                    <View style={styles.bookTitleContainer}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                        <Text style={styles.booksAuthor} numberOfLines={1}>{item.authorName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemList({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: true, item: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.bookTitle}</Text>
                    <Text style={[styles.subItem, { fontWeight: '600' }, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.authorName}</Text>
                    <Text numberOfLines={1} style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.bookDescription}</Text>
                </View>
                <View style={styles.imageView}>
                <Image source={{ uri: item.bookPicture }} style={styles.imageStyle} />
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

    libraryFilter() {
        console.log('itttttttttttteeeeeeeeem', this.state.item, this.state.item1)
        var language = this.props.lang == 'ar' ? 1 : 2
        if (this.state.item.categoryId != undefined && this.state.item1.bookLanguageId != undefined) {
            Api('get', LIBRARY_LIST + `language=${language}` + `&categoryId=${this.state.item.categoryId}` + `&bookLanguageId=${this.state.item1.bookLanguageId}`)
                .then((response) => {
                    if (response) {
                        console.log('librartyyylistt.filter.', response)
                        this.setState({
                            filterItem: response.items,
                        })
                    }
                })

        } else if (this.state.item.categoryId != undefined && this.state.item.bookLanguageId == undefined) {
            Api('get', LIBRARY_LIST + `language=${language}` + `&categoryId=${this.state.item.categoryId}`)
                .then((response) => {
                    if (response) {
                        console.log('librartyyylistt.filter.categoryyyyy', response)
                        this.setState({
                            filterItem: response.items,
                        })
                    }
                })
        }
        else if (this.state.item1.bookLanguageId != undefined && this.state.item.categoryId == undefined) {
            Api('get', LIBRARY_LIST + `language=${language}` + `&bookLanguageId=${this.state.item1.bookLanguageId}`)
                .then((response) => {
                    if (response) {
                        console.log('librartyyylistt.filter.booookllllllanfgggu', response)
                        this.setState({
                            filterItem: response.items,
                        })
                    }
                })
        }
    }

    onSelect(value) {
        if (this.state.item != null) {
            this.setState({ item: value, filterItem: 'data' })
        }
    }

    onSelect2(value) {
        if (this.state.item1 != null) {
            this.setState({ item1: value, filterItem1: 'item' })
        }
    }

    isSelected(name) {
        let status = false
        if (this.state.item.title === name.title)
            status = true
        return status
    }

    isSelected2(name) {
        let status = false
        if (this.state.item1.title === name.title)
            status = true
        return status
    }

    renderItemCategory({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onSelect(item)} style={styles.categoryList}>
                {this.isSelected(item) ?
                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} />
                    :
                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} />
                }
                <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
        );
    }
    renderItemLanguage({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onSelect2(item)} style={styles.categoryList}>
                {this.isSelected2(item) ?
                    <IconMaterial name="radio-button-checked" size={19} color={PRIMARY_COLOR} />
                    :
                    <IconMaterial name="radio-button-unchecked" size={19} color={PRIMARY_COLOR} />
                }
                <Text style={styles.categoryText}>{item.title}</Text>
            </TouchableOpacity>
        );
    }

    libraryView() {
        return (
            <View>
                {this.state.libraryList.length != 0 ?
                    <View>
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.libraryList}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                style={{}}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.getList}
                                contentContainerStyle={{paddingBottom: 30}}
                            />
                        }
                        {this.state.isList &&
                            <FlatList
                                data={this.state.libraryList}
                                renderItem={this.renderItemList}
                                keyExtractor={(item, index) => index.toString()}
                                style={{}}
                                ListFooterComponent={this.footerView}
                                contentContainerStyle={{paddingBottom: 30}}
                            />
                        }
                    </View>
                    :
                    <View style={styles.warning}>
                        <AntDesign name="frowno" size={30} color={COLOR_SECONDARY} />
                        <Text style={styles.warningText}>No data found !</Text>
                    </View>
                }
            </View>
        )
    }

    searchView() {
        return (
            <View>
                {this.state.searchResult.length != 0 ?
                    <View>
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.searchResult}
                                renderItem={this.renderItemSearch}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                // ListFooterComponent={this.renderFooter}
                                extraData={this.state}
                                numColumns={2}
                            />
                        }
                        {this.state.isList &&
                            <FlatList
                                data={this.state.searchResult}
                                renderItem={this.renderItemList}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                // ListFooterComponent={this.renderFooter}
                                extraData={this.state}
                            />
                        }
                    </View>
                    :
                    <View style={styles.warning}>
                        <AntDesign name="frowno" size={30} color={COLOR_SECONDARY} />
                        <Text style={styles.warningText}>No data found !</Text>
                    </View>
                }
            </View>
        )
    }

    libraryViewChanging() {
        return (
            <View>
                {this.state.filterItem.length != 0 ?
                    <View>
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.filterItem}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                            />
                        }
                        {this.state.isList &&
                            <FlatList
                                data={this.state.filterItem}
                                renderItem={this.renderItemList}
                                keyExtractor={(item, index) => index.toString()}
                                style={{ alignSelf: 'center' }}
                            />
                        }
                    </View>
                    :
                    <View style={styles.warning}>
                        <AntDesign name="frowno" size={30} color={COLOR_SECONDARY} />
                        <Text style={styles.warningText}>No data found !</Text>
                    </View>
                }
            </View>
        )
    }

    renderFirst() {
        return (
            <TouchableOpacity onPress={() => this.setState({ filterItem: null, item: '' })} style={styles.categoryList}>
                <IconMaterial name={this.state.filterItem == null ? "radio-button-checked" : "radio-button-unchecked"} size={19} color={PRIMARY_COLOR} />
                <Text style={styles.categoryText}>All</Text>
            </TouchableOpacity>
        )
    }

    renderFirst1() {
        return (
            <TouchableOpacity onPress={() => this.setState({ filterItem1: null, item1: '' })} style={styles.categoryList}>
                <IconMaterial name={this.state.filterItem1 == null ? "radio-button-checked" : "radio-button-unchecked"} size={19} color={PRIMARY_COLOR} />
                <Text style={styles.categoryText}>All</Text>
            </TouchableOpacity>
        )
    }

    searchItem(keyword) {
        console.log('keywwword', keyword)
        this.setState({ isSearchLoading: true, searchResult: [] })
        // if (keyword != '' || keyword.length > 0) {
        let data = new FormData()
        data.append('searchtext', keyword)
        Api('post', LIBRARY_LIST, data)
            .then((response) => {
                console.log("response serch result", response);
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
        // }
        // this.setState({
        //     isSearchLoading: false,
        // })
    }

    renderItemSearch({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: true, item: item })} style={styles.bookContainer}>
                <View style={{ margin: 4 }}>
                    <Image
                        resizeMethod="resize"
                        resizeMode="stretch"
                        source={{ uri: item.bookPicture }}
                        style={{ height: '80%', width: '100%' }}
                    />
                    <View style={styles.bookTitleContainer}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{item.bookTitle}</Text>
                        <Text style={styles.booksAuthor} numberOfLines={1}>{item.authorName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.ActivityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <SafeAreaView style={styles.mainContainer}>
                        <View style={styles.searchContainer}>
                            {this.state.filterItem != null ?
                                <View style={styles.searchBar}>
                                    <View style={styles.searchIcon}>
                                    </View>
                                </View>
                                :
                                <View style={styles.searchBar}>
                                    <View style={styles.searchIcon}>
                                        <AntDesign name="search1" size={20} />
                                    </View>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={i18n.t('search')}
                                        keyboardType="web-search"
                                        onChangeText={(text) => this.searchItem(text, this.setState({ isSearch: true }))}
                                    />
                                </View>
                            }
                            <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                <TouchableOpacity onPress={() => this.setState({ isList: !this.state.isList })} style={styles.filter}>
                                    {!this.state.isList ? <Feather name="list" size={22} /> : <Icon name="view-grid" size={22} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ isVisibleFilter: true })} style={styles.filter}>
                                    <FontAwesome name="filter" size={22} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <View>
                                {this.state.filterItem == null && this.state.searchResult.length == 0 && this.state.searchKeyword == [] &&
                                    this.libraryView()
                                }
                                {this.state.filterItem != null &&
                                    this.libraryViewChanging()
                                }
                                <KeyboardAvoidingView behavior="padding" enabled>
                                    {this.state.filterItem == null && this.state.isSearch &&
                                        this.searchView()
                                    }
                                </KeyboardAvoidingView>
                            </View>
                            <Modal
                                isVisible={this.state.isVisible}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                animationOutTiming={300}
                                onBackButtonPress={() => this.setState({ isVisible: false })}
                                onBackdropPress={() => this.setState({ isVisible: false })}
                                style={styles.modal}>
                                <View style={{ maxHeight: height - 200 }}>
                                    <View style={styles.modalContainer}>
                                        <ScrollView style={styles.modalHeader}>
                                            <Text style={styles.bookTitleModal}>{this.state.item.bookTitle}</Text>
                                            <Text style={styles.booksAuthorModal}>{this.state.item.authorName}</Text>
                                            <Text style={styles.booksDescription}>{this.state.item.bookDescription}</Text>
                                        </ScrollView>
                                        <View style={styles.modalFooter}>
                                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisible: false })}>
                                                <Text style={styles.cancel}>{i18n.t("CLOSE")}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.isVisibleFilter}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                animationOutTiming={300}
                                onBackButtonPress={() => this.setState({ isVisibleFilter: false })}
                                onBackdropPress={() => this.setState({ isVisibleFilter: false })}
                                style={styles.modal}>
                                <View style={styles.filterBox}>
                                    <ScrollView>
                                        <View style={styles.filterContainer}>
                                            <View style={styles.filterTextBox}>
                                                <Text style={styles.filterText}>Filter</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => this.setState({ isVisibleFilter: false })} style={styles.iconContainer}>
                                                <AntDesign name="close" size={22} color="#000" />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={styles.categoryTitle}> By category</Text>
                                            <FlatList
                                                data={this.state.category}
                                                renderItem={this.renderItemCategory}
                                                keyExtractor={(item, index) => index.toString()}
                                                ListHeaderComponent={this.renderFirst}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.categoryTitle}> By language</Text>
                                            <FlatList
                                                data={this.state.languageFilter}
                                                renderItem={this.renderItemLanguage}
                                                keyExtractor={(item, index) => index.toString()}
                                                ListHeaderComponent={this.renderFirst1}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => this.setState({ isVisibleFilter: false }, () => this.libraryFilter())} style={styles.submitBox}>
                                            <Text style={styles.submitText}>Submit</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </Modal>
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
                                <View style={styles.modalContainer2}>
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
                                            source={{ html: this.state.library.description }}
                                            scalesPageToFit={true}
                                            viewportContent={'width=device-width, user-scalable=yes'}
                                        />
                                    </ScrollView>
                                </View>
                            </Modal>
                        </View>
                    </SafeAreaView>
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
    content: {
        textAlign: 'right',
        fontSize: 17,
        fontFamily: FONT_PRIMARY,
    },
    container: {
        backgroundColor: '#fff',
    },
    bookTitle: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR
    },
    booksAuthor: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: FONT_MULI_REGULAR
    },
    bookContainer: {
        height: height / 3,
        width: width / 2 - 25,
        marginLeft: 15,
        alignSelf: 'center',
        marginTop: 5
    },
    bookTitleContainer: {
        backgroundColor: '#fff',
        height: '20%',
        padding: 2,
        justifyContent: 'center',
    },
    modalHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonCancel: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD'
    },
    button: {
        flex: 1,
        padding: 15,
        alignItems: 'center'
    },
    cancel: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontFamily: FONT_PRIMARY,
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    modalContainer2: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        height: height - 100,
        padding: 10,
        paddingTop: 0
    },
    bookTitleModal: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: FONT_MULI_BOLD,
        color: PRIMARY_COLOR
    },
    booksAuthorModal: {
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: FONT_MULI_REGULAR,
        color: 'grey'
    },
    booksDescription: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_MULI_REGULAR,
    },
    ActivityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    searchContainer: {
        height: 45,
        width: width,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
        justifyContent: 'space-between'

    },
    searchBar: {
        width: '78%',
        height: 45,
        flexDirection: 'row',
    },
    filter: {
        marginLeft: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: {
        fontSize: 18,
        fontFamily: FONT_MULI_BOLD,
    },
    searchIcon: {
        height: '100%',
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryList: {
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'row',
        marginLeft: 25,
        alignItems: 'center'
    },
    categoryText: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: FONT_MULI_REGULAR,
        alignSelf: 'center',
        color: SECONDARY_COLOR,
        marginLeft: 5
    },
    seprator: {
        height: 1,
        width: '100%',
        backgroundColor: 'grey',
        alignSelf: 'center'
    },
    textInput: {
        width: '82%',
        height: 45,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: FONT_MULI_BOLD,
    },
    filterBox: {
        width: '100%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 10
    },
    latest: {
        marginLeft: 15,
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        marginTop: 5
    },
    warning: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height / 1.5,
    },
    warningText: {
        color: COLOR_SECONDARY
    },
    itemContainer: {
        height: 95,
        flexDirection: 'row',
        width: width -40,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: 5
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
    imageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    itemView: {
        height: '100%',
        width: '80%',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    imageView: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        marginTop: 5
    },
    filterContainer: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        marginTop: 5,
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
    categoryTitle: {
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD,
        padding: 5,
        color: SECONDARY_COLOR
    },
    submitBox: {
        height: 45,
        width: '92%',
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 5
    },
    submitText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: FONT_MULI_BOLD
    },
    WebView: {
        width: '95%',
        marginTop: 10,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
})
export default connect(mapStateToProps)(App)