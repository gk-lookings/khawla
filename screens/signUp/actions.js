import { SIGNUP } from '../../common/endpoints'
import Api from '../../common/api'
import { store } from '../../App'
import { NavigationActions, StackActions } from 'react-navigation'

export function signup(user, navigation, page) {
    console.log('user........', user)
    let lang = store.getState().programmes.lang
    let language = lang == 'ar' ? 1 : 2
    console.log('languageeee........', language)
    let formdata = new FormData()
    formdata.append('email', user.email)
    formdata.append('password', user.password)
    formdata.append('auth', user.fbgoogle)
    formdata.append('fullname', user.name)
    if (user.fbgoogle != 0) {
        formdata.append('profile_pic', user.photo)
    }
    if (user.fbgoogle == 0) {
        formdata.append('profile_pic', user.image)
    }
    formdata.append('language', language)
    formdata.append('appId', 1)
    return function (dispatch) {
        dispatch({ type: 'SIGNUP_FETCHING' })
        Api('post', SIGNUP, formdata)
            .then((response) => {
                console.log('reespoonsse........', response)
                if (response && response.status && response.statusCode == 200) {
                    if (user.fbgoogle != 0) {
                        dispatch({ type: 'SIGNUP_FETCHING_SUCCESS', user: response.userinfo })
                        navigation.dispatch(
                            StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Home', params: { signin: true, page: page } })],
                            })
                        )
                    }
                    else {
                        dispatch({ type: 'SIGNUP_FETCHING_SUCCESS' })
                        navigation.navigate('OTP', { user: response.userinfo })
                    }

                }
                else
                    dispatch({ type: 'SIGNUP_FETCHING_FAILED', errorMessage: response.errormessage })
            })
    }
}