import React, { Component } from 'react'
import { StatusBar, StyleSheet, View, TouchableOpacity, Text, FlatList, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR_SECONDARY, NAV_COLOR, COLOR_PRIMARY, BORDER_COLOR, DRAWER_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_MULI_BOLD, FONT_PRIMARY, FONT_SECONDARY } from '../../../assets/fonts'
import { resetOffersList, getProduct, sortOffer } from '../../onlineShopping/action'
import { selectedCategory } from '../../filter/actions'
import OfferList from './OfferList'
import OfferListList from './OfferListList'
import { NavigationActions } from 'react-navigation'
import { store } from '../../../App'
import ModalDropdown from 'react-native-modal-dropdown'
import { PRODUCT_LISTING } from '../../../common/endpoints'
import Api from '../../../common/api'

// import { getProduct } from 'react-native-device-info'
// import { select } from '../../../common/utils'
const { height, width } = Dimensions.get('screen')


const options = [
    { title: 'Container Buys' },
    { title: 'Offers' },
    //{ title: 'Conference Offers' }
]

let refs

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>Online Shopping</Text>
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
            numColumns: 2,
            keyGrid: 1,
            modalVisible: false,
            selectedSort: null,
            isGrid: true,
            page: 1,
            products: [],
            isLastPage: false,
            isLoading: true
        }
        // PRIMARY_COLOR = select(store.getState())
        this.renderProducts = this.renderProducts.bind(this)
        this.renderProductsList = this.renderProductsList.bind(this)
        this.dropDown = this.dropDown.bind(this)
        this.renderSeparator = this.renderSeparator.bind(this)
        this._onSelect = this._onSelect.bind(this)
        this.actionGrid = this.actionGrid.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.footerView = this.footerView.bind(this)
        this.productList = this.productList.bind(this)
    }

    componentDidMount() {
        // this.props.dispatch(getProduct(this.state.page))
        this.productList()
        this.props.dispatch(resetOffersList())
        this.props.dispatch(selectedCategory({ category: [] }))
        this.props.navigation.setParams({ adjustFrame: this.adjustFrame, renderSeparator: this.renderSeparator, dropDown: this.dropDown })
        console.log('paaage infrommmmmmmmmmmtion', this.props.navigation.getParam('page', null),)
        // 
    }
    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.productList()
        }
    }

    productList() {
        var language = this.props.lang == 'ar' ? 1 : 2
        let page = this.state.page
        Api('get', PRODUCT_LISTING + `?language=${language}&page=${page}`)
            .then((response) => {
                if (response) {
                    console.log('daaaaaaaaaaaaatttttttttttaaaaa', response.items)
                    let res = response.items
                    this.setState({
                        products: this.state.products.concat(res),
                        isLoading: false,
                        page: this.state.page + 1,
                        isLastPage: response.isLastPage
                    })
                }
            })
    }

    actionGrid() {
        this.setState(({ numColumns, keyGrid }) => {
            return { numColumns: numColumns === 1 ? 2 : 1, keyGrid: keyGrid + 1 }
        })
    }


    _onSelect(rowID) {
        if (refs)
            refs.hide()
        if (rowID == 0) {
            this.props.navigation.navigate('ContainerBuys')
        }
    }

    dropDown(rowData, rowID, highlighted, index) {
        return (
            <View style={styles.modalDropContainer}>
                <TouchableOpacity style={styles.dropRow}
                    onPress={() => this._onSelect(rowID, index)}>
                    <Text style={styles.dropText}>{rowData.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    adjustFrame(style) {
        style.left = 60
        style.right = 60
        style.height = 100
        return style
    }

    renderSeparator() {
        return (
            <View style={styles.seperator} />
        )
    }

    renderProducts = (item) => (
        <OfferList
            item={item}
            isGrid={this.state.isGrid}
            navigation={this.props.navigation}
        />
    )

    renderProductsList = (item) => (
        <OfferListList
            item={item}
            isGrid={this.state.isGrid}
            navigation={this.props.navigation}
        />
    )

    loadMore() {
        if (!this.props.isLoading && !this.props.isLastPage)
            this.props.dispatch(getProduct(this.state.page + 1))
    }

    onRefresh() {
        this.props.dispatch(resetOffersList())
        this.props.dispatch(getOffersList())
    }

    footerView() {
        if (!this.state.isLastPage) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size='small' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else return null
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='default' translucent={false} />
                {this.state.isLoading ?
                    <View style={styles.activityIn}>
                        <ActivityIndicator color={PRIMARY_COLOR} size={'large'}/>
                    </View>
                    :
                    <View style={styles.container}>
                        <View style={styles.headerStrip}>
                            <View style={styles.itemFormat}>
                                <Text style={styles.number}>Showing {this.state.products.length} items</Text>
                            </View>
                            {this.props.user &&
                                <TouchableOpacity style={styles.swap} onPress={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Cart' }))} >
                                    <IconMaterial name='shopping-cart' size={24} color={NAV_COLOR} />
                                </TouchableOpacity>
                            }
                            {/* <TouchableOpacity style={styles.swap} onPress={()=>this.setState({isGrid: !this.state.isGrid})} >
                        <IconCommunity name={this.state.isGrid ? 'view-grid' : 'format-list-bulleted'} size={24} color={NAV_COLOR} />
                    </TouchableOpacity> */}
                            <TouchableOpacity style={styles.filterContainer} onPress={() => this.props.navigation.navigate('Filter')} >
                                <Text style={styles.filter}>FILTER</Text>
                            </TouchableOpacity>
                            <ModalDropdown
                                //ref={el => refs = el}
                                showsVerticalScrollIndicator={false}
                                options={["My orders"]}
                                disabled={this.state.isModalVisible}
                                dropdownTextStyle={{ textAlign: 'center', fontSize: 15 }}
                                dropdownStyle={{ width: 130, elevation: 3, height: 40, shadowOffset: { width: 1, height: 1, }, shadowColor: 'black', shadowOpacity: .3 }}
                                onSelect={() => this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'MyOrder' }))}
                            // renderRow={(rowData, rowID, highlighted) => this.dropDown(rowData, rowID, highlighted)}

                            >
                                <IconCommunity name='dots-vertical' size={22} color='#9c9c9c' />
                            </ModalDropdown>
                        </View>
                        {this.state.isGrid ?
                            <FlatList
                                numColumns={2}
                                data={this.state.products}
                                extraData={this.state}
                                renderItem={(item, index) => this.renderProducts(item, index)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                removeClippedSubviews={true}
                                refreshing={false}
                                onEndReached={this.productList}
                                ListFooterComponent={this.footerView}
                            />
                            :
                            <FlatList
                                data={this.state.products}
                                extraData={this.state}
                                renderItem={(item, index) => this.renderProductsList(item, index)}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => index.toString()}
                                removeClippedSubviews={true}
                                refreshing={false}
                            />

                        }
                    </View>
                }
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => ({
    product: state.product.product,
    user: state.userLogin.user,
    isLastPage: state.product.isLastPage,
    lang: state.programmes.lang,
})

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: DRAWER_COLOR
    },
    headerStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    itemFormat: {
        flex: 1,
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    number: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY
    },
    swap: {
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: BORDER_COLOR,
    },
    filterContainer: {
        alignItems: 'center',
        paddingLeft: 15
    },
    filter: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
        paddingRight: 10,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: BORDER_COLOR,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15
    },
    sortOptionActive: {
        paddingLeft: 15,
        fontSize: 14,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR
    },
    sortOption: {
        paddingLeft: 15,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY
    },
    modalSort: {
        justifyContent: "flex-end",
        margin: 0
    },
    modalContainer: {
        backgroundColor: DRAWER_COLOR,
        padding: 15,
        paddingBottom: 30
    },
    sort: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY
    },
    modalClose: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        //paddingHorizontal: 10,
        //paddingVertical: 5
    },
    modalDropContainer: {
        flex: 1,
        backgroundColor: DRAWER_COLOR,
        padding: 15,
    },
    dropRow: {
        flex: 1,
        flexDirection: 'row'
    },
    dropText: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
    },
    seperator: {
        alignSelf: 'center',
        height: 1,
        width: '90%',
        backgroundColor: BORDER_COLOR
    },
    contentUnavailable: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15
    },
    text: {
        fontSize: 25,
        fontFamily: FONT_SECONDARY,
        color: COLOR_PRIMARY,
        textAlign: 'center',
        marginTop: 15
    },
    loader: {
        margin: 7,
        marginTop: 25
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    activityIn:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

