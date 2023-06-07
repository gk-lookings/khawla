import React, { Component,useState, useEffect } from 'react'
import { StyleSheet,Animated,RefreshControl,Platform, View, TouchableOpacity, Text, Image, Dimensions, ScrollView, FlatList, ImageBackground, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import NetInfo from "@react-native-community/netinfo";
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Loader from 'react-native-easy-content-loader'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { PRIMARY_COLOR, SECONDARY_COLOR, TITLE_COLOR } from '../../../assets/color'
import { FONT_SEMIBOLD, FONT_REGULAR, FONT_MEDIUM, FONT_LIGHT, FONT_EXTRA_LIGHT, FONT_BOLD } from '../../../assets/fonts'
import I18n from '../../../i18n'
import Images from '../../../assets/images'
import { fetchDashboard, resetDashboard,resetSearchModal } from '../actions'
import { fetchMyTrips, resetMyTrips } from '../../myTrips/actions'
import { connectionState, fetchCategory } from '../../addTrip/actions'
import AddBlog from '../../../components/addBlog'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modal'
import { changeUserSession } from '../../login/actions'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import ToolTip from '../../../components/toolTip'
import { resetFirstLogin } from '../../login/actions'
import SplashScreen from 'react-native-splash-screen'
import SearchModal from '../../../components/searchModal'

const CopilotText = walkthroughable(Text);
const CopilotImage = walkthroughable(Image);

const circleSvgPath = ({ position, canvasSize }) =>
    `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${-30 + position.x._value},${
    position.y._value
    }Za50 50 0 1 0 100 0 50 50 0 1 0-100 0`

const StepNumber = () => (
    <View>
    </View>
);

const { height, width } = Dimensions.get('screen')
class App extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            index: 0,
            retry: false,
            isConnected: this.props.isConnected,
            isAddModalShow: true,
            showRetry: this.props.showRetry,
            viewRef: null,
            goToRoute: this.props.navigation.getParam('goToRoute', null),
            isModalVisible: false,
            viewSearchEnable: true,
            isFromDashBoard: this.props.navigation.getParam('isFromDashBoard', false)
        }
        this.renderFeature = this.renderFeature.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.renderShared = this.renderShared.bind(this)
        this.gotoLoginPage = this.gotoLoginPage.bind(this)
        this.onPressFeatured = this.onPressFeatured.bind(this)
        this.onFeatured = this.onFeatured.bind(this)
        this.onSearch = this.onSearch.bind(this)
        this.onRetry = this.onRetry.bind(this)
        this._handleConnectionChange = this._handleConnectionChange.bind(this)
    }

    onRetry() {
        this.setState({ retry: !this.state.retry })
        this.props.dispatch(resetDashboard())
        this.props.dispatch(fetchDashboard(this.props.locale == 'ar' ? 'ar' : 'en'))
        {
            this.props.isConnected &&
            this.props.dispatch(resetMyTrips())
            this.props.dispatch(fetchMyTrips())
        }
    }

    componentDidMount() { 
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.props.dispatch(changeUserSession('Home'))
    });
        NetInfo.isConnected.addEventListener('connectionChange', () => this._handleConnectionChange);
        I18n.locale = this.props.locale && this.props.locale
        { this.state.goToRoute && this.state.goToRoute === 'TripDetail' && this.props.navigation.navigate('TripDetail', this.props.navigation.getParam('data') && this.props.navigation.getParam('data')) }
        if (this.props.isFirstLogin) {
            this.props.start()
            this.props.dispatch(resetFirstLogin({ locale: I18n.locale, isFirstLogin: false }))
        }
        SplashScreen.hide()
        this.props.navigation.setParams({
            this: this,
            onSearch: this.onSearch
        })
        this.props.dispatch(resetDashboard())
        this.props.dispatch(fetchDashboard(this.props.locale == 'ar' ? 'ar' : 'en'))
        this.props.dispatch(fetchCategory(this.props.locale))
        {this.props.isConnected &&
        this.props.dispatch(resetMyTrips())
        this.props.dispatch(fetchMyTrips())}
    }

    componentWillUnmount() {
        this.focusListener.remove();
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }
    
    _handleConnectionChange = (isConnected) => {
        this.props.dispatch(connectionState({ status: isConnected }));
    };

    onSearch() {
        this.props.dispatch(resetSearchModal(true))
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.retry !== this.state.retry) {
            NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
        }
        if (prevState.viewSearchEnable !== this.state.viewSearchEnable) {
        }
        if (prevProps.isAddModalShow !== this.props.isAddModalShow) {
            this.setState({ isAddModalShow: this.props.isAddModalShow })
        }
        if (prevProps.showRetry !== this.props.showRetry) {
            this.setState({ showRetry: this.props.showRetry })
        }
        if (this.props.locale != prevProps.locale) {
            I18n.locale = this.props.user && this.props.user.language
            this.props.dispatch(resetDashboard())
            this.props.dispatch(fetchDashboard(this.props.locale == 'ar' ? 'ar' : 'en'))
        }
    }

    gotoLoginPage() {
        this.props.navigation.navigate('Login')
    }

    onPressFeatured(item) {
        if (!item.isPremium) {
            this.props.navigation.navigate('TripDetail', { data: item })
            return 0;
        }
        if (this.props.isPremium == false) {
            this.setState({ isModalVisible: true })
        }
        else {
            this.props.navigation.navigate('TripDetail', { data: item })
        }
    }

    onFeatured() {
        this.props.navigation.navigate('Subscribe')
        this.setState({ isModalVisible: false })
    }

    showBottomWalkthrough() {
        this.props.dispatch(walkthroughable(true))
    }

    renderFeature({ item, index }) {
        return (
            <TouchableOpacity onPress={() => this.onPressFeatured(item)}>
                <ImageBackground style={styles.card} source={item.coverImage ? { uri: item.coverImage } : Images.default}
                    imageStyle={styles.imageStyle}>
                    <LinearGradient style={styles.linear} colors={['rgba(0,0,0,.2)', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.2)']}>
                        <View style={styles.cardHeader}>
                            <View style={styles.profie}>
                                <Image source={item.author.profilePic ? { uri: item.author.profilePic } : Images.avatar} style={styles.profileImage} />
                                <View style={styles.name}>
                                    <Text style={styles.textName}>{item.author.userName}</Text>
                                    <Text style={styles.time}>{item.timeAgo}</Text>
                                </View>
                            </View>
                            <View>{item.isPremium && <Icon5 name='crown' size={20} color='#FFC300' />}</View>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.title} numberOfLines={2}>{item.tripName}</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('TripDetail', { data: item })}>
                <ImageBackground style={styles.cardArticle} source={item.coverImage ? { uri: item.coverImage } : Images.default}
                    imageStyle={styles.imageStyle}>
                    <LinearGradient style={styles.articleContainer} colors={['rgba(0,0,0,.2)', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.2)']}>
                        <Text style={styles.city} numberOfLines={2}>{item.tripName}</Text>
                        <Text style={styles.date}>{item.timeIgo}</Text>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    renderShared({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('TripDetail', { data: item })}>
                <ImageBackground style={styles.cardShared} source={item.coverImage ? { uri: item.coverImage } : Images.default}
                    imageStyle={styles.imageStyle}>
                    <LinearGradient style={styles.shareContainer} colors={['rgba(0,0,0,.2)', 'rgba(0,0,0,.2)', 'rgba(0,0,0,.2)']}>
                        <Text style={styles.titleShared} numberOfLines={3}>{item.tripName}</Text>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity >
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.SafeAreaContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()} style={styles.menuContainer}>
                        <CopilotStep text={I18n.t("Click_here_to_view_IBN_Battuta_App_Options")} order={1} name={I18n.t("Menu")}>
                            <CopilotImage source={Images.menu} resizeMode='contain' />
                        </CopilotStep>
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image source={Images.logo} resizeMode='contain' style={styles.logoImg} />
                    </View>
                    <TouchableOpacity onPress={() => this.onSearch()} style={styles.searchContainer} >
                        {/* {this.state.viewSearchEnable ? <AntDesign name="close" color={TITLE_COLOR} size={24} /> : */}
                            <CopilotStep text={I18n.t("Search_for_featured_trips_and_articles")} order={2} name={I18n.t("Search")}>
                                <CopilotText><FontAwesome name='search' color={TITLE_COLOR} size={30} /></CopilotText>
                            </CopilotStep>
                    </TouchableOpacity>
                </SafeAreaView>
                <StatusBar barStyle="default" translucent={false} />
                {!this.props.fetchingFailed ?
                    <View style={styles.scrollViewContainer}>
                        <ScrollView contentContainerStyle={styles.scroll}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isLoading}
                                onRefresh={() => this.onRetry()}
                                colors={["#F47424"]}
                            />
                        }
                            showsVerticalScrollIndicator={false}>
                            <View style={styles.section}>
                                <View style={styles.header}>
                                    <Text style={styles.textHeader}>{I18n.t("Featured_Trips")}</Text>
                                    <Text style={styles.seeAll} onPress={() => this.props.navigation.navigate('Featured')}>{I18n.t("See_All")}</Text>
                                </View>
                                {!this.props.isLoading && this.props.dashboard && this.props.dashboard.featured && this.props.dashboard.featured.length > 0 &&
                                    <View style={styles.flatlist}>
                                        <FlatList
                                            horizontal={true}
                                            style={styles.flatlistStyle}
                                            showsHorizontalScrollIndicator={false}
                                            data={this.props.dashboard.featured}
                                            renderItem={this.renderFeature}
                                            extraData={this.state}
                                            keyExtractor={(item) => item.tripId.toString()}
                                        />
                                    </View>}
                                {(this.props.isLoading || this.props.showRetry) &&
                                    <Loader
                                        primaryColor='#CFCFCF'
                                        secondaryColor='#E7E7E7'
                                        animationDuration={500}
                                        loading={true}
                                        active
                                        pRows={0}
                                        tHeight={height * .25}
                                        titleStyles={{ borderRadius: 15 }}
                                        tWidth={width * .8}
                                        listSize={1}
                                        containerStyles={{
                                            height: height * .25,
                                            width: width * .8, marginLeft: 15,
                                            paddingLeft: 0
                                        }}
                                        title={true} />
                                }
                            </View>
                            {!this.props.isLoading && this.props.dashboard && this.props.dashboard.featured && this.props.dashboard.featured.length == 0 && 
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>No Featured Trips!</Text>
                                </View>}
                            {!this.props.isLoading && this.props.dashboard && this.props.dashboard.recent && this.props.dashboard.recent.length == 0 &&
                             <View style={styles.infoContainer}>
                                 <Text style={styles.infoContainer}>No Recent Public Trips Trips!</Text>
                                 </View>}
                            <View style={styles.section}>
                                <View style={styles.header}>
                                    <Text style={styles.textSecondaryHeader}>{I18n.t("Recent_Public_Trips")}</Text>
                                    <Text style={styles.seeAll} onPress={() => this.props.navigation.navigate('PublicTrips', { recent: this.props.recent })}>{I18n.t("See_All")}</Text>
                                </View>
                                {this.props.dashboard && this.props.dashboard.recent && this.props.dashboard.recent.length > 0 &&
                                    <View style={styles.flatlistArticle}>
                                        <FlatList
                                            numColumns={2}
                                            showsVerticalScrollIndicator={false}
                                            data={this.props.dashboard.recent}
                                            renderItem={this.renderArticle}
                                            extraData={this.state}
                                            keyExtractor={(item) => item.tripId.toString()}
                                        />
                                    </View>}
                                {(this.props.isLoading || this.props.showRetry) &&
                                    <Loader
                                        primaryColor='#CFCFCF'
                                        secondaryColor='#E7E7E7'
                                        animationDuration={500}
                                        loading={true}
                                        active
                                        pRows={0}
                                        tWidth={width * .9}
                                        listSize={6}
                                        containerStyles={{
                                            height: (height * .125) / 3,
                                            paddingLeft: 0, marginLeft: 15, marginRight: 15
                                        }}
                                        title={true} />}
                            </View>
                            {!this.props.isLoading && this.props.dashboard && this.props.dashboard.recent && this.props.dashboard.recent.length == 0 && <View style={styles.infoContainer}><Text style={styles.infoText}>No Recent Public Trips Trips!</Text></View>}
                            {this.props.user && this.props.dashboard && this.props.dashboard.shared && this.props.dashboard.shared.length > 0 &&
                                <View style={styles.sectionShared}>
                                    <View style={styles.header}>
                                        <Text style={styles.textSecondaryHeader}>{I18n.t("Shared_with_me")}</Text>
                                        {this.props.dashboard.shared.length > 0 && <Text style={styles.seeAll} onPress={() => this.props.navigation.navigate('Shared', { shared: this.props.shared })}>{I18n.t("See_All")}</Text>}
                                    </View>
                                    <View style={styles.flatlistArticle}>
                                        <FlatList
                                            numColumns={2}
                                            showsVerticalScrollIndicator={false}
                                            data={this.props.dashboard.shared}
                                            renderItem={this.renderShared}
                                            extraData={this.state}
                                            keyExtractor={(index) => (index.toString())}
                                        />
                                    </View>
                                </View>}
                        </ScrollView>
                        {this.props.isAddModalShow && this.props.user &&
                            <AddBlog navigation={this.props.navigation} />}
                        {this.props.isAddModalShow && !this.props.user &&
                            this.props.navigation.navigate('Profile')
                        }
                        <Modal
                            isVisible={this.state.isModalVisible}
                            hideModalContentWhileAnimating={true}
                            animationIn='zoomIn'
                            animationOut='zoomOut'
                            useNativeDriver={true}
                            hideModalContentWhileAnimating={true}
                            animationOutTiming={300}
                            onBackButtonPress={() => this.setState({ isModalVisible: false })}
                            onBackdropPress={() => this.setState({ isModalVisible: false })}
                            style={styles.modal}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalText}>{I18n.t("You_need_to_have_a_premium_account_to_view_this_Trip")}</Text>
                                </View>
                                <View style={styles.modalFooter}>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => this.setState({ isModalVisible: false })}>
                                        <Text style={styles.cancel}>{I18n.t("CANCEL")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onFeatured} style={styles.button}>
                                        <Text style={styles.subscribe}>{I18n.t("SUBSCRIBE")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {this.props.showRetry &&
                            <Modal
                                isVisible={false}
                                hideModalContentWhileAnimating={true}
                                animationIn='zoomIn'
                                animationOut='zoomOut'
                                useNativeDriver={true}
                                hideModalContentWhileAnimating={true}
                                animationOutTiming={300}
                                style={styles.modal}>
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalText}>Something went wrong{"\n"} with network!</Text>
                                    </View>
                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity onPress={this.onRetry} style={styles.button}>
                                            <Text style={styles.subscribe}>Retry</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>}
                            <SearchModal navigation={this.props.navigation}/>
                    </View> :
                    <View style={styles.scrollViewContainer}>
                        <View style={styles.offlineImgContainer}>
                            <Image source={Images.noNetwork} resizeMode='contain' style={styles.offlineImg} />
                        </View>
                        {this.props.isAddModalShow && this.props.user &&
                            <AddBlog navigation={this.props.navigation} />}
                        <View style={styles.noNetworkContainer}>
                            <Text style={styles.noNetworkText}>No Network</Text>
                            <Text style={styles.offlineInfoText}>Please check your network connectivity and try again.</Text>
                            <TouchableOpacity onPress={this.onRetry} style={styles.retryContainer}>
                                <Text style={styles.retryText}>RETRY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userLogin.user,
        dashboard: state.dashboard.dashboard,
        showRetry: state.dashboard.showRetry,
        isLoading: state.dashboard.isLoading,
        isAddModalShow: state.dashboard.isAddModalShow,
        locale: state.userLogin.locale,
        isSubscribed: state.userLogin.isSubcribed,
        isPremium: state.userLogin.isPremium,
        isShowWalkThrough: state.userLogin.isShowWalkThrough,
        isFirstLogin: state.userLogin.isFirstLogin,
        actionQueue: state.addTrip.actionQueue,
        articleActionQueue: state.addArticle.actionQueue,
        isConnected: state.addTrip.isConnected,
        fetchingFailed: state.dashboard.fetchingFailed,
    }
}

