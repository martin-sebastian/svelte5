// src/routes/admin/vehicles/preview/+page.server.ts
import { db } from '$lib/server/db';
import { motorcycles } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Insert some test data first
  try {
    // Check if we have any motorcycles
    const existingMotorcycles = await db.select({ count: { _count: motorcycles.id } })
      .from(motorcycles);
    
    if (!existingMotorcycles[0]?.count?._count) {
      // Insert test motorcycle
      await db.insert(motorcycles).values({
        id: '1',
        title: 'Test Motorcycle',
        link: 'https://example.com',
        description: 'Test motorcycle description',
        price: 10000,
        price_type: 'USD',
        stock_number: 'STOCK123',
        vin: 'VIN123456',
        manufacturer: 'Test Manufacturer',
        year: 2023,
        color: 'Red',
        model_type: 'Sport',
        model_typestyle: 'Racing',
        model_name: 'Speedster',
        trim_name: 'Deluxe',
        trim_color: 'Chrome',
        condition: 'Excellent',
        usage: 'New',
        location: 'Test Location',
        updated: new Date().toISOString(),
        metric_type: 'Miles',
        metric_value: 0,
        status: 'ACTIVE',
        last_modified: new Date().toISOString()
      });
      
      console.log('Inserted test motorcycle');
    }
  } catch (error) {
    console.error('Error inserting test data:', error);
  }

  const result = await db.select({
    id: motorcycles.id,
    title: motorcycles.title,
    link: motorcycles.link,
    description: motorcycles.description,
    price: motorcycles.price,
    price_type: motorcycles.price_type,
    stock_number: motorcycles.stock_number,
    vin: motorcycles.vin,
    manufacturer: motorcycles.manufacturer,
    year: motorcycles.year,
    color: motorcycles.color,
    model_type: motorcycles.model_type,
    model_typestyle: motorcycles.model_typestyle,
    model_name: motorcycles.model_name,
    trim_name: motorcycles.trim_name,
    trim_color: motorcycles.trim_color,
    condition: motorcycles.condition,
    usage: motorcycles.usage,
    location: motorcycles.location,
    updated: motorcycles.updated,
    metric_type: motorcycles.metric_type,
    metric_value: motorcycles.metric_value,
    status: motorcycles.status,
    last_modified: motorcycles.last_modified,
  }).from(motorcycles);

  console.log('Query result:', result);
  return { motorcycles: result };
};