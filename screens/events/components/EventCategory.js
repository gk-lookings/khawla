import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, Animated, Easing, ImageBackground, ActivityIndicator, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD, FONT_BOLD, FONT_SEMI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTWORKS, EVENT_CATEGORY } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Images from '../../../assets/images'
import Animation from 'lottie-react-native';
import Modal from 'react-native-modal'

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
            album: [],
            album_cat: [],
            isLoading: true,
            isList: false,
            progress: new Animated.Value(0),
            isGrid: false,
            isCard: true,
            openModel: false
        }
        this.onPress = this.onPress.bind(this)
        this.getData = this.getData.bind(this)
        this.renderAlbums = this.renderAlbums.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }
    componentWillMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getData();
            //Put your Data loading function here instead of my this.LoadData()
        });
    }

    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', EVENT_CATEGORY + `?language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log('albumyyy..list', responseJson)
                    this.setState({
                        album: responseJson,
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

    onPress() {
        this.props.navigation.navigate('Home')
    }



    renderAlbums({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Events', { event: item })} style={styles.itemContainerList}>
                <Image source={{ uri: item.picture }} style={styles.imageContainer} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: height / 1.2 }}>
                        <ActivityIndicator color={PRIMARY_COLOR} size="large" />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContainer1}>
                        <View style={styles.showBar}>
                            <Text>( {this.state.album.length} )</Text>
                        </View>
                        {this.state.album.length > 0 &&
                            <FlatList
                                data={this.state.album}
                                renderItem={this.renderAlbums}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        }
                    </ScrollView>
                }
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang,
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mainContainer1: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    itemContainerList: {
        width: width - 30,
        alignItems: 'center',
        alignSelf: 'center',
        margin: 7,
        backgroundColor: '#fff',
        marginBottom: 3,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    itemContainerListCat: {
        alignItems: 'center',
        margin: 7,
        backgroundColor: '#fff',
        marginBottom: 3,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        borderWidth: .5,
        borderColor: PRIMARY_COLOR
    },
    title: {
        fontSize: 16,
        fontFamily: FONT_BOLD
    },
    title: {
        fontSize: 14,
        fontFamily: FONT_SEMI_BOLD
    },
    mainTitleText: {
        fontSize: 18,
        fontWeight: '700'
    },
    imageContainer: {
        height: 100,
        width: 100,
    },
    titleContainer: {
        marginLeft: 10,
        width: width - 150,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerBar: {
        height: 40,
        backgroundColor: '#fff',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: .1,
        elevation: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: 18,
        fontFamily: FONT_SEMI_BOLD,
    },
    showBar: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 5,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    catButton: {
        height: 30,
        backgroundColor: PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 5,
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    catText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: FONT_BOLD
    },
    modelcat: {
        width: width - 100,
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff'
    },
    seperator: {
        height: 1,
        backgroundColor: 'grey',
        width: width - 100,
        marginLeft: -10
    },
    modelTitle: {
        fontSize: 16,
        fontFamily: FONT_BOLD,
        color: PRIMARY_COLOR,
        padding: 10,
        paddingVertical: 5,
        alignSelf: 'center'
    },
    mainHeader: {
        paddingRight: 15,
        paddingLeft: 15
    },
})
export default connect(mapStateToProps)(App)