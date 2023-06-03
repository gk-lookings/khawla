import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native'
import { connect } from 'react-redux'
import Images from '../../../assets/images'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD } from '../../../assets/fonts'
import { TabView, TabBar } from 'react-native-tab-view';
import i18n from '../../../i18n'
import AntDesign from 'react-native-vector-icons/AntDesign'

const { height, width } = Dimensions.get('screen')

class App extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam('title',
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15,marginBottom:10 ,width:width/2}}>
      <Image resizeMode ='contain' source={Images.logoLetterNew} style={{ height: 45, width: width / 2 }} />
      <View>
        {/* <Image source={Images.logo} style={{ height: 39.2, width: 9.28, marginLeft: 5 }} /> */}
      </View>
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
        <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.mainHeader}>
          <IconMaterial name='sort' size={30} color='black' />
        </TouchableOpacity>
      ),       
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('onPress')} style={{ marginRight: 10 }}>
            <AntDesign name='closecircleo' size={20} color={'#000'} style={{}} />
        </TouchableOpacity>),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      programmes: "",
    }
    this.renderArticle = this.renderArticle.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ onPress: this.onPress })
  }


  onPress() {
    this.props.navigation.navigate('Home')
}

  renderArticle({ item }) {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("ProgrammeDetail", { data: item })} style={styles.listStyle}>
        <Image
          source={{ uri: item.eventCover }}
          style={styles.imageStyle}
        />
        <Text style={styles.programText}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={{ flex: 1 }}>
          {this.props.isLoading ?
            <View style={styles.indicator}>
              <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
            :
            <FlatList
              data={this.props.programme}
              renderItem={this.renderArticle}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          }
        </ScrollView>
      </View>
    )
  }
}
const mapStateToProps = (state) => ({
  programme: state.programmes.programmes,
  isLoading: state.programmes.isLoading,
  lang: state.programmes.lang
})
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#fff',
    height: height/1.2,
    alignItems:'center',
    justifyContent:'center'
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    height: 40
  },
  mainHeader: {
    paddingRight: 15,
    paddingLeft: 15
  },
  programText: {
    fontSize: 17,
    fontFamily: FONT_MULI_BOLD,
    textAlign: 'center'
  },
  imageStyle: {
    height: 200,
    width: '100%',
    alignSelf: 'center'
  },
  listStyle: {
    width: width - 20,
    alignSelf: 'center',
    backgroundColor: 'rgb(255, 250, 245)',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 2,
  }
})
export default connect(mapStateToProps)(App)