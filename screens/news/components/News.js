import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD } from '../../../assets/fonts'
import Api from '../../../common/api'
import { NEWS } from '../../../common/endpoints'
import i18n from '../../../i18n'
const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mediaText}>{i18n.t("Latest_updates")}</Text>
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
            news: [],
            isLoading: true
        }
        this.onPress = this.onPress.bind(this)
        this.renderArtists = this.renderArtists.bind(this)
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', NEWS + `?language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    this.setState({
                        news: responseJson,
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

    renderArtists({ item }) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("NewsDetail", { news: item })} style={styles.mediaContainer}>
                <View style={{ width: '100%' }}>
                    <Text style={styles.titleDate}>{item.newsDate}</Text>
                </View>
                <Image resizeMode="stretch" source={{ uri: `data:image/gif;base64,${item.newsPicture}` }} style={styles.imageContainer} />
                <View style={styles.titleText}>
                    <Text numberOfLines={1} style={styles.title}>{item.newsTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading &&
                    <ScrollView style={styles.mainContainer}>
                        <FlatList
                            data={this.state.news}
                            renderItem={this.renderArtists}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: height * .4 }}
                            numColumns={2}
                            style={{ marginTop: 5 }}
                        />
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
    title: {
        fontSize: 10,
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
        paddingTop: 5,
        paddingBottom: 5
    },
    titleDate: {
        fontSize: 10,
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD,
        paddingTop: 5,
        paddingBottom: 5
    },
    mediaText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    imageContainer: {
        height: 150,
        width: '100%',
        borderColor: '#999999'
    },
    mediaContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        width: width * .49,
        backgroundColor: '#fff',
        borderWidth: .5,
        margin: 2,
        borderRadius: 5
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: { 
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
})
export default connect(mapStateToProps)(App)