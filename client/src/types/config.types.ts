import type { ThemeName } from "@/config/themes";

interface Color {
	code: string;
	baseColor:
		| 'blackAlpha'
		| 'gray'
		| 'red'
		| 'orange'
		| 'yellow'
		| 'green'
		| 'teal'
		| 'blue'
		| 'cyan'
		| 'purple'
		| 'pink'
		| 'linkedin'
		| 'facebook'
		| 'messenger'
		| 'whatsapp'
		| 'twitter'
		| 'telegram';
}

interface BrandColors {
	primaryColor: Color;
	textColor: string;
	bodyBgColor: string;
	activeNavMenuBgColor: string;
	inactiveNavMenuBgColor: string;
}

type DashboardWidgetColors = Record<string, string[] | string>;

interface Colors {
	brand: BrandColors;
	dashboard?: DashboardWidgetColors;
}

type Assets = Record<string, string>;

interface FontFile {
	url: string;
	format: string;
}

export type Translation = Record<string, Record<string, any>>;

export interface TranslationConfig {
	translations: Translation;
	activeLanguage: string;
	showLanguageSelector: boolean | null;
}

export interface ClientConfigType {
	themeConfig: CustomThemeConfigType;
	translationConfig?: TranslationConfig;
	assetFilePrefix?: string;
	operatorId?: string;
}

export interface CustomThemeConfigType {
	themeName: ThemeName;
	spacing: Record<string, string>;
	typography: Record<string, string>;
	colors: Colors;
	fonts?: { body: string; heading: string };
	fontFiles?: { body: FontFile; heading: FontFile };
	assets?: Assets;
}

export interface ClientConfigContext {
	query: any;
	locals: any;
}
