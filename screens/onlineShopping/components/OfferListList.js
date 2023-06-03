import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { COLOR_SECONDARY, NAV_COLOR, COLOR_PRIMARY, BORDER_COLOR, DRAWER_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY, FONT_BOLD } from '../../../assets/fonts'
import { store } from '../../../App'
// import { select } from '../../../common/utils'
// import Api from '../../../lib/api'
// import { WISHLIST } from '../../../config/endpoints'
// import { updateOfferList } from '../actions'
import Images from '../../../assets/images'


class App extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            isFavourite: props.item.item.isWishList
        }
    }

    formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    onItemPress(item) {
        console.log('prductsssssssssssssssss', item)
        this.props.navigation.navigate('OnlineShoppingDetail', { products: item })
    }

    render() {
        const { item } = this.props.item
            return (
                <TouchableOpacity style={styles.card} onPress={() => this.onItemPress(item)}>
                    {/* <View style={styles.imageContainer}>
                        <Image source={{ uri: item.productThumpPicture }} style={styles.offerImage} />
                    </View>
                    <View style={styles.date}>
                        <View style={styles.daysContainer}>
                            <Text style={styles.days}>{item.categoryName}</Text>
                        </View>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{item.productName}</Text>
                    <Text numberOfLines={1} style={styles.suggestedPrice}>{item.productShortDescription}</Text>
                    <Text style={[styles.aud, { color: PRIMARY_COLOR }]}>{item.productPrice} USD</Text>
                    <Text style={styles.units}>{item.productStock} Units <Text style={{ color: 'green' }}>Available</Text></Text> */}
                </TouchableOpacity>
            )
    }
}

export default connect()(App)

const styles = StyleSheet.create({
    card: {
        width: '50%',
        padding: 15,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: BORDER_COLOR
    },
    grid: {
        width: '50%',
        padding: 15,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: BORDER_COLOR
    },
    stockOver: {
        position: 'absolute',
        top: 15,
        left: 15,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: '#7EB7E8',
        zIndex: 5
    },
    new: {
        fontSize: 10,
        fontFamily: FONT_PRIMARY,
        color: DRAWER_COLOR
    },
    iconContainer: {
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: BORDER_COLOR
    },
    favourite: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 5
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10,
        height: 150,
        width: 150,
    },
    offerImage: {
        height: 110,
        width: 110,
        resizeMode: 'contain'
    },
    offerListImage: {
        height: 125,
        width: 125,
        resizeMode: 'contain'
    },
    secure: {
        position: 'absolute',
        zIndex: 10,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'transparent',
        opacity: .9,
        backgroundColor: 'black'
    },
    textSecure: {
        fontSize: 22,
        fontFamily: FONT_BOLD,
        color: COLOR_PRIMARY,
        transform: [{ rotate: '315deg' }],
    },
    textContent: {
    },
    brand: {
        marginTop: 3,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: NAV_COLOR,
        lineHeight: 18,
    },
    title: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR,
        lineHeight: 23,
    },
    brandCode: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        lineHeight: 20
    },
    suggestedPrice: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        lineHeight: 20
    },
    aud: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: COLOR_PRIMARY,
        lineHeight: 23
    },
    units: {
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        lineHeight: 18
    },
    date: {
        alignItems: 'flex-end',
        marginBottom: 5
    },
    daysContainer: {
        marginTop: 5,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5AB38',
        borderRadius: 15
    },
    days: {
        fontSize: 12,
        fontFamily: FONT_PRIMARY,
        color: '#FFFFFF'
    },
    categoryName: {
        backgroundColor: '#E5AB38',
        paddingRight: 10 ,
    }
})

const style = StyleSheet.create({
    card: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    imageContainer: {
        paddingRight: 10
    },
    textContent: {
        flex: 1,
        marginLeft: 3
    },
    favourite: {
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    }
})