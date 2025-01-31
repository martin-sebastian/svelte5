export type Vehicle = {
	id: string;
	title: string;
	link: string | null;
	description: string | null;
	price: number | null;
	priceType: string | null;
	stockNumber: string | null;
	vin: string | null;
	manufacturer: string | null;
	year: number | null;
	color: string | null;
	modelType: string | null;
	modelTypestyle: string | null;
	modelName: string | null;
	trimName: string | null;
	trimColor: string | null;
	condition: string | null;
	usage: string | null;
	location: string | null;
	updated: string | null;
	metricType: string | null;
	metricValue: string | null;
	status: 'ACTIVE' | 'INACTIVE' | 'SOLD';
	lastModified: string | null;
};
