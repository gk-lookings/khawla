import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR } from '../../../assets/fonts'
import Api from '../../../common/api'
import { ARTISTS_COUNTRY } from '../../../common/endpoints'
import i18n from '../../../i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text numberOfLines={1} style={styles.mediaText}>{i18n.t("artists_World")}</Text>
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
            country: [],
            isLoading: false,
            isList: true,
            category: this.props.navigation.getParam('country', null),
        }
        this.onPress = this.onPress.bind(this)
        this.renderArt = this.renderArt.bind(this)
        this.getData = this.getData.bind(this)
        this.renderArticleGrid = this.renderArticleGrid.bind(this)
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

        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', ARTISTS_COUNTRY + `?language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("Art,.,..,...", responseJson)
                    this.setState({
                        country: responseJson,
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

    renderArticleGrid({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistListCountry', { item: item, category: this.state.category })} style={styles.itemContainerGrid}>
                <View style={styles.imageStyleGridView}>
                    <Image source={{ uri: item.countryPicture }} style={styles.imageStyleGrid} resizeMode="contain" />
                </View>
                <View style={styles.itemViewGrid}>
                    <Text numberOfLines={1} style={[styles.eventTitleGrid, this.props.lang == 'ar' && { fontSize: 15 }]}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderArt({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ArtistListCountry', { item: item, category: this.state.category })} style={[styles.itemContainer, this.props.lang == 'en' && { flexDirection: 'row-reverse' }]}>
                <View style={styles.arrow}>
                    {/* {this.props.lang == 'ar' ?
                        <IconMaterial name='keyboard-arrow-left' size={28} color={'#999999'} />
                        :
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    } */}
                </View>
                <View style={styles.itemView}>
                    <Text numberOfLines={1} style={[styles.eventTitle, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.title}</Text>
                </View>
                <Image source={{ uri: item.countryPicture }} style={styles.imageStyle} resizeMode="contain" />
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.showItem}>
                            <Text style={styles.showingText}>( {this.state.country.length} )</Text>
                        </View>
                        <View style={styles.iconHead}>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.props.navigation.navigate('CountryMapWorld',{category: this.state.category})}>
                                <Icon name="map" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.gridView} onPress={() => this.setState({ isList: !this.state.isList })}>
                                {!this.state.isList ? <Feather name="list" size={25} /> : <Icon name="view-grid" size={23} />}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.isList &&
                            <FlatList
                                data={this.state.country}
                                renderItem={this.renderArt}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        }
                        {!this.state.isList &&
                            <FlatList
                                data={this.state.country}
                                renderItem={this.renderArticleGrid}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                style={{ alignSelf: 'center' }}
                            />
                        }
                    </ScrollView>
                </ScrollView>
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
        flexDirection: 'row'
    },
    showItem: {
        width: '80%',
        justifyContent: 'center',
    },
    gridView: {
        width: '21%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    showingText: {
        fontFamily: FONT_MULI_BOLD,
        fontSize: 14,
        marginLeft: 15
    },
    imageStyleGrid: {
        height: 100,
        width: '100%',
        alignSelf: 'center',
    },
    imageStyleGridView: {
        height: 100,
        width: '100%',
        alignSelf: 'center',
    },
    itemContainerGrid: {
        height: 160,
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
    iconHead: {
        flexDirection: 'row'
    },
    mediaText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
})
export default connect(mapStateToProps)(App)