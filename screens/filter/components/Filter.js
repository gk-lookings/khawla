import React, { Component } from 'react'
import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { NAV_COLOR, COLOR_PRIMARY, BORDER_COLOR, DRAWER_COLOR, PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY } from '../../../assets/fonts'
import { getProduct, offerFilter, resetOffersList } from '../../onlineShopping/action'
// import { getContainerBuysList, containerFilter, resetContainerBuysList } from '../../containerBuys/actions'
// import { getConferenceOffers, conferenceFilter, resetConferenceOffers } from '../../specialEventsOffers/actions'
// import { getCatalogueOffers, catalogueFilter, resetCatalogueOffers } from '../../catalogueOffers/actions'
import { selectedCategory } from '../../filter/actions'
import { store } from '../../../App'
// import { select } from '../../../common/utils'


class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Filter',
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
                color: NAV_COLOR,
                fontSize: 18,
                fontFamily: FONT_SECONDARY, fontWeight: 'normal'
            },
            headerRight: (
                <TouchableOpacity style={{ padding: 10, paddingHorizontal: 15 }} onPress={navigation.getParam('onClear')}>
                    <Text style={{ fontSize: 12, fontFamily: FONT_PRIMARY, color: '#AAAAAA' }}>Clear All</Text>
                </TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, paddingHorizontal: 15 }}>
                    <Icon name='ios-arrow-back' size={24} color={NAV_COLOR} />
                </TouchableOpacity>
            )
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedCategory: this.props.selectedCategory,
            offerType: this.props.navigation.getParam('offerType', null),
            id: this.props.navigation.getParam('id', '')
        }
        // PRIMARY_COLOR = select(store.getState())
        this.onApply = this.onApply.bind(this)
        this.onClear = this.onClear.bind(this)
        console.log('selected........', this.state.selectedCategory)
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.setState({
                selectedCategory: this.props.selectedCategory,
            })
        })
        this.props.navigation.setParams({ onClear: this.onClear })
    }

    componentWillUnmount() {
        this.focusListener.remove()
    }

    onClear() {
        this.setState({ selectedCategory: [] })
        this.props.dispatch(selectedCategory({ category: [] }))
    }

    onApply() {
        if (this.state.selectedCategory && this.state.selectedCategory.length > 0) {
            {
                this.props.dispatch(resetOffersList())
                this.props.dispatch(offerFilter({ category: this.state.selectedCategory }))
                this.props.navigation.goBack()
            }
        }
        else {
            this.props.dispatch(resetOffersList())
            this.props.dispatch(getProduct())
            this.props.navigation.goBack()
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='default' translucent={false} />
                <View style={styles.content}>
                    <View style={styles.filterCategory}>
                        <TouchableOpacity style={styles.category} onPress={() => this.props.navigation.navigate('FilterCategory')} >
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>Category</Text>
                                <Text style={styles.subTitle}>{this.state.selectedCategory.length > 0 ? this.state.selectedCategory[0].categoryName : 'All Categories'}</Text>
                            </View>
                            <IconMaterial name='check' size={24} color={this.state.selectedCategory.length > 0 ? PRIMARY_COLOR : BORDER_COLOR} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: PRIMARY_COLOR }]} onPress={this.onApply}>
                            <Text style={styles.apply}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({
    // selectedBrand: state.brandList.selectedBrand,
    selectedCategory: state.categoryList.selectedCategory,

})

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DRAWER_COLOR
    },
    content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    filterCategory: {
    },
    category: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR
    },
    textContainer: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontFamily: FONT_SECONDARY,
        color: NAV_COLOR,
        paddingBottom: 5
    },
    subTitle: {
        fontSize: 16,
        fontFamily: FONT_PRIMARY,
        color: '#AAAAAA',
        textAlign: 'left'
    },
    footer: {
        height: '12%',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    button: {
        height: '60%',
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    apply: {
        fontSize: 18,
        fontFamily: FONT_PRIMARY,
        color: 'white'
    }
})