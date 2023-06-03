import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import { persistReducer, persistStore, } from 'redux-persist'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import AsyncStorage from '@react-native-community/async-storage'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import programmes from '../screens/home/reducers'
// import appInfo from '../screens/profile/reducers'
import userLogin from '../screens/login/reducers'
import product from '../screens/onlineShopping/reducers'
import categoryList from '../screens/filter/reducers'
import resetFirstLogin from '../screens/languageSelection/reducers'
import resetWalkthrough from '../screens/languageSelection/reducers'
import resetBanner from '../screens/home/reducers'
import setBanner from '../screens/home/reducers'


const rootReducer = combineReducers({
    programmes, userLogin: userLogin, product, categoryList, resetFirstLogin, resetWalkthrough, resetBanner, setBanner
})

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: hardSet
}

const store = createStore(
    persistReducer(rootPersistConfig, rootReducer),
    compose(applyMiddleware(thunk, logger))
)

const persistor = persistStore(store)

export { store, persistor }