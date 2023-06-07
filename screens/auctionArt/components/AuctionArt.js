import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_MEDIUM, FONT_LIGHT, FONT_MULI_EXTRABOLD, FONT_PRIMARY1 } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ART_GALLERY, AUCTION_ARTWORK } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>Auction</Text>
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
            auctionArt: [],
            isLoading: true,
            isList: true,
            page: 2,
            isLastPage: false,
        }
        this.onPress = this.onPress.bind(this)
        this.renderArt = this.renderArt.bind(this)
        this.getData = this.getData.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
        this.loadData = this.loadData.bind(this)
        this.footerView = this.footerView.bind(this)
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
        Api('get', AUCTION_ARTWORK + `?language=${language}&page=${1}`)
            .then((response) => {
                let res = response.entities
                if (response) {
                    console.log("Art,.,..,...", response)
                    this.setState({
                        auctionArt: res,
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
        Api('get', AUCTION_ARTWORK + `?language=${language}&page=${page}`)
            .then((response) => {
                let res = response.entities
                if (response) {
                    console.log("Art,.,..,...", res)
                    this.setState({
                        auctionArt: this.state.auctionArt.concat(res),
                        isLoading: false,
                        isLastPage: response.isLastPage ? true : false,
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

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AuctionArtDetail', { artdata: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.artPicture }} style={styles.imageStyleGrid} resizeMode="contain" />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artworkTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArt({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AuctionArtDetail', { artdata: item })} style={[styles.itemContainer, this.props.lang == 'ar' && { flexDirection: 'row-reverse' }]}>
                <View>
                    <Image source={{ uri: item.artPicture }} style={[styles.imageStyle, this.props.lang == 'ar' && { marginRight: 0,marginLeft: 10 }]} resizeMode="contain" />
                </View>
                <View>
                    <View style={[styles.aucTime, this.props.lang == 'ar' && { alignSelf: 'flex-start' }]}>
                        <IconMaterial name="av-timer" size={20} />
                        <Text style={styles.timerText}>{item.auctionEndTime}</Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'ar' && { textAlign: 'right' }]}>{item.artworkTitle}</Text>
                    <Text style={[styles.artistText, this.props.lang == 'ar' && { textAlign: 'right' }]}>{item.artistName}</Text>
                    <Text style={[styles.sizeText, this.props.lang == 'ar' && { textAlign: 'right' }]}>{item.artworkDimension}</Text>
                    <View style={[styles.viewAuc, this.props.lang == 'ar' && { alignSelf: 'flex-start',marginLeft: 10 }]}>
                        <Text style={styles.viewAucText}>View Auction</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
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
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        {/* <View style={styles.header}>
                            <View style={styles.showItem}>
                                <Text style={styles.showingText}>( {this.state.auctionArt.length} )</Text>
                            </View>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
                        </View> */}
                        <View>
                            {this.state.isList &&
                                <FlatList
                                    data={this.state.auctionArt}
                                    renderItem={this.renderArt}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                    contentContainerStyle={{paddingBottom: 20}}
                                />
                            }
                            {/* {!this.state.isList &&
                                <FlatList
                                    data={this.state.auctionArt}
                                    renderItem={this.renderArticleGrid}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    style={{ alignSelf: 'center' }}
                                    ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                />
                            } */}
                        </View>
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
        backgroundColor: '#ededed'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: PRIMARY_COLOR,
    },
    itemContainer: {
        width: '95%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 5,
        padding: 5
    },
    eventTitle: {
        fontSize: 16,
        textAlign: 'left',
        fontFamily: FONT_MULI_BOLD,
        width: width / 1.75,
    },
    imageStyle: {
        height: width / 3,
        width: width / 3,
        backgroundColor: '#f5f5f5',
        marginRight: 10
    },
    itemView: {
        height: '100%',
        width: '67%',
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
        flexDirection: 'row',
        width: width - 40,
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 5
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
    imageStyleGrid: {
        height: height / 5,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    imageStyleGridView: {
        height: height / 5,
        width: '100%',
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: height / 4,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 20,
    },
    itemViewGrid: {
        height: 45,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eventTitleGrid: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: FONT_MULI_BOLD,
        paddingLeft: 5,
        paddingRight: 5
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: height / 2
    },
    aucTime: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: '#fff5f5',
        borderRadius: 10,
        width: width / 2,
        marginTop: 2,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    timerText:{
        fontFamily: FONT_MEDIUM,
        fontSize: 13
    },
    artistText:{
        fontFamily: FONT_LIGHT,
        fontSize: 13,
        textAlign:'left'
    },
    sizeText:{
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 13
    },
    viewAuc:{
        borderWidth: .5,
        borderColor: PRIMARY_COLOR,
        height: 30,
        width: 120,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 5,
        alignSelf:'flex-end',
        marginRight: 5
    },
    viewAucText:{
        fontFamily: FONT_MEDIUM,
        color: PRIMARY_COLOR,
        fontSize: 13
    }
})
export default connect(mapStateToProps)(App)