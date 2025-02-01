<script module lang="ts">
	export interface KeyTagTemplate {
		id: string;
		name: string;
		description: string;
		width: string;
		height: string;
		orientation: 'portrait' | 'landscape';
		backgroundImage?: string;
		backgroundColor?: string;
		printableArea: {
			width: string;
			height: string;
			marginTop: string;
			marginLeft: string;
		};
	}

	const defaultTemplates: KeyTagTemplate[] = [
		{
			id: 'versa-tag-standard-yellow',
			name: 'Versa-Tag Standard Yellow',
			description: 'Standard yellow self-laminating key tag',
			width: '3in',
			height: '3in',
			orientation: 'landscape',
			backgroundImage: '/images/versa-tag-3x3-yellow-custom.png',
			backgroundColor: '#ffeb3b',
			printableArea: {
				width: '3in',
				height: '3in',
				marginTop: '0in',
				marginLeft: '0in'
			}
		},
		{
			id: 'versa-tag-narrow-yellow',
			name: 'Versa-Tag Narrow Yellow',
			description: 'Narrow yellow self-laminating key tag',
			width: '1.22in',
			height: '3in',
			orientation: 'portrait',
			backgroundImage: '/images/versa-tag-narrow-yellow.png',
			backgroundColor: '#ffeb3b',
			printableArea: {
				width: '1.22in',
				height: '3in',
				marginTop: '0in',
				marginLeft: '0in'
			}
		},
		{
			id: 'versa-tag-white',
			name: 'Versa-Tag White',
			description: 'Standard white self-laminating key tag',
			width: '3in',
			height: '3in',
			orientation: 'landscape',
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
			id: 'versa-tag-gray',
			name: 'Versa-Tag Gray',
			description: 'Standard gray self-laminating key tag',
			width: '3in',
			height: '3in',
			orientation: 'landscape',
			backgroundImage: '/images/versa-tag-3x3-gray.png',
			backgroundColor: '#e0e0e0',
			printableArea: {
				width: '3in',
				height: '3in',
				marginTop: '0in',
				marginLeft: '0in'
			}
		},
		{
			id: 'standard-label',
			name: 'Standard Label',
			description: 'Original 1.5 x 2 inch label',
			width: '2in',
			height: '1.5in',
			orientation: 'landscape',
			backgroundColor: '#ffffff',
			printableArea: {
				width: '1.875in',
				height: '1.375in',
				marginTop: '0.0625in',
				marginLeft: '0.0625in'
			}
		}
	];

	const templates = $state(defaultTemplates);
	let selectedTemplateId = $state(defaultTemplates[0].id);

	export const keyTagStore = {
		templates,
		// svelte-ignore state_referenced_locally
		selectedTemplateId,
		setSelectedTemplateId: (id: string) => {
			selectedTemplateId = id;
		}
	};
</script>
