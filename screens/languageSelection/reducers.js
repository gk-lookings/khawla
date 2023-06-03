let initialStage = {
    isFirstLogin: true,
    walkthroungh: true,
    lang: 'ar',

}

const first = (state = initialStage, actions) => {
    switch (actions.type) {
        case "FIRSTLOGIN_RESET":
            return { ...state, isFirstLogin: false }
            break;

        case "WALKTHROUGH_RESET":
            return { ...state, walkthroungh: false }
            break;
        default:
            return state
    }
}

export default first
