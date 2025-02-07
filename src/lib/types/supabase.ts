export type Database = {
	public: {
		Tables: {
			vehicle: {
				Row: {
					id: string;
					title: string | null;
					manufacturer: string | null;
					stock_number: string | null;
					vin: string | null;
					year: number | null;
					price: number | null;
					model_type: string | null;
					status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
					last_modified: string;
				};
			};
			vehicle_image: {
				Row: {
					id: string;
					vehicle_id: string;
					image_url: string;
				};
			};
		};
		Views: {
			[key: string]: any;
		};
		Functions: {
			[key: string]: any;
		};
		Enums: {
			[key: string]: any;
		};
	};
};
