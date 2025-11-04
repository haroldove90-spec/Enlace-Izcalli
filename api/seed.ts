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
        name VARCHAR(255) NOT NULL
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
        categoryId INTEGER REFERENCES categories(id),
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
    const { rowCount: categoryCount } = await sql`SELECT 1 FROM categories LIMIT 1;`;
    if (categoryCount === 0) {
        await Promise.all(
            CATEGORIES.map(cat => sql`INSERT INTO categories (id, name) VALUES (${cat.id}, ${cat.name}) ON CONFLICT (id) DO NOTHING;`)
        );
        console.log(`${CATEGORIES.length} categories seeded.`);
    }

    // Insert businesses if table is empty
    const { rowCount: businessCount } = await sql`SELECT 1 FROM businesses LIMIT 1;`;
    if (businessCount === 0) {
        await Promise.all(
            BUSINESSES.map(b => sql`
                INSERT INTO businesses (id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, isActive, promotionEndDate)
                VALUES (${b.id}, ${b.name}, ${b.description}, ${b.logoUrl}, ${b.phone}, ${b.whatsapp}, ${b.website}, ${b.categoryId}, ${JSON.stringify(b.services)}, ${JSON.stringify(b.products)}, ${b.isFeatured}, ${b.ownerName}, ${b.ownerEmail}, ${b.isActive}, ${b.promotionEndDate})
                ON CONFLICT (id) DO NOTHING;
            `)
        );
        console.log(`${BUSINESSES.length} businesses seeded.`);
    }

    return response.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seeding error:', error);
    return response.status(500).json({ error: 'Failed to seed database' });
  }
}
