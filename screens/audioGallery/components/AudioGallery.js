import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Dimensions, ActivityIndicator, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import Api from '../../../common/api'
import { AUDIO_GALLERY } from '../../../common/endpoints'
import Modal from "react-native-modal"
import i18n from '../../../i18n'
import VideoPlayer from 'react-native-video-controls';
const { height, width } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Audio_Gallery")}</Text>
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
            audio: [],
            isVisible: false,
            item: '',
            isLoading: true,
            page: 2,
            isLastPage: false,
        }
        this.onPress = this.onPress.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.footerView = this.footerView.bind(this)
        this.getData = this.getData.bind(this)
        this.loadData = this.loadData.bind(this)
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        this.getData()
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
            this.setState({page: 2})
        }
    }

    getData(){
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', AUDIO_GALLERY + `?language=${language}&page=${1}`)
            .then((response) => {
                let res = response.items
                if (response) {
                    console.log('Audio gallery..', response)
                    this.setState({
                        audio: res,
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

        loadData(){
            var language = this.props.lang == 'ar' ? 1 : 2
            let page = this.state.page
            Api('get', AUDIO_GALLERY + `?language=${language}&page=${page}`)
                .then((response) => {
                    let res = response.items
                    if (response) {
                        console.log('Audio gallery..', response)
                        this.setState({
                            audio: this.state.audio.concat(res),
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
        this.props.navigation.navigate('Home')
    }

    renderItem({ item }) {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('AudioDetail', { audio: item })} style={styles.bookContainer}>
                    <View style={{ margin: 2 }}>
                        <ImageBackground
                            resizeMethod="resize"
                            source={{ uri: item.audioPicture }}
                            borderRadius={20}
                            style={styles.container}
                        >
                            <AntDesign name="playcircleo" size={40} color="grey" style={styles.iconContainer2} />
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
                <View style={styles.bookTitleContainer}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{item.audioTitle}</Text>
                    <Text style={styles.booksAuthor} numberOfLines={1}>{item.audioDescription}</Text>
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

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <SafeAreaView style={styles.mainContainer}>
                        <View>
                            <FlatList
                                data={this.state.audio}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.loadData}
                            />
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
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0
    },
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bookTitle: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: FONT_MULI_BOLD
    },
    booksAuthor: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: FONT_MULI_REGULAR
    },
    bookContainer: {
        backgroundColor: 'grey',
        height: height / 5,
        width: width / 2 - 30,
        elevation: 2,
        borderRadius: 18,
        alignSelf: 'center',
        marginLeft: 20,
        marginTop: 10
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 1
    },
    iconContainer2: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    }
})
export default connect(mapStateToProps)(App)