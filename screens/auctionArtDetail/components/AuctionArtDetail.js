import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, FlatList, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MEDIUM, FONT_LIGHT, FONT_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal"
import VideoPlayer from 'react-native-video-controls';
import i18n from '../../../i18n'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { AUCTION_ACTION, AUCTION_BIDDERS } from '../../../common/endpoints'
import Api from '../../../common/api'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageView from "react-native-image-viewing";

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
            auction: this.props.navigation.getParam('artdata', null),
            auctionDetail: '',
            isLoading: true,
            loading: true,
            isVisible: false,
            isVisibleImage: false,
            page: 2,
            isLastPage: false,
            test: [],
            indexImage: 0,
            activeSlide: 0,
            bidPrice: '',
            errorMessage: '',
            isVisibleBid: false,
            bidSuccess: false,
            bidLoader: false,
            bidFail: false,
            isVisibleLogin: false,
            bidError: ''
        }
        this.onPress = this.onPress.bind(this);
        this.getData = this.getData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.footerView = this.footerView.bind(this);
        this.renderAuction = this.renderAuction.bind(this);
        this.renderItemImage = this.renderItemImage.bind(this);
        this.onPressBid = this.onPressBid.bind(this);
        this.onPressUserCheck = this.onPressUserCheck.bind(this);
        this.confirmSubmit = this.confirmSubmit.bind(this);
    }
    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        this.getData()
    }

    getData() {
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', AUCTION_BIDDERS + `?language=${language}&artworkId=${this.state.auction.artworkId}`)
            .then((response) => {
                let res = response.entities
                if (response) {
                    console.log("Art,.,..,...", res)
                    this.setState({
                        auctionDetail: res,
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
        Api('get', AUCTION_BIDDERS + `?language=${language}&artworkId=${this.state.auction.artworkId}&page=${page}`)
            .then((response) => {
                let res = response.entities
                if (response) {
                    console.log("Art,.,..,...", res)
                    this.setState({
                        auctionDetail: this.state.auctionDetail.concat(res),
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

    _onLoadEnd = () => {
        this.setState({
            loading: false
        })
    }

    renderAuction({ item }) {
        return (
            <View style={styles.auctionView}>
                <View>
                    <Text style={styles.name}>{item.userName}</Text>
                    <Text style={styles.time}>{item.bidTime}</Text>
                </View>
                <View style={styles.priceView}>
                    <Text style={styles.price}>{item.bidPrice}<Text style={{ fontFamily: FONT_PRIMARY }}> {this.state.auction.auctionCurrency}</Text></Text>
                </View>
            </View>
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

    renderItemImage({ item, index }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ isVisibleImage: true, indexImage: index })}>
                <Image resizeMode="contain" style={styles.mainImages} source={{ uri: item }} />
            </TouchableOpacity>
        )
    }

    imageViewer() {
        return this.state.auction.artPictures.map((data, i) => {
            this.state.test.push({ uri: data })
            return (
                <ImageView
                    key={i}
                    images={this.state.test}
                    imageIndex={0}
                    visible={this.state.isVisibleImage}
                    onRequestClose={() => this.setState({ isVisibleImage: false, test: [] })}
                    imageIndex={this.state.indexImage}
                />
            )
        })

    }
    get pagination() {
        return (
            <Pagination
                dotsLength={this.state.auction.artPictures.length}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{ paddingVertical: 5, backgroundColor: '#fff' }}
                dotStyle={{
                    width: 6,
                    height: 6,
                    borderRadius: 5,
                    marginHorizontal: 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.92)',

                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    onPressBid() {
        if (!this.state.bidPrice.trim()) {
            this.setState({ errorMessage: "Please Enter bid price" })
        }
        else if (parseInt(this.state.auction.auctionBuyoutPrice) >= this.state.bidPrice && parseInt(this.state.auction.auctionStartPrice) <= this.state.bidPrice) {
            this.setState({ errorMessage: '', bidLoader: true });
            this.confirmSubmit();
        }
        else {
            this.setState({ errorMessage: `Please Enter bid price between ${this.state.auction.auctionStartPrice} and ${this.state.auction.auctionBuyoutPrice}` })
        }
    }
    confirmSubmit() {
        let bidPrice = this.state.bidPrice
        let id = this.state.auction.artworkId
        let formData = new FormData()
        formData.append('artworkId', id);
        formData.append('bidPrice', bidPrice);
        formData.append('action', 'add');
        Api('post', AUCTION_ACTION, formData)
            .then((response) => {
                console.log('bid....rseponse... :', response)
                if (response.statusCode === 200) {
                    this.getData();
                    this.setState({ bidLoader: false, isVisibleBid: false })
                    setTimeout(() => {
                        this.setState({
                            bidSuccess: true
                        })
                    }, 500);
                    setTimeout(() => {
                        this.setState({
                            bidSuccess: false
                        })
                    }, 3000);
                }
                else {
                    this.setState({ bidLoader: false, isVisibleBid: false, bidError: response.statusMessage })
                    setTimeout(() => {
                        this.setState({
                            bidFail: true,
                        })
                    }, 500);
                    setTimeout(() => {
                        this.setState({
                            bidFail: false,
                        })
                    }, 4000);
                }
            }
            )

    }

    onPressUserCheck() {
        if (this.props.user) {
            this.setState({ isVisibleBid: true })
        }
        else {
            this.setState({ isVisibleLogin: true })
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.mainContainer}>
                    {this.state.isLoading ?
                        <View style={styles.activityIndicator}>
                            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                        </View>
                        :
                        <ScrollView style={styles.mainContainer1}>
                            <View>
                                <Carousel
                                    ref={(c) => { this._carousel = c; }}
                                    data={this.state.auction.artPictures}
                                    renderItem={this.renderItemImage}
                                    sliderWidth={width}
                                    itemWidth={width}
                                    autoplay={true}
                                    autoplayInterval={6000}
                                    loop={true}
                                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                                    slideStyle={{ backgroundColor: '#fff' }}
                                />
                                {this.pagination}
                            </View>
                            {this.imageViewer()}
                            <View style={styles.timerContainer}></View>
                            <View style={styles.timerAbsolute}>
                                <Text style={styles.aucTime}>Auction Time</Text>
                                <Text style={styles.timerText}>{this.state.auction.auctionStartTime} <Text style={{ color: PRIMARY_COLOR }}>To</Text> {this.state.auction.auctionEndTime}</Text>
                            </View>
                            <View style={styles.aucDetails}>
                                <Text style={styles.title}>{this.state.auction.artworkTitle}</Text>
                                <Text style={styles.artistName}>{this.state.auction.artistName}</Text>
                            </View>
                            <View style={styles.aucDetails}>
                                <Text style={styles.specTitle}>Specifications</Text>
                                <View style={styles.specFlex}>
                                    <View>
                                        <Text style={styles.specText}>Diamonsion</Text>
                                        <Text style={styles.specText}>Artist Name</Text>
                                        <Text style={styles.specText}>Buy out Price</Text>
                                        <Text style={styles.specText}>Starting Price</Text>
                                        <Text style={styles.specText}>Starting Time</Text>
                                        <Text style={styles.specText}>Ending Time</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-evenly' }}>
                                        <Text style={styles.specItem}>:   {this.state.auction.artworkDimension}</Text>
                                        <Text style={styles.specItem}>:   {this.state.auction.artistName}</Text>
                                        <Text style={styles.specItem}>:   {this.state.auction.auctionBuyoutPrice}</Text>
                                        <Text style={styles.specItem}>:   {this.state.auction.auctionStartPrice}</Text>
                                        <Text style={styles.specItem}>:   {this.state.auction.auctionStartTime}</Text>
                                        <Text style={styles.specItem}>:   {this.state.auction.auctionEndTime}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.aucDetails, { marginBottom: 60 }]}>
                                <Text style={styles.specTitle}>Bids</Text>
                                {this.state.auctionDetail != "" ?
                                    <FlatList
                                        data={this.state.auctionDetail}
                                        renderItem={this.renderAuction}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        ListFooterComponent={this.footerView}
                                        onEndReached={this.loadData}
                                        style={{ marginTop: 3, }}
                                    />
                                    :
                                    <View style={{ backgroundColor: '#ededed' }}>
                                        <Text style={styles.noBids}>No Bids !</Text>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    }
                    <TouchableOpacity onPress={() => this.onPressUserCheck()} style={styles.addBid}>
                        <Text style={styles.bidText}>Place a Bid</Text>
                    </TouchableOpacity>
                    <Modal
                        isVisible={this.state.isVisibleBid}
                        hideModalContentWhileAnimating={true}
                        animationIn='zoomIn'
                        animationOut='zoomOut'
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        animationOutTiming={300}
                        onBackButtonPress={() => this.setState({ isVisibleBid: false })}
                        onBackdropPress={() => this.setState({ isVisibleBid: false })}
                        style={styles.modal}>
                        <View style={styles.placeBid}>
                            <Text style={styles.specTitle}>Bid Price</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.bidmax}>
                                    <Text style={styles.specText}>Starting Price : {this.state.auction.auctionStartPrice}</Text>
                                </View>
                                <View style={styles.bidmax}>
                                    <Text style={styles.specText}>Buy out Price : {this.state.auction.auctionBuyoutPrice}</Text>
                                </View>
                            </View>
                            <TextInput
                                placeholder="Enter your bid price"
                                onChangeText={(text) => this.setState({ bidPrice: text })}
                                style={styles.textInput}
                                onFocus={() => this.setState({ errorMessage: '' })}
                            />
                            {this.state.errorMessage != "" &&
                                <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                            }
                            <TouchableOpacity onPress={() => this.onPressBid()} style={styles.addBid2}>
                                <Text style={styles.bidText}>Place Bid</Text>
                                {this.state.bidLoader &&
                                    <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeCircle} onPress={() => this.setState({ isVisibleBid: false })}>
                                <AntDesign name="closecircleo" size={20} />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.bidSuccess}
                        backdropOpacity={0.0}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <View style={styles.successView}>
                            <Text style={styles.successMsg}>Your Bid has been successfully submitted</Text>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.bidFail}
                        backdropOpacity={0.0}
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        backdropTransitionOutTiming={0}
                        animationInTiming={100}
                        animationOutTiming={100}
                        style={{ justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                        <View style={[styles.successView, { backgroundColor: 'red' }]}>
                            <Text style={[styles.successMsg, { color: '#000' }]}>{this.state.bidError}</Text>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.isVisibleLogin}
                        hideModalContentWhileAnimating={true}
                        animationIn='zoomIn'
                        animationOut='zoomOut'
                        useNativeDriver={true}
                        hideModalContentWhileAnimating={true}
                        animationOutTiming={300}
                        onBackButtonPress={() => this.setState({ isVisibleLogin: false })}
                        onBackdropPress={() => this.setState({ isVisibleLogin: false })}
                        style={styles.modal}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalText}>You need to login to place your bid. Please Login. Not a Member? Join Us.</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isVisibleLogin: false })}>
                                    <Text style={styles.cancel}>{i18n.t("CANCEL")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ isVisibleLogin: false }, () => this.props.navigation.navigate('Login'))} style={styles.button}>
                                    <Text style={styles.subscribe}>{i18n.t("LOGIN")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
    user: state.userLogin.user
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer1: {
        backgroundColor: '#ededed',
        flex: 1,
    },
    auctionView: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#ededed',
        borderRadius: 5,
        marginHorizontal: 5,
        marginVertical: 3,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    name: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM
    },
    time: {
        fontSize: 12,
        fontFamily: FONT_LIGHT,
    },
    price: {
        fontSize: 15,
        fontFamily: FONT_MULI_BOLD,
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: height / 2
    },
    addBid: {
        paddingVertical: 3,
        paddingHorizontal: 35,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        // flexDirection: 'row',
        alignItems: 'center',
        width: width - 100
    },
    addBid2: {
        paddingVertical: 3,
        paddingHorizontal: 35,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        alignSelf: 'center',
        alignItems: 'center',
        width: width - 100,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    bidText: {
        color: '#fff',
        fontFamily: FONT_MULI_BOLD,
        fontSize: 18,
        marginLeft: 5
    },
    priceView: {
        backgroundColor: '#f5c127',
        paddingHorizontal: 5,
        borderRadius: 10
    },
    mainImages: {
        height: height / 3,
        width: width,
        alignSelf: 'center',
    },
    timerContainer: {
        height: 40,
        backgroundColor: '#fff'
    },
    timerAbsolute: {
        height: 60,
        backgroundColor: '#fff',
        width: width - 50,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: -35,
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
        elevation: 1,
        borderWidth: .5,
        borderColor: '#ededed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    timerText: {
        fontFamily: FONT_MEDIUM,
        fontSize: 15
    },
    aucTime: {
        fontFamily: FONT_LIGHT,
        fontSize: 13,
        alignSelf: 'flex-start',
    },
    aucDetails: {
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    title: {
        color: '#000',
        fontSize: 19,
        fontFamily: FONT_MULI_BOLD
    },
    artistName: {
        fontSize: 13,
        fontFamily: FONT_MEDIUM
    },
    specFlex: {
        flexDirection: 'row',
        width: width / 1.5,
        justifyContent: 'space-between',
    },
    specTitle: {
        fontFamily: FONT_MEDIUM,
        fontSize: 17,
        marginBottom: 10
    },
    specText: {
        fontFamily: FONT_LIGHT,
        fontSize: 14
    },
    specItem: {
        fontFamily: FONT_MEDIUM,
        fontSize: 14
    },
    noBids: {
        padding: 10,
        fontFamily: FONT_MEDIUM
    },
    placeBid: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        width: width - 30,
        alignSelf: 'center',
        borderWidth: .5
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        marginBottom: 20,
        borderColor: 'grey',
        paddingHorizontal: 10
    },
    bidmax: {
        paddingHorizontal: 10,
        borderWidth: .5,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: PRIMARY_COLOR,
        marginRight: 5
    },
    errorMessage: {
        color: '#911a1a',
        fontSize: 12,
        marginTop: -13,
        marginBottom: 3
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeCircle: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    successMsg: {
        fontFamily: FONT_MEDIUM,
        fontSize: 12,
        paddingVertical: 2,
        color: '#fff'
    },
    successView: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    modalContainer: {
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD'
    },
    modalText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: 'black',
        opacity: .9
    },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttonCancel: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#DDDDDD'
    },
    button: {
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    cancel: {
        paddingRight: 25,
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontFamily: FONT_PRIMARY,
    },
    subscribe: {
        color: PRIMARY_COLOR,
        fontSize: 14,
        fontFamily: FONT_PRIMARY
    },
})
export default connect(mapStateToProps)(App)