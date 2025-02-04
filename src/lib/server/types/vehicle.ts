export type VehicleType = {
	id: string;
	manufacturer: string | null;
	title: string | null;
	vin: string | null;
	stock_number: string | null;
	year: number | null;
	price: number | null;
	model_type: string | null;
	usage: string | null;
	status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
	last_modified: Date;
	primary_image: string | null;
};

export type ModelType = {
	model_type: string;
	count: number;
};

export type PaginatedVehicleResponse = {
	vehicles: VehicleType[];
	modelTypes: ModelType[];
	pagination: {
		page: number;
		pageSize: number;
		totalPages: number;
		totalItems: number;
	};
	filters: {
		search: string;
		modelType: string;
		sortBy: string;
		sortOrder: string;
	};
};
