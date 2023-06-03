import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { LESSON_COURSES } from '../../../common/endpoints'
import i18n from '../../../i18n'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Distance_Learning")}</Text>
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
            courses: [],
            isLoading: true,
            articleIntro: '',
            isList: true,
            page: 2,
            isLastPage: true
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
        this.getData = this.getData.bind(this)
        this.footerView = this.footerView.bind(this)
        this.loadData = this.loadData.bind(this)
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
        Api('get', LESSON_COURSES + `?language=${language}&page=${1}`)
            .then((response) => {
                if (response) {
                    console.log('courseeeeeee......s', response)
                    let res = response.items
                    this.setState({
                        courses: res,
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
        Api('get', LESSON_COURSES + `?language=${language}&page=${page}`)
            .then((response) => {
                if (response) {
                    console.log('courseeeeeee......s', response)
                    let res = response.items
                    console.log('courseeeeeee......sdsfdsfdsgdg', this.state.courses.concat(res))
                    this.setState({
                        courses: this.state.courses.concat(res),
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


    onPressItem({ item }) {
        if (this.props.user) {
            this.props.navigation.navigate("OnlineSection", { courses: item })
        }
        else if (item.isLoginRequired) {
            this.setState({ isVisible: true })
        }
        else {
            this.props.navigation.navigate("OnlineSection", { courses: item })
        }
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

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onPressItem({ item: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
                    <Text style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.displayDate}</Text>
                    <Text numberOfLines={1} style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <Image source={{ uri: item.picture }} style={styles.imageStyle} />
            </TouchableOpacity>
        )
    }

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.onPressItem({ item: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.title}</Text>
                    <Text style={[styles.subItemGrid, { fontWeight: '600' }]}>{item.displayDate}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <View style={styles.showItem}>
                                <Text style={[styles.showingText, this.props.lang == 'ar' && { textAlign: 'left' }]}>( {this.state.courses.length} )</Text>
                            </View>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {this.state.isList &&
                                <FlatList
                                    data={this.state.courses}
                                    renderItem={this.renderArticle}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                />
                            }
                            {!this.state.isList &&
                                <FlatList
                                    data={this.state.courses}
                                    renderItem={this.renderArticleGrid}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={2}
                                    style={{ alignSelf: 'center' }}
                                    ListFooterComponent={this.footerView}
                                    onEndReached={this.loadData}
                                />
                            }
                        </ScrollView>
                    </ScrollView>
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
    itemContainer: {
        height: 95,
        flexDirection: 'row',
        width: width * .92,
        alignItems: 'center',
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
        marginTop: 15

    },
    arrow: {
        height: '100%',
        width: width * .08,
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
    subItem: {
        fontSize: 12,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'right',
        color: COLOR_SECONDARY,
        lineHeight: 20
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
        color: COLOR_SECONDARY
    },
    imageStyle: {
        height: 65,
        width: '17%',
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    imageStyleGrid: {
        height: height / 5,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 15
    },
    itemView: {
        height: '100%',
        width: '82%',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    itemViewGrid: {
        height: 45,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
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
        width: '100%',
    },
    showItem: {
        width: '80%',
        justifyContent: 'center',
    },
    gridView: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 15
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
    imageStyleGridView: {
        height: height / 5,
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
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 1
    },
})
export default connect(mapStateToProps)(App)