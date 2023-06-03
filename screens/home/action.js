import Api from '../../common/api'
import { Platform } from 'react-native'
import { PROGRAMMES, NOTIFICATION } from '../../common/endpoints'
import { store } from '../../App'

export function getProgrammes() {
    return function (dispatch) {
        dispatch({ type: 'PROGRAMMES_FETCHING' })
        let language = store.getState().programmes.lang ? store.getState().programmes.lang == 'en' ? 2 : 1 : 1
        Api('get', PROGRAMMES + `language=${language}`)
            .then((responseJson) => {
                if (responseJson) {
                    dispatch({ data: responseJson, type: 'PROGRAMMES_FETCHING_SUCCESS' })
                }
                else {
                    dispatch({ type: 'PROGRAMMES_FETCHING_FAILED', returnMessage: responseJson.returnMessage })
                }
            })
    }
}

export function sendFCMToken(fcmToken, uniqueId) {
    let osType = Platform.OS == 'ios' ? 1 : 2
    let formdata = new FormData()
    formdata.append('osType', osType)
    formdata.append('fcmToken', fcmToken)
    formdata.append('deviceId', uniqueId)
    formdata.append('appId', 1)
    Api('post', NOTIFICATION, formdata)
        .then((response) => {
            console.log('response_notification', response)
        })
}


export function changeLanguage(lang) {

    return function (dispatch) {
        dispatch({ type: "CHANGE_LANGUAGE", lang: lang })
    }

}

export function resetBanner() {
    return { type: 'BANNER_RESET' }
}

export function setBanner() {
    return { type: 'BANNER_SET' }
}