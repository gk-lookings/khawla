import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image, ScrollView, RefreshControl, FlatList, TouchableWithoutFeedback, BackHandler, Alert } from 'react-native'
import { connect } from 'react-redux'
import { FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import { PRIMARY_COLOR } from '../../../assets/color'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Images from '../../../assets/images'
import Api from '../../../common/api'
import { SEQUENCE, } from '../../../common/endpoints'
import { getProgrammes } from '../../home/action'
import i18n from '../../../i18n'
import firebase from 'react-native-firebase'
import DeviceInfo from 'react-native-device-info'
import { sendFCMToken } from '../action'
import SplashScreen from 'react-native-splash-screen'
import Modal from 'react-native-modal'
import ToolTip from '../../home/components/Tooltip'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import { resetBanner, setBanner } from '../../home/action'
import Loader from 'react-native-easy-content-loader'
import * as Animatable from 'react-native-animatable';
// import NetInfo from "@react-native-community/netinfo";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(Image);
const WalkthroughableView = walkthroughable(View);

const { height, width } = Dimensions.get('screen')
const uniqueId = DeviceInfo.getUniqueId()
const options = [
  {
    key: 'en',
    value: 'English'
  },
  {
    key: 'ar',
    value: 'عربى'
  }
]
const circleSvgPath = ({ position, canvasSize }) =>
  `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${-30 + position.x._value},${position.y._value
  }Za50 50 0 1 0 100 0 50 50 0 1 0-100 0`

const StepNumber = () => (
  <View>
  </View>
);

class App extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: () => navigation.getParam('title',
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15,marginBottom:10 ,width:width/2}}>
          <Image resizeMode ='contain' source={Images.logoLetterNew} style={{ height: 45, width: width / 2 }} />
          <View>
            {/* <Image source={Images.logo} style={{ height: 39.2, width: 9.28, marginLeft: 5 }} /> */}
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 10, flexDirection: 'row' }}>
          <TouchableOpacity onPress={navigation.getParam('openModel')}>
            <FontAwesome name='globe' size={26} color={'#000'} style={{}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigation.getParam('gotoSearch')}>
            <Feather name='search' size={26} color={'#000'} style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 10 }}>
          <IconMaterial name='sort' size={30} color='black' />
        </TouchableOpacity>
      ),
    }
  }


  constructor(props) {
    super(props)
    this.state = {
      events: [],
      activeSlide: "",
      isLoading: true,
      programmes: "",
      index: 0,
      today: "",
      online: [],
      routes: [
        { key: 'first', title: i18n.t("Art") },
        { key: 'second', title: i18n.t("Cultural") },
      ],
      refreshing: false,
      loading: false,
      loaded: false,
      isVisible: false,
      language: null,
      isVisibleItem: false,
      sequence: [],
      modules: [],
      allSequence: [],
      status: '',
      isClosed: this.props.banner
    }
    this._onRefresh = this._onRefresh.bind(this)
    this.openModel = this.openModel.bind(this)
    this.getData = this.getData.bind(this)
    this.onPressIcon = this.onPressIcon.bind(this)
    this.renderBanner = this.renderBanner.bind(this)
    this.renderIcons = this.renderIcons.bind(this)
    this.gotoSearch = this.gotoSearch.bind(this)

  }

  componentDidMount() {
    this.getData()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // NetInfo.isConnected.addEventListener('connectionChange', () => this._handleConnectionChange);
  }
  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }


  // // onButtonPress = () => {
  // //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // //   // then navigate
  // //   navigate('NewScreen');
  // // }
  
  handleBackButton  () {
     BackHandler.exitApp()
    return true;
  } 
  
  


  async getData() {
    SplashScreen.hide()
    this.props.navigation.setParams({ openModel: this.openModel, gotoSearch: this.gotoSearch, this: this })
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('permission granted')
        }
        else {
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised  
              console.log('permission granted')
            })
            .catch(error => {
              // User has rejected permissions  
              console.log('permission denied')
            })
        }
      })

    const fcmToken = await firebase.messaging().getToken()
    if (fcmToken) {
      console.log('fcm token = ', fcmToken)
      sendFCMToken(fcmToken, uniqueId)
    }
    else {
      console.log('no token available')
    }

    i18n.locale = this.props.lang;
    this.getSequence()
    if (this.props.walkthroungh && !this.props.isFirstlogin) {
      // this.props.start()
    }
    this.props.dispatch(getProgrammes())
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var dateFull = year + '-' + month + '-' + date
    this.setState({ today: dateFull });
    this.setState({
      routes: [
        { key: 'first', title: i18n.t("Art") },
        { key: 'second', title: i18n.t("Cultural") },
      ]
    });
  }



  getSequence() {
    var language = this.props.lang == 'ar' ? 1 : 2
    Api('get', SEQUENCE + `?language=${language}`)
      .then((responseJson) => {
        if (responseJson) {
          const filter = responseJson.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1)
          this.setState({
            sequence: filter.filter(responseJson => responseJson.mobilePublished == true),
            isLoading: false,
            allSequence: responseJson
          })
          console.log('seqnceeee,.,.,.,.,.,.,.,.', filter.filter(responseJson => responseJson.mobilePublished == true))
        }
      })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lang != this.props.lang) {
      this.getData()
    }
  }

  openModel() {
    this.setState({ isVisible: true })
  }
  gotoSearch() {
    this.props.navigation.navigate('Search')
  }

  renderModalContent = () => (
    <View style={styles.content}>
      <Text style={styles.modalTitle}>{i18n.t("Change_Language")}</Text>
      {options.map((item) =>
        <View key={item.key} style={styles.buttonContainer}>
          <Text style={styles.text}>{item.value}</Text>
          <TouchableOpacity style={styles.circle} onPress={() => this.setState({ language: item.key, isVisible: false }, () => this.changeLanguage())}>
            {this.props.lang === item.key && <View style={styles.checkedCircle} />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  _onRefresh = () => {
    this.setState({ events: [], isLoading: true });
    this.props.dispatch(resetBanner())
    this.componentDidMount();
  }

  changeLanguage() {
    i18n.locale = this.state.language
    this.props.dispatch({ type: 'CHANGE_LANGUAGE', locale: this.state.language })
    this._onRefresh()
  }

  onPressIcon({ item }) {
    if (item.moduleId == 1) {
      this.props.navigation.navigate('AboutUs')
    }
    if (item.moduleId == 2) {
      this.props.navigation.navigate('Events')
    }
    if (item.moduleId == 3) {
      this.props.navigation.navigate('Programmes')
    }
    if (item.moduleId == 4) {
      this.props.navigation.navigate('LatestFeeds')
    }
    if (item.moduleId == 5) {
      this.props.navigation.navigate('Courses')
    }
    if (item.moduleId == 6) {
      this.props.navigation.navigate('Collection')
    }
    if (item.moduleId == 7) {
      this.props.navigation.navigate('Artists')
    }
    if (item.moduleId == 8) {
      this.props.navigation.navigate('Library')
    }
    if (item.moduleId == 9) {
      this.props.navigation.navigate('AudioGallery')
    }
    if (item.moduleId == 10) {
      this.props.navigation.navigate('Founder')
    }
    if (item.moduleId == 11) {
      this.props.navigation.navigate('Media')
    }
    if (item.moduleId == 12) {
      this.props.navigation.navigate('News')
    }
    if (item.moduleId == 13) {
      this.props.navigation.navigate('KidsCorner')
    }
    if (item.moduleId == 14) {
      this.props.navigation.navigate('Collabration')
    }
    if (item.moduleId == 15) {
      this.props.navigation.navigate('Article')
    }
    if (item.moduleId == 16) {
      this.props.navigation.navigate('OnlineShopping')
    }
    if (item.moduleId == 24) {
      this.props.navigation.navigate('UpcomingEvents')
    }
    if (item.moduleId == 25) {
      this.props.navigation.navigate('ArtGallery')
    }
  }

  renderBanner({ item }) {
    return (
      <View>
        <Image source={{ uri: item.bannerPictureApp }} resizeMode="repeat" style={styles.banner} />
        {/* <View style={{ height: 30, width: width, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
          <Text>{item.moduleName}</Text>
        </View> */}
      </View>
    )
  }

  renderIcons({ item , index}) {
    return (
      <Animatable.View delay={index*50} animation="fadeInUp">
      <TouchableOpacity onPress={() => this.onPressIcon({ item: item })} style={styles.icons}>
        <View style={styles.iconImage}>
          <View style={styles.shadow}>
            <Image source={{ uri: item.modulePicture }} style={styles.iconImags} />
          </View>
        </View>
        <View style={styles.iconTextbox}>
          <Text numberOfLines={3} style={styles.iconText}>{item.moduleName}</Text>
        </View>
      </TouchableOpacity>
      </Animatable.View>
    )
  }

  render() {
    const modulesAll = this.state.sequence
    console.log('iscolooo', this.props.banner)
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        {!this.state.isLoading ?
          <View>
            {/* <CopilotStep text="Here's where to Change language." order={1} name="Languages">
              <WalkthroughableView style={{ position: "absolute", top: -10, right: 10, minHeight: 30, width: 20, zindex: 30 }}>
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep text="Click here to view Khawla Foundation App options" order={2} name="Menu">
              <WalkthroughableView style={{ position: "absolute", top: -10, left: 10, minHeight: 30, width: 20, zindex: 30 }}>
              </WalkthroughableView>
            </CopilotStep> */}
            {/* <CopilotStep text="Click here to view Khawla Foundation App options" order={3} name="home">
              <WalkthroughableView style={{ position: "absolute", bottom: height/9, left: width/10, minHeight: 30, width: 15, zindex: 100 }}>
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep text="Click here to view Khawla Foundation App options" order={4} name="about us">
              <WalkthroughableView style={{ position: "absolute", bottom: width/4, left: width/3, minHeight: 30, width: 15, zindex: 30 }}>
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep text="Click here to view Khawla Foundation App options" order={5} name="programmes">
              <WalkthroughableView style={{ position: "absolute", bottom: height/9, right: width/2.5, minHeight: 30, width: 15, zindex: 30 }}>
              </WalkthroughableView>
            </CopilotStep>
            <CopilotStep text="Click here to view Khawla Foundation App options" order={6} name="profile">
              <WalkthroughableView style={{ position: "absolute", bottom: height/9, right: width/7, minHeight: 30, width: 15, zindex: 30 }}>
              </WalkthroughableView>
            </CopilotStep> */}
            {this.props.banner &&
              <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('UpcomingEvents')}>
                <ImageBackground resizeMode="stretch" source={{ uri: this.state.sequence[0].bannerPictureApp }} style={styles.banner}>
                  <TouchableOpacity style={styles.close} onPress={() => this.props.dispatch(setBanner())}>
                    <AntDesign name="closecircleo" size={20} style={styles.close} />
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableWithoutFeedback>
            }
            <FlatList
              data={this.state?.sequence}
              renderItem={this.renderIcons}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              style={styles.iconRender}
            />
            <Modal
              isVisible={this.state.isVisible}
              hasBackdrop={true}
              backdropOpacity={.7}
              hideModalContentWhileAnimating={true}
              animationIn='zoomIn'
              animationOut='zoomOut'
              useNativeDriver={true}
              onBackButtonPress={() => this.setState({ isVisible: false })}
              onBackdropPress={() => this.setState({ isVisible: false })}
              backdropTransitionOutTiming={0}
              style={styles.bottomModal}
              backdropColor="#000"
            >
              {this.renderModalContent()}
            </Modal>
          </View> :
          <View>
            <Loader
              primaryColor='#CFCFCF'
              secondaryColor='#E7E7E7'
              animationDuration={500}
              loading={true}
              active
              pRows={1}
              tWidth={width * .9}
              tHeight={height / 3.8}
              listSize={1}
              containerStyles={{
                height: height / 4.9,
                margin: 10,
              }}
              title={true}
            />
            <Loader
              primaryColor='#CFCFCF'
              secondaryColor='#E7E7E7'
              animationDuration={500}
              loading={true}
              active
              tWidth={width * .9}
              pRows={0}
              tHeight={120}
              pWidth={width * .9}
              listSize={1}
              containerStyles={{
                height: (height * .4) / 3,
                margin: 10, marginBottom: 0, marginTop: 100
              }}
              title={true} />
            <Loader
              primaryColor='#CFCFCF'
              secondaryColor='#E7E7E7'
              animationDuration={500}
              loading={true}
              active
              tWidth={width * .9}
              pRows={0}
              tHeight={120}
              pWidth={width * .9}
              listSize={1}
              containerStyles={{
                height: (height * .4) / 3,
                margin: 10, marginBottom: 0, marginTop: 20
              }}
              title={true} />
            <Loader
              primaryColor='#CFCFCF'
              secondaryColor='#E7E7E7'
              animationDuration={500}
              loading={true}
              active
              tWidth={width * .9}
              pRows={0}
              tHeight={120}
              pWidth={width * .9}
              listSize={1}
              containerStyles={{
                height: (height * .4) / 3,
                margin: 10, marginBottom: 0, marginTop: 20
              }}
              title={true} />
          </View>
        }
      </ScrollView>
    )
  }
}
const mapStateToProps = (state) => ({
  programme: state.programmes.programmes,
  isLoading: state.programmes.isLoading,
  lang: state.programmes.lang,
  user: state.userLogin.user,
  isFirstlogin: state.resetFirstLogin.isFirstLogin,
  walkthroungh: state.resetFirstLogin.walkthroungh,
  banner: state.resetBanner.isBannerClose,
})
export default connect(mapStateToProps)((copilot(
  {
    tooltipComponent: (props) => <ToolTip {...props} isHomePage={true} />,
    svgMaskPath: circleSvgPath,
    stepNumberComponent: StepNumber,
    tooltipStyle: styles,
    animated: true,
    overlay: 'svg',
  })(App)))

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bottomModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  langSelct: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
    width: 250,
    borderRadius: 10
  },
  content1: {
    backgroundColor: 'rgb(252, 246, 240)',
    width: width,
    height: height
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 15,
    color: PRIMARY_COLOR,
    fontFamily: FONT_MULI_REGULAR
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 5
  },
  text1: {
    fontFamily: FONT_MULI_BOLD,
    fontSize: 15,
    color: '#b38806'
  },
  text: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    color: '#000'
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PRIMARY_COLOR,
  },
  button: {
    height: 45,
    width: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b38806',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  icons: {
    marginTop: 20,
    width: width / 3.3,
  },
  iconImage: {
    height: width / 4.3,
    width: width / 3.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImags: {
    height: width / 5.4,
    width: width / 5.4,
    borderRadius: width / 2,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: .5,
    elevation: 2,
    height: width / 5.4,
    width: width / 5.4,
    borderRadius: width / 2,
    backgroundColor: '#fff'
  },
  banner: {
    height: width / 1.4,
    width: width
  },
  iconTextbox: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  iconText: {
    fontFamily: FONT_MULI_REGULAR,
    lineHeight: 18,
    fontSize: 13,
    color: '#b38806',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0.1, height: 0.1 },
    textShadowRadius: 0.1
  },
  iconRender: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  close: {
    alignSelf: 'flex-end',
    paddingHorizontal: 7,
    paddingVertical: 7
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 1.2
  },
}
)
