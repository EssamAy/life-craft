import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import ar from './ar.json';


const resources = {
    "en": {translation: en},
    "ar": {translation: ar},
};

const initI18n = async () => {
    let savedLanguage = 'ar' //await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = 'ar' //Localization.getLocales();
    }
    i18n
        // pass the i18n instance to react-i18next.
        .use(initReactI18next)
        // init i18next
        // for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            compatibilityJSON: "v3",
            resources,
            lng: savedLanguage,
            fallbackLng: "en",
            interpolation: {
                escapeValue: false // not needed for react as it escapes by default
            }
        });
}
initI18n();

export default i18n;