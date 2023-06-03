import I18n from 'react-native-i18n'
import ar from './components/ar'
import en from './components/en'

I18n.fallbacks = true
I18n.translations = {
    ar,
    en,
}

//I18n.locale='ar'
export default I18n