import axios from 'axios'
import { store } from './store'

function select(state) {
    return state.userLogin && state.userLogin.user != null ? state.userLogin.user.sessionToken : null
}

export default function request(type, url, params) {

    let token = select(store.getState())
    axios.defaults.headers.common['sessiontoken'] = token

    switch (type) {
        case 'get':
            console.log("api request",url, { params: params });
            return axios.get(url, { params: params })
                .then(function (response) {
                    console.log("Get Response", response)
                    return response.data
                })
                .catch(function (error) {
                    console.log("Server Error", error)
                    console.log("Server response", error.response)
                    return error.response.data
                })
            break;
        case 'post':
            return axios.post(url, params)
                .then(function (response) {
                    console.log("Post Response", response)
                    return response.data
                })
                .catch(function (error) {
                    console.log("Server Error", error)
                    console.log("Server response", error.response)
                    return error.response.data
                })
            break;
        default:
            break;
    }
}