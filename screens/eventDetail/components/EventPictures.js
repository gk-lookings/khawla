import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Animated, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { SECONDARY_COLOR, PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { EVENT_PICTURE } from '../../../common/endpoints'
import i18n from '../../../i18n'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from "react-native-modal"

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
            event: [],
            isLoading: true,
            page: 1,
            isLastPage: false,
            total: '',
            events: this.props.navigation.getParam('event', null),
            imageView: '',
            isVisibleImage: false
        }
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
        Api('get', EVENT_PICTURE + `?eventId=${this.state.events.eventId}&language=${language}` + `&page=${page}`)
            .then((response) => {
                console.log('eveents...final.', response)
                if (response) {
                    let res = response.entities
                    this.setState({
                        event: this.state.event.concat(res),
                        isLoading: false,
                        page: this.state.page + 1,
                        isLastPage: response.isLastPage ? true : false,
                        total: response.total
                    })
                }
                else {
                    this.setState({
                        isLoading: false
                    })
                }
            })


    }



    renderLectureGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.setState({ imageView: item, isVisibleImage: true })} style={styles.itemContainerGrid}>
                <Image source={{ uri: item }} style={styles.imageStyleGrid} />
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
                        <FlatList
                            data={this.state.event}
                            renderItem={this.renderLectureGrid}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            numColumns={3}
                            ListFooterComponent={this.footerView}
                            onEndReached={this.getData}
                            style={{ alignSelf: 'center', marginTop: 10 }}
                        />
                    </View>
                }
                <Modal
                    isVisible={this.state.isVisibleImage}
                    hideModalContentWhileAnimating={true}
                    animationIn='zoomIn'
                    animationOut='zoomOut'
                    hasBackdrop={true}
                    backdropColor='black'
                    backdropOpacity={.9}
                    onBackButtonPress={() => this.setState({ isVisibleImage: false })}
                    onBackdropPress={() => this.setState({ isVisibleImage: false })}
                    style={{}}
                >
                    <View style={styles.imageFull}>
                        <Image source={{ uri: this.state.imageView }} resizeMode="contain" style={styles.imageFull} />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ isVisibleImage: false })} style={{ marginTop: -10 }}>
                        <AntDesign name="closecircleo" size={20} color="#fff" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </Modal>
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
        height: width / 3 - 2,
        width: width / 3 - 2,
        alignItems: 'center',
        alignSelf: 'center',
    },
    imageStyleGrid: {
        height: '95%',
        width: '95%',
        alignSelf: 'center',
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
    imageFull: {
        height: 500,
        width: width * .97,
        alignSelf: 'center',
        borderRadius: 4
    },
})
export default connect(mapStateToProps)(App)