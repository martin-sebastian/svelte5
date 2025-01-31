export interface KeyTagTemplate {
	id: string;
	name: string;
	width: string;
	height: string;
	printableArea: {
		width: string;
		height: string;
		marginTop: string;
		marginLeft: string;
	};
	backgroundImage: string;
	backgroundColor: string;
	orientation: 'portrait' | 'landscape';
	description?: string;
	previewImage?: string;
}
