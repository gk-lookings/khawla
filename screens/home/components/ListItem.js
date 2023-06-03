import React, { Component, Fragment } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { COLOR_SECONDARY, BORDER_COLOR } from '../../../assets/color'
import { FONT_MULI_BOLD, FONT_MULI_REGULAR, FONT_LIGHT } from '../../../assets/fonts'
import Entypo from 'react-native-vector-icons/Entypo'

const { height, width } = Dimensions.get('screen')

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: props.title,
        }
    }
    componentDidMount() {
    }

    render() {
        const { title, image, date, pageName, item } = this.props
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate(pageName, { item: item })} style={styles.renderImage}>
                <View style={[styles.loader, { backgroundColor: '#fff' }]}>
                    <Entypo name="image" size={30} />
                    <Image source={{ uri: image }} imageStyle={{ borderRadius: 7 }} style={styles.imageSlider} />
                </View>
                <View style={styles.darkLight}>
                    <Text numberOfLines={1} style={styles.imageText }>{title}</Text>
                    {date != ' ' &&
                        <Text style={styles.imageTextDate}>{date}</Text>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}
const mapStateToProps = (state) => ({
    lang: state.programmes.lang
})
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: BORDER_COLOR
    },
    imageContainer: {
        height: 90,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainer: {
        height: '100%',
        width: '60%',
        padding: 10,
    },
    closeButtenContainer: {
        height: '100%',
        width: '10%',
        marginTop: 10
    },
    mainTitleText: {
        color: '#000',
        fontSize: 19,
        alignSelf: 'center',
        fontFamily: FONT_MULI_BOLD
    },
    image: {
        height: '70%',
        width: '70%'
    },
    productName: {
        fontSize: 16,
        fontFamily: FONT_MULI_BOLD
    },
    description: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    quantity: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    price: {
        fontSize: 15,
        fontFamily: FONT_MULI_REGULAR
    },
    priceText: {
        fontSize: 13,
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    imageText: {
        fontSize: 14,
        textAlign: 'right',
        fontFamily: FONT_MULI_REGULAR,
        fontSize: 14, 
        marginTop: 5
    },
    imageTextDate: {
        fontSize: 11,
        textAlign: 'right',
        fontFamily: FONT_LIGHT,
        color: COLOR_SECONDARY
    },
    darkLight: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        marginTop: 8
    },
    renderImage: {
        paddingTop: 10,
        paddingBottom: 5,
        shadowColor: '#000000',
        marginLeft: 10,
        width: width / 1.5
    },
    imageSlider: {
        width: '100%',
        height: height * .20,
        borderRadius: 7,
        position: 'absolute',
    },
    loader: {
        width: '100%',
        height: height * .18,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6e6',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: .6,
        shadowOpacity: .5,
        elevation: .9
    },
})
export default connect(mapStateToProps)(App)