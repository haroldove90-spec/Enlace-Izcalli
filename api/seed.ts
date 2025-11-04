import { createClient } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { CATEGORIES, BUSINESSES } from '../../constants';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();
    // Drop tables first to ensure a clean slate, dropping businesses first due to foreign key constraint
    await client.query('DROP TABLE IF EXISTS businesses;');
    await client.query('DROP TABLE IF EXISTS categories;');
    console.log('Dropped existing tables for a clean seed.');

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `);
    console.log('Categories table created.');

    // Create businesses table
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
        promotionEndDate TIMESTAMPTZ
      );
    `);
    console.log('Businesses table created.');

    // Insert categories
    console.log('Seeding categories...');
    for (const cat of CATEGORIES) {
      await client.query('INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;', [cat.id, cat.name]);
    }
    // After manually inserting with specific IDs, reset the sequence for future inserts
    await client.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));`);
    console.log(`${CATEGORIES.length} categories seeded.`);

    // Insert businesses
    console.log('Seeding businesses...');
    for (const b of BUSINESSES) {
      await client.query(`
          INSERT INTO businesses (id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, isActive, promotionEndDate)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING;
      `, [b.id, b.name, b.description, b.logoUrl, b.phone, b.whatsapp, b.website, b.categoryId, JSON.stringify(b.services), JSON.stringify(b.products), b.isFeatured, b.ownerName, b.ownerEmail, b.isActive, b.promotionEndDate]);
    }
    // After manually inserting with specific IDs, reset the sequence for future inserts
    await client.query(`SELECT setval('businesses_id_seq', (SELECT MAX(id) FROM businesses));`);
    console.log(`${BUSINESSES.length} businesses seeded.`);
    

    return response.status(200).json({ message: 'Database seeded successfully! Your app should be working now.' });
  } catch (error) {
    console.error('Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return response.status(500).json({ error: 'Failed to seed database', details: errorMessage });
  } finally {
      await client.end();
  }
}