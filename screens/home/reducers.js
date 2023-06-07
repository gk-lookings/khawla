let initialStage = {
    programmes: "",
    error: null,
    errorMessage: null,
    isLoading: false,
    lang: 'ar',
    isBannerClose: false,
}

const programmes = (state = initialStage, actions) => {
    switch (actions.type) {
        case "PROGRAMMES_FETCHING":
            return { ...state, isLoading: true, programmes: "" }
            break;
        case "PROGRAMMES_FETCHING_SUCCESS":
            return { ...state, isLoading: false, programmes: actions.data }
            break;
        case "CHANGE_LANGUAGE":
            return { ...state, lang: actions.locale }
            break;
        case "PROGRAMMES_FETCHING_FAILED":
            return { ...state, isLoading: false, error: true, programmes: "", errorMessage: actions.errorMessage }
            break;
        case "BANNER_RESET":
            return { ...state, isBannerClose: true }
            break;
        case "BANNER_SET":
            return { ...state, isBannerClose: false }
            break;
        default:
            return state
    }
}

export default programmes
