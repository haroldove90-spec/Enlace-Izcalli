import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { CATEGORIES, BUSINESSES } from '../../constants';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );
    `;
    console.log('Categories table created or already exists.');

    // Create businesses table
    await sql`
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
    `;
    console.log('Businesses table created or already exists.');

    // Insert categories if table is empty
    const { rows: categoryCheck } = await sql`SELECT COUNT(*) FROM categories;`;
    if (categoryCheck[0].count === '0') {
      console.log('Seeding categories...');
      for (const cat of CATEGORIES) {
        await sql`INSERT INTO categories (id, name) VALUES (${cat.id}, ${cat.name}) ON CONFLICT (id) DO NOTHING;`;
      }
      // After manually inserting with specific IDs, reset the sequence
      await sql`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));`;
      console.log(`${CATEGORIES.length} categories seeded.`);
    }

    // Insert businesses if table is empty
    const { rows: businessCheck } = await sql`SELECT COUNT(*) FROM businesses;`;
    if (businessCheck[0].count === '0') {
      console.log('Seeding businesses...');
      for (const b of BUSINESSES) {
        await sql`
            INSERT INTO businesses (id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, isActive, promotionEndDate)
            VALUES (${b.id}, ${b.name}, ${b.description}, ${b.logoUrl}, ${b.phone}, ${b.whatsapp}, ${b.website}, ${b.categoryId}, ${JSON.stringify(b.services)}, ${JSON.stringify(b.products)}, ${b.isFeatured}, ${b.ownerName}, ${b.ownerEmail}, ${b.isActive}, ${b.promotionEndDate})
            ON CONFLICT (id) DO NOTHING;
        `;
      }
      // After manually inserting with specific IDs, reset the sequence
      await sql`SELECT setval('businesses_id_seq', (SELECT MAX(id) FROM businesses));`;
      console.log(`${BUSINESSES.length} businesses seeded.`);
    }

    return response.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seeding error:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return response.status(500).json({ error: 'Failed to seed database', details: errorMessage });
  }
}
