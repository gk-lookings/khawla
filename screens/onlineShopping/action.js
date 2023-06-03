import Api from '../../common/api'
import { PRODUCT_LISTING } from '../../common/endpoints'
import { store } from '../../App' 

export function getProduct(page) {
    return function (dispatch) {
        dispatch({ type: 'PRODUCT_FETCHING' })
        let language = store.getState().programmes.lang ? store.getState().programmes.lang == 'en' ? 2 : 1 : 1
        let datas = store.getState().product.product 
        // let page = store.getState().product.page 
        Api('get', PRODUCT_LISTING + `?language=${language}&page=${page}`)
            .then((response) => {
                console.log('products.....',response,);
                console.log('products.....dataass',datas,);
                if (response) {
                    const res = response.items
                    dispatch({ data: res.concat(res), type: 'PRODUCT_FETCHING_SUCCESS', isLastPage: response.isLastPage})
                }
                else {
                    dispatch({ type: 'PRODUCT_FETCHING_FAILED', returnMessage: response.returnMessage })
                }
            })
    }
}

export function offerFilter(body) {
    console.log('boddyyyyyy',body.category[0].categoryId)
    return function (dispatch) {
        dispatch({ type: 'PRODUCT_FETCHING' })
        let language = store.getState().programmes.lang ? store.getState().programmes.lang == 'en' ? 2 : 1 : 1
        Api('get', PRODUCT_LISTING + `?language=${language}`+ `&categoryId=${body.category[0].categoryId}`)
            .then((response) => {
                if (response) {
                    dispatch({ data: response, type: 'PRODUCT_FETCHING_SUCCESS' })
                }
                else {
                    dispatch({ type: 'PRODUCT_FETCHING_FAILED', returnMessage: response.returnMessage })
                }
            })
    }
}

export function resetOffersList() {
    return { type: 'RESET_OFFERS_LIST' }
}