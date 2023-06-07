import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { SafeAreaView,ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, Button } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import Icons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FONT_SEMIBOLD, FONT_REGULAR } from '../assets/fonts'
import { TITLE_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../assets/color'
import Images from '../assets/images'
import { showAddModal } from '../screens/home/actions'
import I18n from '../i18n'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import ToolTip from './tooltip'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const CopilotToucableOpacity = walkthroughable(TouchableOpacity);
const CopilotText = walkthroughable(Text);
const CopilotImage = walkthroughable(Image);

const { height, width } = Dimensions.get('screen')

const circleSvgPath = ({ position, canvasSize }) =>
    `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${-30 + position.x._value},${position.y._value
    }Za50 50 0 1 0 100 0 50 50 0 1 0-100 0`

const StepNumber = () => (
    <View>
    </View>
);


const style = {

    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 13,
    overflow: 'hidden',
    marginBottom: 40

};


class BottomTab extends Component {

    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    constructor(props) {
        super(props)
        this.state = { 
            isAddModalShow: false,
        }
        this._onPress = this._onPress.bind(this)
        console.log("Props bottom ", props)
    }


    componentDidUpdate(prevProps) {
        if (prevProps.isAddModalShow !== this.props.isAddModalShow) {
            this.setState({ isAddModalShow: this.props.isAddModalShow })
        }
        if (prevProps.isShowWalkThrough !== this.props.isShowWalkThrough && this.props.isShowWalkThrough == true) {
            this.props.start();
        }
    }

    _onPress() {
        this.setState({ isAddModalShow: !this.state.isAddModalShow }, () => this.props.dispatch(showAddModal(this.state.isAddModalShow)))

    }


    render() {
        
        let profile_pic = this.props.user ? this.props.user.profile_pic : 'avatar'
        const { navigation, jumpToIndex, } = this.props;
        const {
            routes
        } = navigation.state;
        console.log('profile_pic',profile_pic)
        return (
            <SafeAreaView style={styles.container}>

                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Home')}>
                    {this.props.navigation.state.index === 0 ?
                        <CopilotStep text={I18n.t("Explore_Popular_Latest_books")} order={1} name={I18n.t("Home")}>
                            <CopilotText><MaterialCommunityIcons name='home' color={PRIMARY_COLOR} size={34} style={{ width: 34 }} /></CopilotText>
                        </CopilotStep>
                        : <MaterialCommunityIcons name='home-outline' style={{ width: 34 }} color={SECONDARY_COLOR} size={30} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Libraries')}>
                    {this.props.navigation.state.index === 1 ?
                        <Feather name='grid' color={PRIMARY_COLOR} size={30} style={{ width: 34 }} />
                        : <CopilotStep text={I18n.t("Here_you_can_see_Library_of_Books")} order={2} name={I18n.t("Libraries")}>
                            <CopilotText><Feather name='grid' style={{ width: 34 }} color={SECONDARY_COLOR} size={26} /></CopilotText>
                        </CopilotStep>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Audio')} >
                    {this.props.navigation.state.index === 2 ?
                        <MaterialIcons name='audiotrack' color={PRIMARY_COLOR} size={30} style={{ width: 34 }} />
                        : <CopilotStep text={I18n.t("Here_you_can_see_audio_Books")} order={4} name={I18n.t("Audio")}>
                            <CopilotText><MaterialIcons name='audiotrack' style={{ width: 34 }} color={SECONDARY_COLOR} size={26} /></CopilotText>
                        </CopilotStep>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Publisher')}>
                    {this.props.navigation.state.index === 3 ?
                        <MaterialCommunityIcons name='bookshelf' color={PRIMARY_COLOR} size={34} style={{ width: 34 }} />
                        : <CopilotStep text={I18n.t("Access_a_collection_of_Publications")} order={5} name={I18n.t("Publishers_Books")}>
                            <CopilotText><MaterialCommunityIcons name='bookshelf' style={{ width: 34 }} color={SECONDARY_COLOR} size={30} /></CopilotText>
                        </CopilotStep>}
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Profile')} >
                    {this.props.navigation.state.index === 4 ?
                        <MaterialIcons name='person' color={PRIMARY_COLOR} size={34} style={{ width: 34 }} />
                        : <CopilotStep text={I18n.t("Signup_to_personalize_experience_access_your_Profile")} order={6} name={I18n.t("Your_profile")}>
                            <CopilotText> <MaterialIcons name='person' style={{ width: 34 }} color={SECONDARY_COLOR} size={30} /></CopilotText>
                        </CopilotStep>}
                </TouchableOpacity> 
            
            </SafeAreaView>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isAddModalShow: state.dashboard.isAddModalShow,
        user: state.userLogin.user,
        isShowWalkThrough: state.userLogin.isShowWalkThrough,
        showRetry: state.dashboard.showRetry,
        isLoading: state.dashboard.isLoading,
    }
}

const reddux = connect(mapStateToProps)(copilot(
    {
        tooltipComponent: ToolTip, svgMaskPath: circleSvgPath, tooltipStyle: style,
        stepNumberComponent: StepNumber,
        animated: true,
        overlay: 'svg',
        androidStatusBarVisible: true,
    })
    (BottomTab))
export default reddux

const styless = {
    borderRadius: 10,
    paddingTop: 5,
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        backgroundColor:'#ffffff',
        shadowOpacity:.1,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 60,
        width: 60,
        borderRadius: 35,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom:10,
        shadowOpacity: .2,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        elevation:3
    },
})










____________________________________


import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, View, Dimensions } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import { connect } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../assets/color'
import { FONT_PRIMARY, FONT_MULI_REGULAR, FONT_MULI_BOLD } from '../assets/fonts'
import Images from '../assets/images'
import ToolTip from '../screens/home/components/Tooltip'
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot'
const { height, width } = Dimensions.get('screen')

import I18n from '../i18n'
const circleSvgPath = ({ position, canvasSize }) =>
    `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${-30 + position.x._value},${position.y._value
    }Za50 50 0 1 0 100 0 50 50 0 1 0-100 0`

const StepNumber = () => (
    <View>
    </View>
);
const style = {
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 13,
    overflow: 'hidden',
    marginBottom: 40,
};

const CopilotText = walkthroughable(Text);


class BottomTab extends Component {

    navigateToScreen = (route) => () => {
        if (this.props.navigation.state.index == 0) {
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
                key: "Home"
            }))
            this.props.navigation.navigate('Home')
        }
        // else if (this.props.navigation.state.index == 1) {
        //     this.props.navigation.dispatch(StackActions.reset({
        //         index: 0,
        //         actions: [NavigationActions.navigate({ routeName: 'Programmes' })],
        //         key: "Programmes"
        //     }))
        //     this.props.navigation.navigate('Programmes')
        // }
        // else if (this.props.navigation.state.index == 2) {
        //     this.props.navigation.dispatch(StackActions.reset({
        //         index: 0,
        //         actions: [NavigationActions.navigate({ routeName: 'Bookmarks' })],
        //         key: "Bookmarks"
        //     }))
        //     this.props.navigation.navigate('Bookmarks')
        // }
        const navigateAction = NavigationActions.navigate({
            routeName: route
        })
        this.props.navigation.dispatch(navigateAction)
    }

    constructor(props) {
        super(props)
        I18n.locale = this.props.lang
        this.state = {
            cache: Math.random().toString(36).substring(7)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user != this.props.user) {
            this.setState({ cache: Math.random().toString(36).substring(7) })
        }
        if (prevProps.isShowWalkThrough !== this.props.isShowWalkThrough && this.props.isShowWalkThrough == true) {
            this.props.start();
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Home')}>
                    <CopilotStep text={'homeeeeeeee'} order={1} name={"Home"}>
                        <MaterialCommunityIcons name='home' size={26} color={this.props.navigation.state.index == 0 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                        <Text style={this.props.navigation.state.index == 0 ? styles.labelStyle : styles.inactiveLabelStyle}>{I18n.t("Home")}</Text>
                    </CopilotStep>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('AboutUs')}>
                    <CopilotStep text={'homeeeeeeee'} order={2} name={"Home"}>
                        <Feather name='info' size={26} color={this.props.navigation.state.index == 1 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                        <Text style={this.props.navigation.state.index == 1 ? styles.labelStyle : styles.inactiveLabelStyle}>{I18n.t("About_us")}</Text>
                    </CopilotStep>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Programmes')}>
                    <Feather name='align-left' size={26} color={this.props.navigation.state.index == 2 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                    <Text style={this.props.navigation.state.index == 2 ? styles.labelStyle : styles.inactiveLabelStyle}>{I18n.t("Programmes")}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Events')}>
                    <Feather name='bookmark' size={26} color={this.props.navigation.state.index == 2 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                    <Text style={this.props.navigation.state.index == 2 ? styles.labelStyle : styles.inactiveLabelStyle}>{I18n.t("Events")}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.tab} onPress={this.navigateToScreen('Settings')}>
                    {this.props.user && this.props.user.profile_pic ?
                        <Image borderRadius={15} source={this.props.user.profile_pic ? { uri: `${this.props.user.profile_pic}&random=${this.state.cache}` } : Images.default} style={styles.profile_pic} />
                        :
                        <EvilIcons name='user' size={33} color={this.props.navigation.state.index == 3 ? PRIMARY_COLOR : SECONDARY_COLOR} />
                    }
                    <Text style={this.props.navigation.state.index == 3 ? styles.labelStyle : styles.inactiveLabelStyle}>{I18n.t("Profile")}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        lang: state.programmes.lang,
        user: state.userLogin.user,
        isFirstlogin: state.resetFirstLogin.isFirstLogin,
        walkthroungh: state.resetFirstLogin.walkthroungh
    }
}
const reddux = connect(mapStateToProps)(copilot(
    {
        tooltipComponent: ToolTip, svgMaskPath: circleSvgPath, tooltipStyle: style,
        stepNumberComponent: StepNumber,
        animated: true,
        overlay: 'svg',
        androidStatusBarVisible: true,
    })
    (BottomTab))
    export default reddux


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 0,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.7,
        elevation: 10,
    },
    tab: {
        marginTop: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: '#fff'
    },
    labelStyle: {
        fontSize: 11,
        fontFamily: FONT_MULI_BOLD,
        color: PRIMARY_COLOR,
        textAlign: 'center',
    },
    inactiveLabelStyle: {
        fontSize: 11,
        fontFamily: FONT_MULI_REGULAR,
        color: SECONDARY_COLOR,
        textAlign: 'center'
    },
    profile_pic: {
        height: 28,
        width: 28,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'grey',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.5,
        marginBottom: 2
    }
})