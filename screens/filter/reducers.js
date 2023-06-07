let initialStage = {
    selectedCategory: [],
}

const categoryList = (state = initialStage, actions) => {
    switch (actions.type) {
        case 'SELECTED_CATEGORY':
            return { ...state, selectedCategory: actions.category }
            break;
        default:
            return state;
    }
}

export default categoryList