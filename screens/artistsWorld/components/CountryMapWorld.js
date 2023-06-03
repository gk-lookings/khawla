import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../../../assets/fonts'
import i18n from '../../../i18n'
import MapView, { Marker, } from 'react-native-maps'
import Api from '../../../common/api'
import { ARTISTS_COUNTRY } from '../../../common/endpoints'

const { height, width } = Dimensions.get('screen')
class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            country: [],
            isLoading: false,
            region: {
                latitude: 37.78825,
                longitude: 38.78825,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0922,
            },
            category: this.props.navigation.getParam('category', null),
        }
        this.onPress = this.onPress.bind(this)
        this.getData = this.getData.bind(this)
        this.fitToMarkersToMap = this.fitToMarkersToMap.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.fitToMarkersToMap()
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


    fitToMarkersToMap() {
        if (this.state.country && this.state.country.length > 0) {
            if (this.state.country.length == 1) {
                let region = {
                    ...this.state.country[0].location,
                    latitudeDelta: 0.51922,
                    longitudeDelta: 0.51922,
                }
                this.map.animateToRegion(region, 1000)
                return 0;
            }
            // this.map.fitToSuppliedMarkers(this.state.country.map((trip) => trip.tripId), true);
        }
    }

    render() {  
        console.log('categorryyyyy', this.state.category);                          
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={styles.map}
                        fitToElements={true}
                        ref={ref => { this.map = ref; }}

                    // region={{
                    //     latitude: 24.471758,
                    //     longitude: 54.385340,
                    //     latitudeDelta: 0.005,
                    //     longitudeDelta: 0.0021,
                    // }}
                    >
                        {this.state.country.map(marker => (
                            <Marker
                                coordinate={location = {
                                    latitude: marker.latitude,
                                    longitude: marker.longitude
                                }}
                                title={marker.title}
                                onPress={() => this.props.navigation.navigate('ArtistListCountry', { item: marker, category: this.state.category })}
                            />
                        ))}
                    </MapView>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('CountryList')} style={styles.backButton}>
                        <IconMaterial name='keyboard-arrow-left' size={32} color={'#000'} />
                    </TouchableOpacity>
                </View>
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
    itemContainer: {
        height: 95,
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
        fontSize: 13,
        fontFamily: FONT_MULI_REGULAR,
        textAlign: 'right',
        color: COLOR_SECONDARY
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
        width: '72%',
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
    map: {
        flex: 1,
    },
    backButton:{
        height: 55,
        width: 55,
        borderRadius: 30,
        backgroundColor: '#fff',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 15,
        left: 15,
        shadowColor: '#000000',
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1,
    }
})
export default connect(mapStateToProps)(App)