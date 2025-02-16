import { writable } from 'svelte/store';

export type KeyTagTemplate = {
	id: string;
	name: string;
	description: string;
	width: string;
	height: string;
	orientation: 'portrait' | 'landscape';
	backgroundImage?: string;
	backgroundColor?: string;
	borderWidth?: string;
	borderColor?: string;
	color?: string;
	printableArea: {
		borderWidth?: string;
		borderColor?: string;
		width: string;
		height: string;
		marginTop: string;
		marginLeft: string;
	};
};

const defaultTemplates: KeyTagTemplate[] = [
	{
		id: 'standard-label',
		name: 'Standard White Label',
		description: 'Standard thermal white label for Zebra printers',
		width: '1.25in',
		height: '2.25in',
		orientation: 'portrait',
		backgroundColor: '#ffffff',
		borderWidth: '0.01in',
		borderColor: '#000000',
		printableArea: {
			borderWidth: '0.01in',
			borderColor: '#FF0000',
			width: '1.25in',
			height: '2.25in',
			marginTop: '0in',
			marginLeft: '0in'
		}
	},
	{
		id: 'versa-tag-standard-yellow',
		name: 'Versa-Tag Standard Yellow',
		description: 'Standard yellow self-laminating key tag',
		width: '3in',
		height: '3in',
		orientation: 'portrait',
		backgroundImage: '/images/versa-tag-3x3-yellow.png',
		backgroundColor: '#ffeb3b',
		borderWidth: '0.01in',
		borderColor: '#000000',
		printableArea: {
			borderWidth: '0.01in',
			borderColor: '#000000',
			width: '1.5in',
			height: '2.5in',
			marginTop: '0in',
			marginLeft: '0in'
		}
	},
	{
		id: 'versa-tag-standard-white',
		name: 'Versa-Tag Standard White',
		description: 'Standard white self-laminating key tag',
		width: '3in',
		height: '3in',
		orientation: 'portrait',
		backgroundImage: '/images/versa-tag-3x3-white.png',
		backgroundColor: '#ffffff',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		}
	},
	{
		id: 'versa-tag-standard-gray',
		name: 'Versa-Tag Standard Gray',
		description: 'Standard gray self-laminating key tag',
		width: '3in',
		height: '3in',
		orientation: 'portrait',
		backgroundImage: '/images/versa-tag-3x3-gray.png',
		backgroundColor: '#9e9e9e',
		printableArea: {
			width: '3in',
			height: '3in',
			marginTop: '0in',
			marginLeft: '0in'
		}
	}
];

// Define the type for key tag settings
type KeyTagSettings = {
	showPrice: boolean;
	showVIN: boolean;
	showStockNumber: boolean;
	showQRCode: boolean;
	showBarcode: boolean;
	fontSize: number;
	templates: KeyTagTemplate[];
	selectedTemplateId: string;
};

// Create a writable store with default values
const createKeyTagStore = () => {
	const defaultSettings: KeyTagSettings = {
		showPrice: true,
		showVIN: true,
		showStockNumber: true,
		showQRCode: true,
		showBarcode: true,
		fontSize: 12,
		templates: defaultTemplates,
		selectedTemplateId: 'standard-label'
	};

	const { subscribe, set, update } = writable<KeyTagSettings>(defaultSettings);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultSettings),
		toggleSetting: (key: keyof KeyTagSettings) =>
			update((settings) => ({
				...settings,
				[key]: !settings[key]
			})),
		updateFontSize: (size: number) =>
			update((settings) => ({
				...settings,
				fontSize: size
			})),
		selectTemplate: (templateId: string) =>
			update((settings) => ({
				...settings,
				selectedTemplateId: templateId
			}))
	};
};

export const keyTagStore = createKeyTagStore();