const style = {

    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 40,

};

export default connect(mapStateToProps)((copilot(
    {
        tooltipComponent: (props) => <ToolTip {...props} isHomePage={true} />,
        svgMaskPath: circleSvgPath,
        stepNumberComponent: StepNumber,
        tooltipStyle: style,
        animated: true,
        overlay: 'svg',
    })(App)))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF'
    },
    searchText: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: TITLE_COLOR,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
    },
    SafeAreaContainer: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        alignItems: 'center',
        marginBottom: 5
    },
    menuContainer: {
        zIndex: 3,
        paddingRight: 15,
        paddingLeft: 15
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoImg: {
        height: 42
    },
    searchContainer: {
        paddingRight: 15,
        paddingLeft: 15,
        zIndex:20
    },
    scrollViewContainer: {
        flex: 1
    },
    flatlistStyle: {
        paddingLeft: 15
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: FONT_BOLD
    },
    infoContainer: {
        justifyContent: 'flex-start'
    },
    offlineImgContainer: {
        flex: .8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    offlineImg: {
        width: '100%',
        height: '100%'
    },
    noNetworkContainer: {
        flex: 1,
        alignItems: 'center'
    },
    noNetworkText: {
        textAlign: 'center',
        fontFamily: FONT_BOLD,
        fontSize: 18
    },
    offlineInfoText: {
        textAlign: 'center',
        marginVertical: 30,
        fontFamily: FONT_REGULAR,
        fontSize: 14,
        color: SECONDARY_COLOR
    },
    retryContainer: {
        borderColor: PRIMARY_COLOR,
        alignItems: 'center',
        height: 50,
        justifyContent: "center",
        width: 150,
        borderRadius: 30,
        borderWidth: 2
    },
    retryText: {
        fontFamily: FONT_BOLD,
        color: PRIMARY_COLOR
    },
    ToolTipStyle: {
        backgroundColor: '#9FA8DA',
        borderRadius: 10,
        paddingTop: 5,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        paddingBottom: 15
    },
    header: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 22,
        fontFamily: FONT_SEMIBOLD,
        color: SECONDARY_COLOR
    },
    textSecondaryHeader: {
        fontSize: 18,
        fontFamily: FONT_SEMIBOLD,
        color: SECONDARY_COLOR
    },
    seeAll: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: PRIMARY_COLOR
    },
    section: {
    },
    sectionShared: {
        marginBottom: 80
    },
    flatlist: {
    },
    card: {
        height: height * .25,
        width: width * .8,
        marginRight: 15,
    },
    linear: {
        flex: 1,
        padding: 15,
        borderRadius: 15,
        justifyContent: 'space-between',
    },
    imageStyle: {
        borderRadius: 15
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    profie: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    name: {
        paddingLeft: 10
    },
    textName: {
        fontSize: 14,
        fontFamily: FONT_MEDIUM,
        color: '#FFFFFF',
        lineHeight: 17
    },
    time: {
        fontSize: 12,
        fontFamily: FONT_LIGHT,
        color: '#FFFFFF',
    },
    cardFooter: {},
    title: {
        fontSize: 20,
        fontFamily: FONT_SEMIBOLD,
        color: '#FFFFFF'
    },
    flatlistArticle: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    articleContainer: {
        flex: 1,
        borderRadius: 15,
        padding: 15,
        justifyContent: 'flex-end'
    },
    cardArticle: {
        borderRadius: 15,
        height: height * .125,
        width: width * .45,
        justifyContent: 'flex-end',
        margin: 5,
    },
    city: {
        fontSize: 16,
        fontFamily: FONT_MEDIUM,
        color: '#FFFFFF',
        lineHeight: 20
    },
    date: {
        fontSize: 12,
        fontFamily: FONT_EXTRA_LIGHT,
        color: '#FFFFFF'
    },
    shareContainer: {
        flex: 1,
        borderRadius: 15,
        padding: 15,
        justifyContent: 'flex-end',
        borderRadius: 15
    },
    cardShared: {
        height: height * .2,
        width: width * .45,
        margin: 5,
    },
    titleShared: {
        fontSize: 18,
        fontFamily: FONT_BOLD,
        color: '#FFFFFF'
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
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
        color: TITLE_COLOR,
        opacity: .9
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
        paddingRight: 25,
        fontSize: 14,
        color: TITLE_COLOR,
        fontFamily: FONT_LIGHT,
    },
    subscribe: {
        color: PRIMARY_COLOR,
        fontSize: 14,
        fontFamily: FONT_LIGHT
    },
})