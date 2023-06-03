import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, ActivityIndicator, Linking, Platform, TouchableNativeFeedbackBase } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { PRIMARY_COLOR, COLOR_SECONDARY } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT } from '../../../assets/fonts'
import Api from '../../../common/api'
import { MEDIA } from '../../../common/endpoints'
import i18n from '../../../i18n'
import AutoHeightWebView from 'react-native-autoheight-webview'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.getParam('title',
                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * .6 }}>
                    <Text style={styles.mainTitleText}>{i18n.t("Media_Center")}</Text>
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
            media: [],
            isLoading: true,
            itemLogo: [],
            mediaData: []
        }
        this.onPress = this.onPress.bind(this)
        this.renderView = this.renderView.bind(this)
        this.renderArticle = this.renderArticle.bind(this)
        this.renderHeader = this.renderHeader.bind(this)
        this.labelStyle = this.labelStyle.bind(this)
        this.renderArticleAll = this.renderArticleAll.bind(this)
        this.getData = this.getData.bind(this)
        // this.render = this.render.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.props.navigation.setParams({ onPress: this.onPress })
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', MEDIA + `?language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("meediaa", responseJson)
                    this.setState({
                        media: responseJson?.items,
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

    componentDidUpdate(prevProps) {
        if (prevProps.lang != this.props.lang) {
            this.getData()
        }
    }

    onPress() {
        this.props.navigation.navigate('Home')
    }

    renderView() {
        var language = this.props.lang == 'ar' ? 1 : 2
        Api('get', MEDIA + `?language=${language}` + `&mediaCompanyId=${this.state.itemLogo.mediaCompanyId}`)
            .then((responseJson) => {
                if (responseJson) {
                    console.log("meediaa", responseJson)
                    this.setState({
                        mediaData: responseJson.items,
                    })
                }
            })
        const lapsList = this.state.mediaData
        return (
            <View>
                {lapsList.map((item) =>
                    <View key={item.key} style={styles.mediaRender}>
                        <Text numberOfLines={2} style={styles.title}>{item.articleTitle}</Text>
                        <Text style={[styles.companyName, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.mediaCompanyName}</Text>
                        <Text style={[styles.date, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleDisplayDate}</Text>
                        <Image
                            source={{ uri: item.articlePicture }}
                            style={styles.imageContainer}
                            resizeMode="contain"
                        />
                        <View>
                            {Platform.OS === 'android' ?
                                <AutoHeightWebView
                                    style={styles.WebView}
                                    customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
                                }
                                p {
                                    font-size: 17px;
                                }`
                                    }
                                    files={[{
                                        href: 'cssfileaddress',
                                        type: 'text/css',
                                        rel: 'stylesheet'
                                    }]}
                                    source={{ html: item.articleDescription }}
                                    scalesPageToFit={true}
                                    viewportContent={'width=device-width, user-scalable=yes'}
                                    ref={ref => {
                                        this.webview = ref;
                                    }}
                                    onShouldStartLoadWithRequest={event => {
                                        if (event.url) {
                                            this.webview.stopLoading();
                                            Linking.openURL(event.url);
                                        }
                                    }}
                                />
                                :
                                <AutoHeightWebView
                                    style={styles.WebView}
                                    customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
                                }
                                p {
                                    font-size: 17px;
                                }`
                                    }
                                    files={[{
                                        href: 'cssfileaddress',
                                        type: 'text/css',
                                        rel: 'stylesheet'
                                    }]}
                                    source={{ html: item.articleDescription }}
                                    scalesPageToFit={true}
                                    viewportContent={'width=device-width, user-scalable=yes'}
                                    ref={ref => {
                                        this.webview = ref;
                                    }}
                                    onNavigationStateChange={event => {
                                        if (event.url) {
                                            this.webview.stopLoading();
                                            Linking.openURL(event.url);
                                        }
                                    }}
                                />
                            }
                        </View>
                    </View>
                )}
            </View>
        )
    }

    renderArticle({ item, index }) {
        var data = item.articleDescription
        var newDescription = data.split('<br>').join('\n')
        return (
            <TouchableOpacity onPress={() => this.setState({ itemLogo: item })} style={styles.mediaContainer}>
                {/* <Image
                    source={{ uri: item.mediaCompanyLogo }}
                    style={{ height: 25, width: 60 }}
                    resizeMode="contain"
                    borderRadius={60}
                /> */}
                <Text style={styles.companyName1} numberOfLines={1}>{item.mediaCompanyName}</Text>
                <View style={{ height: '10%' }}>
                    {this.state.itemLogo.articleDescription == item.articleDescription &&
                        <View style={styles.selected}>

                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    labelStyle() {
        <View style={{ backgroundColor: 'violet', height: 8, width: 50 }}>

        </View>
    }

    renderHeader() {
        return (
            <TouchableOpacity onPress={() => this.setState({ itemLogo: '' })} style={[styles.mediaContainer, { marginLeft: 15 }]}>
                <View style={styles.allCategory}>
                    <Text style={{ fontFamily: FONT_MULI_BOLD }}>All</Text>
                </View>
                <View style={{ height: '10%' }}>
                    {this.state.itemLogo.articleDescription == undefined &&
                        <View style={styles.selected}>

                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }
    renderArticleAll({ item }) {
        return (
            <View style={styles.mediaRender}>
                <View style={{ width: '100%' }}>
                    <Text numberOfLines={2} style={styles.title}>{item.articleTitle}</Text>
                    <Text style={[styles.companyName, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.mediaCompanyName}</Text>
                    <Text style={[styles.date, this.props.lang == 'en' && { textAlign: 'left' }]}>{item.articleDisplayDate}</Text>
                    <Image
                        source={{ uri: item.articlePicture }}
                        style={styles.imageContainer}
                        resizeMode="contain"
                    />
                    <View>
                        {Platform.OS === 'android' ?
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
                                }
                                p {
                                    font-size: 17px;
                                }`
                                }
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                source={{ html: item.articleDescription }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                ref={ref => {
                                    this.webview = ref;
                                }}
                                onShouldStartLoadWithRequest={event => {
                                    if (event.url) {
                                        this.webview.stopLoading();
                                        Linking.openURL(event.url);
                                    }
                                }}
                            />
                            :
                            <AutoHeightWebView
                                style={styles.WebView}
                                customStyle={`
                                * {
                                    font-family: 'Cairo-Regular';
                                }
                                p {
                                    font-size: 17px;
                                }`
                                }
                                files={[{
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet'
                                }]}
                                source={{ html: item.articleDescription }}
                                scalesPageToFit={true}
                                viewportContent={'width=device-width, user-scalable=yes'}
                                ref={ref => {
                                    this.webview = ref;
                                }}
                                onNavigationStateChange={event => {
                                    if (event.url) {
                                        this.webview.stopLoading();
                                        Linking.openURL(event.url);
                                    }
                                }}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const newArray = [];
         this.state.media.forEach(obj => {
            if (!newArray.some(o => o.mediaCompanyId === obj.mediaCompanyId)) {
                newArray.push({ ...obj })
            }
        });

        return (
            <View style={styles.mainContainer}>
                {this.state.isLoading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                }
                {!this.state.isLoading && 
                    <View style={styles.mainContainer}>
                        <View>
                            <View style={{ height: 50 }}>
                                <FlatList
                                    data={newArray}
                                    renderItem={this.renderArticle}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal={true}
                                    style={{}}
                                    ListHeaderComponent={this.renderHeader}
                                />
                            </View>
                        </View>
                        {this.state.itemLogo.articleDescription != undefined ?
                            <ScrollView>
                                {this.renderView()}
                            </ScrollView>
                            :
                            <View style={{}}>
                                <FlatList
                                    data={this.state.media}
                                    renderItem={this.renderArticleAll}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 150 }}
                                    style={{}}
                                />
                            </View>

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
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    content: {
        textAlign: 'justify',
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        marginTop: 20,
    },
    imageContainer: {
        width: '100%',
        height: 400,
        marginTop: 10
    },
    mediaContainer: {
        marginTop: 5,
        marginRight: 15,
        height: 40,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    date: {
        fontSize: 14,
        textAlign: 'right',
        color: COLOR_SECONDARY,
        fontFamily: FONT_LIGHT
    },
    companyName: {
        fontSize: 14,
        textAlign: 'right',
        fontFamily: FONT_MULI_BOLD
    },
    companyName1: {
        fontSize: 14,
        fontFamily: FONT_MULI_BOLD
    },
    allCategory: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        height: 2,
        width: 48,
        backgroundColor: PRIMARY_COLOR,
        marginTop: 6,
        alignSelf: 'center',
        borderRadius: 10
    },
    mediaRender: {
        padding: 10,
        backgroundColor: '#fff',
        margin: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 10,
        paddingBottom: 40
    },
    WebView: {
        width: '95%',
        marginTop: 20,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'center'
    },
})
export default connect(mapStateToProps)(App)