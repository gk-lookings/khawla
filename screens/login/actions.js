import Api from '../../common/api'
import I18n from '../../i18n'
import { NavigationActions, StackActions } from 'react-navigation'
import { CHANGE_PROPIC, NOTIFICATION, CHANGE_USERNAME, LOGIN } from '../../common/endpoints'

export function fetchUser(user, navigation, page, data) {
    let formdata = new FormData()
    formdata.append('email', user.email)
    formdata.append('password', user.password)
    formdata.append('appId', 1)
    return function (dispatch) {
        dispatch({ type: 'LOGIN_FETCHING' })
        Api('post', LOGIN, formdata)
            .then((response) => {
                if (response && response.status && response.statusCode == 200) {
                    dispatch({ type: 'LOGIN_FETCHING_SUCCESS', user: response.userinfo, isPremium: response.userinfo.isPremium, isSocialLogin: response.userinfo.isSocialLogin })
                    navigation.dispatch(
                        StackActions.reset({
                            index: 0,
                            // actions: [NavigationActions.navigate({ routeName: 'OnlineShoppingDetail', params: { signin: true, page: page, products: data } })],
                            actions: [NavigationActions.navigate({ routeName: 'Home', params: { signin: true, page: page } })],
                        })
                    )
                }
                else if (response.statusCode == 100) {
                    dispatch({ type: 'OTP_FETCHING_RE' })
                    navigation.navigate('OTP', { user: response.userinfo, errorMessage: response.errormessage })
                }
                else
                    dispatch({ type: 'LOGIN_FETCHING_FAILED', errorMessage: response.errormessage })
            })
    }
}



export function postChangeProfileImage(body) {
    console.log('body', body)
    let formdata = new FormData()
    formdata.append('profile_pic', body.image)
    console.log('formdata', formdata)
    return function (dispatch) {
        dispatch({ type: 'CHANGE_PROFILE_IMAGE' })
        Api('post', CHANGE_PROPIC, formdata)
            .then((response) => {
                console.log("response", response)
                if (response.status == true) {
                    dispatch({ type: 'CHANGE_PROFILE_IMAGE_SUCCESS', response: response, })
                }
                else
                    dispatch({ type: 'CHANGE_PROFILE_IMAGE_FAILED', response: response })
            })
    }
}

export function fetchChangeName(updateusername) {
    let formdata = new FormData()
    formdata.append('username', updateusername)
    formdata.append('appId', 1)
    return function (dispatch) {
        dispatch({ type: 'CHANGE_NAME' })
        Api('post', CHANGE_USERNAME, formdata)
            .then(async (response) => {
                console.log("change name....", response)
                if (response.status === true) {
                    dispatch({ type: 'CHANGE_NAME_SUCCESS', fullname: updateusername })
                }
                else
                    dispatch({ type: 'CHANGE_NAME_FAILED' })
            })
    }
}


export function postNotificationToggle(notification) {
    let formdata = new FormData()
    formdata.append('notification', notification)
    formdata.append('appId', 1)
    return function (dispatch) {
        dispatch({ type: 'USER_NOTIFICATION' })
        Api('post', NOTIFICATION, formdata)
            .then((response) => {
                console.log('notification res', response)
                if (response.status == true) {
                    dispatch({ type: 'USER_NOTIFICATION_SUCCESS', status: response.notification == 0 ? false : true })
                }
                else
                    dispatch({ type: 'USER_NOTIFICATION_FAILED' })
            })
    }
}

export function resetUser() {
    return { type: 'LOGIN_RESET' }
}

export function resetError() {
    return { type: 'ERROR_RESET' }
}

export function resetIsLoggin() {
    return { type: 'ISLOGGIN_RESET' }
}