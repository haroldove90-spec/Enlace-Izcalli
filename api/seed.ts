import { Client } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CATEGORIES, BUSINESSES } from '../constants';

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  const client = new Client({
      connectionString: process.env.SUPABASE_CONNECTION_STRING,
      ssl: true,
  });
  try {
    await client.connect();

    await client.query('BEGIN');

    // Create tables if they don't exist. This makes the script idempotent and robust.
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logoUrl VARCHAR(255),
        phone VARCHAR(20),
        whatsapp VARCHAR(25),
        website VARCHAR(255),
        categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        services JSONB,
        products JSONB,
        isFeatured BOOLEAN DEFAULT FALSE,
        ownerName VARCHAR(255) NOT NULL,
        ownerEmail VARCHAR(255) NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        promotionEndDate TIMESTAMPTZ,
        address TEXT,
        latitude FLOAT8,
        longitude FLOAT8
      );
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          endpoint TEXT NOT NULL UNIQUE,
          subscription_data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Ensured all tables exist.');

    // Truncate tables to clear existing data before seeding.
    // RESTART IDENTITY resets the sequence generators (for SERIAL columns).
    await client.query('TRUNCATE TABLE businesses, categories, subscriptions RESTART IDENTITY CASCADE;');
    console.log('Truncated tables for a clean seed.');

    // Batch insert categories
    if (CATEGORIES.length > 0) {
      const categoryValues = CATEGORIES.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',');
      const categoryParams = CATEGORIES.flatMap(cat => [cat.id, cat.name]);
      await client.query(`INSERT INTO categories (id, name) VALUES ${categoryValues};`, categoryParams);
      console.log(`${CATEGORIES.length} categories seeded.`);
    }

    // Batch insert businesses
    if (BUSINESSES.length > 0) {
      const businessPlaceholders = BUSINESSES.map((_, i) => {
        const offset = i * 18;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17}, $${offset + 18})`;
      }).join(',');

      const businessParams = BUSINESSES.flatMap(b => [
        b.id, b.name, b.description, b.logoUrl, b.phone, b.whatsapp, b.website, b.categoryId, 
        JSON.stringify(b.services), JSON.stringify(b.products), b.isFeatured, b.ownerName, 
        b.ownerEmail, b.isActive, b.promotionEndDate, b.address, b.latitude, b.longitude
      ]);
      
      await client.query(
        `INSERT INTO businesses (id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, isActive, promotionEndDate, address, latitude, longitude)
         VALUES ${businessPlaceholders};`,
        businessParams
      );
      console.log(`${BUSINESSES.length} businesses seeded.`);
    }
    
    await client.query('COMMIT');
    console.log('Transaction committed successfully.');

    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('Sent notification to reload Supabase schema cache.');

    return response.status(200).json({ message: 'Database seeded successfully! Your app should be working now.' });
  } catch (error) {
    console.error('Seeding error:', error);
    await client.query('ROLLBACK');
    console.log('Transaction rolled back due to an error.');
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return response.status(500).json({ error: 'Failed to seed database', details: errorMessage });
  } finally {
    await client.end();
  }
}