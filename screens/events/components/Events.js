import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Animated, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import { TabView, TabBar } from 'react-native-tab-view'
import Api from '../../../common/api'
import { EVENTS } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView } from 'react-native-gesture-handler'
const { height, width } = Dimensions.get('screen')

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title',
        <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
          <Text style={styles.mainTitleText}>{i18n.t("Events")}</Text>
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
      fadeValue: new Animated.Value(0),
      event_cat: this.props.navigation.getParam('event', null),
      event: [],
      isList: true,
      isLoading: true,
      page: 1,
      isLastPage: false,
      total: '',
      eventId: this.props.navigation.getParam('eventId', null),
    }
    this.renderLectures = this.renderLectures.bind(this)
    this.getData = this.getData.bind(this)
    this.renderLectureGrid = this.renderLectureGrid.bind(this)
    this.footerView = this.footerView.bind(this)
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
    var language = this.props.lang == 'ar' ? 1 : 2
    let page = this.state.page
    id = this.state.eventId == null ? this.state.event_cat.categoryId : this.state.eventId
    Api('get', EVENTS + `language=${language}` + `&eventCategory=${id}&page=${page}`)
      .then((response) => {
        console.log('eveents...final.', response)
        if (response) {
          let res = response.items
          this.setState({
            event: this.state.event.concat(res),
            isLoading: false,
            page: this.state.page + 1,
            isLastPage: response.isLastPage ? true : false,
            total: response.total
          })
        }
        else {
          isLoading = false
        }
      })


  }


  renderLectures({ item }) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('EventDetail', { item: item })} style={[styles.itemContainer, this.props.lang == 'ar' ? { flexDirection: 'row' } : { flexDirection: 'row-reverse' }]}>
        <View style={styles.itemView}>
          <Text style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
        </View>
        <View style={styles.imageView}>
          <Image source={{ uri: item.eventCover }} style={styles.imageStyle} />
        </View>
      </TouchableOpacity>
    );
  }

  renderLectureGrid({ item }) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('EventDetail', { item: item })} style={styles.itemContainerGrid}>
        <View style={styles.imageStyleGridView}>
          <Image source={{ uri: item.eventCover }} style={styles.imageStyleGrid} />
        </View>
        <View style={styles.itemViewGrid}>
          <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.title}</Text>
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
      <SafeAreaView style={styles.mainContainer}>
        {this.state.isLoading ?
          <View style={styles.activityIndicator}>
            <ActivityIndicator color={PRIMARY_COLOR} size="large" />
          </View>
          :
          <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Text style={styles.showingText}>( {this.state.total} )</Text>
              <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
              </TouchableOpacity>
            </View>
            {this.state.isList &&
              <FlatList
                data={this.state.event}
                ItemSeparatorComponent={this.renderHeader}
                renderItem={this.renderLectures}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 2 }}
                ListFooterComponent={this.footerView}
                onEndReached={this.getData}
              />
            }
            {!this.state.isList &&
              <FlatList
                data={this.state.event}
                renderItem={this.renderLectureGrid}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                ListFooterComponent={this.footerView}
                onEndReached={this.getData}
              />
            }
          </View>
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
  indicator: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    height: 42,
  },
  mainHeader: {
    paddingRight: 15,
    paddingLeft: 15
  },
  itemContainer: {
    height: 90,
    width: width - 40,
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  imageStyle: {
    height: 65,
    width: 65,
    borderRadius: 10,
  },
  subItem: {
    fontSize: 12,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: 'right',
    color: COLOR_SECONDARY,
    lineHeight: 20
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
    paddingRight: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'right',
    fontFamily: FONT_MULI_BOLD,
  },
  registrationView: {
    height: '18%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 3,
    alignSelf: 'flex-end'
  },
  regiText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: FONT_MULI_REGULAR
  },
  arrow: {
    height: '100%',
    width: width * .15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  header: {
    height: 40,
    flexDirection: 'row',
    width: width - 40,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  showItem: {
    width: '80%',
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
  itemContainerGrid: {
    height: 185,
    width: width * .45,
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginLeft: width * .033,
    marginBottom: 30,
  },
  imageStyleGridView: {
    height: 150,
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
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyleGrid: {
    height: 150,
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
  subItemGrid: {
    fontSize: 11,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: 'center',
    color: COLOR_SECONDARY,
    lineHeight: 16
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height / 1.2
  },
  mainTitleText: {
    color: '#000',
    fontSize: 19,
    alignSelf: 'center',
    fontFamily: FONT_MULI_BOLD
  },
})
export default connect(mapStateToProps)(App)