let initialStage = {
    user: null,
    error: false,
    isLogging: false,
    isLoading: false,
    errorMessage: null,
    isFirstLogin: true,
    isImageChanging: false,
    locale: 'en',
    activeSession: 'home',
    isSubcribed: false,
    fcmToken: null,
    isPremium: false,
    isSubcribing: false,
    otpErrorMessage: null,
    signUpErrorMessage: null
}

const user = (state = initialStage, actions) => {
    switch (actions.type) {
        case "LOGIN_FETCHING":
            return { ...state, isLogging: true, user: null }
            break;
        case "LOGIN_FETCHING_SUCCESS":
            return { ...state, isLogging: false, error: false, user: actions.user, isPremium: actions.isPremium, isSocialLogin: actions.isSocialLogin, errorMessage: null }
            break;
        case "LOGIN_FETCHING_FAILED":
            return { ...state, isLogging: false, error: true, user: null, errorMessage: actions.errorMessage }
            break;
        case "ERROR_RESET":
            return { ...state, errorMessage: null }
            break;
        case "LOGIN_RESET":
            return { ...state, user: null }
            break;
        case "ISLOGGIN_RESET":
            return { ...state, isLogging: false }
            break;
        case "SIGNUP_FETCHING":
            return { ...state, isLogging: true, user: null, signUpErrorMessage: null }
            break;
        case "SIGNUP_FETCHING_SUCCESS":
            return { ...state, isLogging: false, error: false, user: actions.user, fcmToken: actions.fcmToken, isPremium: actions.isPremium, signUpErrorMessage: null }
            break;
        case "SIGNUP_FETCHING_GUEST_SUCCESS":
            return { ...state, isLogging: false, error: false }
            break;
        case "SIGNUP_FETCHING_FAILED":
            return { ...state, isLogging: false, error: true, user: null, signUpErrorMessage: actions.errorMessage }
            break;
        case "SIGNUP_RESET":
            return { ...state, user: null, error: false, signUpErrorMessage: null, fcmToken: null }
            break;
        case "OTP_FETCHING_FETCHING":
            return { ...state, isLoading: true, user: null }
            break;
        case "OTP_FETCHING":
            return { ...state, isLoading: true, user: null, otpErrorMessage: null }
            break;
        case "OTP_FETCHING_RE":
            return { ...state, isLogging: false, errorMessage: actions.errorMessage }
            break;
        case "OTP_FETCHING_SUCCESS":
            return { ...state, isLoading: false, error: false, user: actions.response }
            break;
        case "OTP_FETCHING_FAILED":
            return { ...state, isLoading: false, error: true, user: null, otpErrorMessage: actions.errormessage }
            break;
        case "OTP_RESET":
            return { ...state, user: null, error: false, otpErrorMessage: null, isLoading: false }
            break;
        case 'SEND_FCM_TOKEN':
            return { ...state, error: false, isLoading: true }
            break;
        case 'SEND_FCM_TOKEN_SUCCESS':
            return { ...state, error: false, isLoading: false, notification: actions.response, fcmToken: actions.fcmToken }
            break;
        case 'SEND_FCM_TOKEN_FAILED':
            return { ...state, error: true, isLoading: false }
            break;
        case 'CHANGE_LANGUAGE':
            return { ...state, isLoading: true }
            break;
        case 'CHANGE_LANGUAGE_SUCCESS':
            let temp_user = state.user
            temp_user.language = actions.locale
            return { ...state, user: { ...temp_user }, isLoading: false, locale: actions.locale }
            break;
        case 'CHANGE_LANGUAGE_FAILED':
            return { ...state, errorMessage: actions.response, isLoading: false }
            break;
        case 'CHANGE_NAME':
            return { ...state }
            break;
        case 'CHANGE_NAME_SUCCESS':
            let updated_name = { ...state.user, username: actions.fullname }
            return { ...state, user: updated_name }
            break;
        case 'CHANGE_NAME_FAILED':
            return { ...state }
            break;
        case 'CHANGE_PROFILE_IMAGE':
            return { ...state, isImageChanging: true }
            break;
        case "CHANGE_PROFILE_IMAGE_SUCCESS":
            let profile_pic_updated = actions.response.profile_pic
            let updated_user = { ...state.user, profile_pic: profile_pic_updated }
            return { ...state, isImageChanging: false, user: updated_user }
            break;
        case 'CHANGE_PROFILE_IMAGE_FAILED':
            return { ...state, isImageChanging: false }
            break;
        case 'CHANGE_FIRST_LOGIN':
            return { ...state, isFirstLogin: false, locale: actions.locale }
            break;
        case 'CHANGE_USER_LOCALE':
            return { ...state, locale: actions.locale }
            break;
        case 'CHANGE_USER_SESSION':
            return { ...state, activeSession: actions.session }
        case 'CHANGE_USER_SUBCRIBTION':
            return { ...state, isSubcribed: actions.isSubcribed }
        case 'USER_SUBSCRIBE':
            return { ...state, isSubcribing: true }
        case 'USER_SUBSCRIBE_SUCCESS':
            return { ...state, isSubcribing: false, isPremium: true }
        case 'USER_SUBSCRIBE_FAILED':
            return { ...state, isSubcribing: false, isPremium: false }
        case 'USER_NOTIFICATION':
            return state
        case 'USER_NOTIFICATION_SUCCESS':
            let user_status_change = { ...state.user }
            return { ...state, user: user_status_change }
        case 'USER_NOTIFICATION_FAILED':
            return state

        default:
            return state
    }
}

export default user
