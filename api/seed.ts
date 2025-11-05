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

    // Wrap all operations in a single transaction for performance and atomicity
    await client.query('BEGIN');

    // Drop tables first to ensure a clean slate
    await client.query('DROP TABLE IF EXISTS subscriptions CASCADE;');
    await client.query('DROP TABLE IF EXISTS businesses CASCADE;');
    await client.query('DROP TABLE IF EXISTS categories CASCADE;');
    console.log('Dropped existing tables for a clean seed.');

    // Create categories table
    await client.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    console.log('Categories table created.');

    // Create businesses table
    await client.query(`
      CREATE TABLE businesses (
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
        promotionEndDate TIMESTAMPTZ
      );
    `);
    console.log('Businesses table created.');
    
    // Create subscriptions table for push notifications
    await client.query(`
      CREATE TABLE subscriptions (
          id SERIAL PRIMARY KEY,
          endpoint TEXT NOT NULL UNIQUE,
          subscription_data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Subscriptions table created.');

    // Batch insert categories
    if (CATEGORIES.length > 0) {
      console.log('Seeding categories...');
      const categoryValues = CATEGORIES.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',');
      const categoryParams = CATEGORIES.flatMap(cat => [cat.id, cat.name]);
      await client.query(`INSERT INTO categories (id, name) VALUES ${categoryValues} ON CONFLICT (id) DO NOTHING;`, categoryParams);
      await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));`);
      console.log(`${CATEGORIES.length} categories seeded.`);
    }

    // Batch insert businesses
    if (BUSINESSES.length > 0) {
      console.log('Seeding businesses...');
      const businessPlaceholders = BUSINESSES.map((_, i) => {
        const offset = i * 15;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15})`;
      }).join(',');

      const businessParams = BUSINESSES.flatMap(b => [
        b.id, b.name, b.description, b.logoUrl, b.phone, b.whatsapp, b.website, b.categoryId, 
        JSON.stringify(b.services), JSON.stringify(b.products), b.isFeatured, b.ownerName, 
        b.ownerEmail, b.isActive, b.promotionEndDate
      ]);
      
      await client.query(
        `INSERT INTO businesses (id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, isActive, promotionEndDate)
         VALUES ${businessPlaceholders}
         ON CONFLICT (id) DO NOTHING;`,
        businessParams
      );
      await client.query(`SELECT setval('businesses_id_seq', (SELECT MAX(id) FROM businesses));`);
      console.log(`${BUSINESSES.length} businesses seeded.`);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Transaction committed successfully.');

    // Notify PostgREST to reload schema cache to immediately recognize new tables
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('Sent notification to reload Supabase schema cache.');

    return response.status(200).json({ message: 'Database seeded successfully! Your app should be working now.' });
  } catch (error) {
    console.error('Seeding error:', error);
    // If an error occurs, roll back the transaction
    await client.query('ROLLBACK');
    console.log('Transaction rolled back due to an error.');
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return response.status(500).json({ error: 'Failed to seed database', details: errorMessage });
  } finally {
    await client.end();
  }
}