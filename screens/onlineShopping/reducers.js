let initialStage = {
    product: [],
    error: null,
    errorMessage: null,
    isLoading: false,
    lang: 'ar',
    selectedCategory: [],
    page: 1,
    isLastPage: false
}

const product = (state = initialStage, actions) => {
    switch (actions.type) {
        case "PRODUCT_FETCHING":
            return { ...state, isLoading: true, product: "" }
            break;
        case "PRODUCT_FETCHING_SUCCESS":
            return { ...state, isLoading: false, product: actions.data, page: actions.page, isLastPage: actions.isLastPage }
            break;
        case "CHANGE_LANGUAGE":
            return { ...state, lang: actions.locale }
            break;
        case "PRODUCT_FETCHING_FAILED":
            return { ...state, isLoading: false, error: true, product: "", errorMessage: actions.errorMessage }
            break;
            case "RESET_OFFERS_LIST":
                return { ...state, isLoading: false, product: [] }
                break;
        default:
            return state
    }
}

export default product
