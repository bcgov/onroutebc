import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ENGLISH from "./translations/en.json";

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        resources: {
            en: {
                translation: ENGLISH,
            }
        },
    });

export default i18n;