import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions,ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ART_GALLERY_OLD } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Art_gallery")}</Text>
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
            artGallery: [],
            isLoading: true,
            isList: true,
            page: 2,
            isLastPage: false,
            eventData: this.props.navigation.getParam('event', null)
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
            this.setState({page: 2})
        }
    }

    getData() {

        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ART_GALLERY_OLD + `?language=${language}&page=${1}&eventId=${this.state.eventData.eventId}`)
            .then((responseJson) => {
                let res = responseJson.items
                if (responseJson) {
                    console.log("Art,.,..,...", responseJson)
                    this.setState({
                        artGallery: res,
                        isLoading: false,
                        isLastPage: responseJson.isLastPage ? true : false,
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
        Api('get', ART_GALLERY_OLD + `?language=${language}&page=${page}`)
            .then((responseJson) => {
                let res = responseJson.items
                if (responseJson) {
                    console.log("Art,.,..,...", responseJson)
                    this.setState({
                        artGallery: this.state.artGallery.concat(res),
                        isLoading: false,
                        isLastPage: responseJson.isLastPage ? true : false,
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtGalleryDetail', { artdata: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.artPicture }} style={styles.imageStyleGrid} resizeMode="contain" />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.artTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArt({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtGalleryDetail', { artdata: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.arrow}>
                    {/* {this.props.lang == 'ar' ?
                        <IconMaterial name='keyboard-arrow-left' size={28} color={'#999999'} />
                        :
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    } */}
                </View>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.artTitle}</Text>
                </View>
                <Image source={{ uri: item.artPicture }} style={styles.imageStyle} resizeMode="contain" />
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
                    <View style={styles.header}>
                        <View style={styles.showItem}>
                            <Text style={styles.showingText}>( {this.state.artGallery.length} )</Text>
                        </View>
                        <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                            {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                        </TouchableOpacity>
                    </View>
                    <View>
                        {this.state.isList &&
                            <FlatList
                                data={this.state.artGallery}
                                renderItem={this.renderArt}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.loadData}
                                contentContainerStyle={{paddingBottom: 100}}
                            />
                        }
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.artGallery}
                                renderItem={this.renderArticleGrid}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.loadData}
                                contentContainerStyle={{paddingBottom: 100}}
                            />
                        }
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
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: PRIMARY_COLOR,
    },
    itemContainer: {
        height: 85,
        width: '95%',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        flexDirection: 'row'
    },
    arrow: {
        height: '100%',
        width: width * .1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
    },
    imageStyle: {
        height: 60,
        width: 60,
        marginLeft: 10,
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
        height: 40,
        flexDirection: 'row',
        width: width-40,
        alignSelf:'center',
        justifyContent:'space-between'
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
        height: height/5,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    imageStyleGridView: {
        height: height/5,
        width: '100%',
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: height/4,
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
        height: height * 1
    },
})
export default connect(mapStateToProps)(App)