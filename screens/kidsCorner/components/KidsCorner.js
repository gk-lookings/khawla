import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { KIDS_CORNER, LESSON_COURSES } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Feather from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Little_Artist")}</Text>
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
            article: [],
            isLoading: true,
            articleIntro: '',
            isList: false,
            page: 2,
            isLastPage: false,
        }
        this.onPress = this.onPress.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.getData = this.getData.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
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
        Api('get', LESSON_COURSES + `?language=${language}&page=${1}&age=1`)
            .then((response) => {
                let res = response.items
                if (response) {
                    console.log('littleee', response)
                    this.setState({
                        article: res,
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
        let page = this.state.page
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', LESSON_COURSES + `?language=${language}&page=${page}&age=1`)
            .then((response) => {
                let res = response.items
                if (response) {
                    console.log('littleee', response)
                    this.setState({
                        article: this.state.article.concat(res),
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

    renderArticle({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('KidsCornerLessons', { articledata: item })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
                    <Text style={[styles.subItem, { fontWeight: '600' }, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.displayDate}</Text>
                    <Text numberOfLines={1} style={[styles.subItem, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.shortDescription}</Text>
                </View>
                <Image source={{ uri: item.picture }} style={styles.imageStyle} />
            </TouchableOpacity>
        )
    }

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('KidsCornerLessons', { articledata: item })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
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
            <View style={styles.mainContainer}>
                {this.state.isLoading ?
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                    :
                    <View showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <View style={styles.showItem}>
                                <Text style={styles.showingText}>( {this.state.article.length} )</Text>
                            </View>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={23} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
                        </View>
                        {this.state.isList &&
                            <FlatList
                                data={this.state.article}
                                renderItem={this.renderArticle}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 300 }}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.loadData}
                            />
                        }
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.article}
                                renderItem={this.renderArticleGrid}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                ListFooterComponent={this.footerView}
                                onEndReached={this.loadData}
                            />
                        }
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
    itemContainer: {
        height: 90,
        flexDirection: 'row',
        width: width * .92,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
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
    imageStyle: {
        height: 65,
        width: 65,
        borderRadius: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    itemView: {
        height: '100%',
        width: '82%',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    showItem: {
        justifyContent: 'center',
        height: 30
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
    },
    itemContainerGrid: {
        height: height / 4,
        width: width * .45,
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginLeft: width * .033,
        marginBottom: 30,
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
    itemViewGrid: {
        height: 35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyleGrid: {
        height: height / 5,
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
    gridView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        height: 40,
        flexDirection: 'row',
        width: width - 40,
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height * 1
    },
})
export default connect(mapStateToProps)(App)