import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { type Translation } from '../types/config.types';

i18n.use(initReactI18next).init({
	lng: 'en',
	fallbackLng: 'en',
	keySeparator: '.',
	interpolation: {
		escapeValue: false,
	},
	backend: {
		loadPath: '/translation/{{lng}}.json',
	},
	react: {
		useSuspense: false,
	},
});

// Function to set the language and load its resources
const setLanguage = async (lng: string, resources: Translation | undefined) => {
	try {
		if (!resources || Object.keys(resources).length === 0) {
			console.error(`No translation data available for language: ${lng}`);
			return;
		}

		for (const key in resources) {
			i18n.addResourceBundle(key, 'translation', resources[key], true, true);
		}
		await i18n.changeLanguage(lng);
	} catch (error) {
		console.error('Failed to set language', error);
	}
};

export { setLanguage };
export default i18n;
