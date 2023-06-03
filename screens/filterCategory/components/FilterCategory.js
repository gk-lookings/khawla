import React, { Component } from 'react'
import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { SafeAreaView } from 'react-navigation'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLOR_SECONDARY, NAV_COLOR, COLOR_PRIMARY, BORDER_COLOR, DRAWER_COLOR,PRIMARY_COLOR } from '../../../assets/color'
import { FONT_PRIMARY, FONT_SECONDARY } from '../../../assets/fonts'
import Images from '../../../assets/images'
import { selectedCategory } from '../../filter/actions'
import { store } from '../../../App'
// import { select } from '../../../common/utils'
// import Api from '../../../lib/api'
import { PRODUCT_CATEGORY } from '../../../common/endpoints'
import Api from '../../../common/api'


const { height } = Dimensions.get('screen')

class App extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Select Category',
            headerTitleStyle: {
                flex: 1,
                alignSelf: 'center',
                textAlign: 'center',
                color: NAV_COLOR,
                fontSize: 18,
                fontFamily: FONT_SECONDARY, fontWeight: 'normal'
            },
            headerRight: (
                <TouchableOpacity style={{ padding: 10, paddingHorizontal: 15 }} onPress={() => navigation.navigate('FilterSearch')} >
                    <IconMaterial name='search' size={24} color={NAV_COLOR} />
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
            selectedValue: this.props.selectedCategory,
            categories: [],
            isLastPage: false,
            isLoading: true,
            page: 1,
        }
        // PRIMARY_COLOR = select(store.getState())
        this.renderCategories = this.renderCategories.bind(this)
        this.onSelect = this.onSelect.bind(this)
        // this.isSelected = this.isSelected.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.footerView = this.footerView.bind(this)
        console.log('product.....',this.props.selectedCategory)
    }

    componentDidMount() {
        this.getCategory()
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.setState({
                selectedValue: this.props.selectedCategory
            })
        })
    }

    getCategory() {
        Api('get', PRODUCT_CATEGORY)
            .then((response) => {
                console.log('dataaaa', response)
                if (response) {
                    this.setState({
                        categories: response,
                        isLoading: false,
                    })
                }
                else {
                    this.setState({ isLoading: false })
                }
            }).catch(error => {
                this.setState({ isLoading: false })
                alert("Something went wrong. Please try again!!")
            })
    }

    onSelect(value) {
        if (this.state.selectedValue.length > 0)
            if (this.state.selectedValue.indexOf(value) > -1) {
        
                this.state.selectedValue.splice(this.state.selectedValue.indexOf(value), 1)
                this.props.dispatch(selectedCategory({ category: this.state.selectedValue }))
                this.setState({ selectedValue: this.state.selectedValue })
            }
            else {
        
                this.state.selectedValue.splice(0, 1, value)
                this.props.dispatch(selectedCategory({ category: this.state.selectedValue }))
                this.setState({ selectedValue: this.state.selectedValue })
            }
        else {

            this.state.selectedValue.splice(0, 1, value)
            this.props.dispatch(selectedCategory({ category: this.state.selectedValue }))
            this.setState({ selectedValue: this.state.selectedValue })
        }
    }

    isSelected(name) {
        let status = false
        this.state.selectedValue.map((item) => {
            if (item.categoryName === name.categoryName)
                status = true
        })
        return status
    }

    renderCategories({ item }) {
        return (
            <TouchableOpacity style={styles.content} onPress={() => this.onSelect(item)}>
                {this.isSelected(item) &&
                    <View style={styles.icon}>
                        <IconMaterial name='check' size={24} color={PRIMARY_COLOR} />
                    </View>
                }
                <Image source={{uri: item.categoryPicture}} style={styles.image} />
                <Text style={styles.title}>{item.categoryName}</Text>
            </TouchableOpacity>
        )
    }

    loadMore() {
        if (!this.state.isLoading && !this.state.isLastPage)
            this.getCategory()
    }

    onRefresh() {
        this.setState({ isLoading: true, categories: [], page: 1 }, () =>
            this.getCategory())
    }

    footerView() {
        if (!this.state.isLastPage) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size='large' color={PRIMARY_COLOR} />
                </View>
            )
        }
        else return null
    }

    renderHeader() {
        return (
            <View />
        )
    }

    render() {
        const columns = 3
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='default' translucent={false} />
                {this.state.categories && !this.state.isLoading &&
                    <FlatList
                        data={this.state.categories}
                        ListHeaderComponent={this.renderHeader}
                        ListHeaderComponentStyle={{ paddingTop: 15 }}
                        numColumns={columns}
                        renderItem={this.renderCategories}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={this.onRefresh}
                        refreshing={false}
                        removeClippedSubviews={true}
                        // onEndReached={this.loadMore}
                        // ListFooterComponent={this.footerView}
                        showsVerticalScrollIndicator={false}
                    />
                }
                {this.state.categories && this.state.categories.length === 0 && !this.state.isLoading &&
                    <View style={styles.contentUnavailable}>
                        <IconMaterial name='hourglass-empty' size={50} color={PRIMARY_COLOR} />
                        <Text style={[styles.text, { color: PRIMARY_COLOR }]}>No categories to select</Text>
                    </View>
                }
                {this.state.isLoading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={PRIMARY_COLOR} />
                    </View>
                }
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({
    selectedCategory: state.categoryList.selectedCategory,
    // user: state.userLogin.user
})

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DRAWER_COLOR
    },
    content: {
        flex: 1 / 3,
        paddingBottom: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        top: 5,
        right: 5
    },
    image: {
        height: height * .1,
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    title: {
        paddingHorizontal: 15,
        fontSize: 14,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        paddingTop: 15,
        textAlign: 'center'
    },
    separator: {
        height: 1,
        width: "100%",
        backgroundColor: BORDER_COLOR,
    },
    loader: {
        margin: 7
    },
    contentUnavailable: {
        flex: 1,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 25,
        fontFamily: FONT_PRIMARY,
        color: COLOR_SECONDARY,
        textAlign: 'center',
        marginTop: 10
    },
    itemEmpty: {
        backgroundColor: "transparent",
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    }
})
