import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // The error message suggests using createClient for direct connections.
  const client = createClient({
      connectionString: process.env.POSTGRES_URL,
  });
  
  try {
    await client.connect();

    if (request.method === 'GET') {
      const { rows } = await client.query('SELECT * FROM businesses ORDER BY id;');
      return response.status(200).json(rows);
    } 
    
    else if (request.method === 'POST') {
      const { name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive } = request.body;
      if (!name || !ownerName || !ownerEmail) {
         return response.status(400).json({ error: 'Name, owner name, and email are required' });
      }
      await client.query(
        `INSERT INTO businesses (name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
        [name, description, logoUrl, phone, whatsapp, website, categoryId, JSON.stringify(services), JSON.stringify(products), isFeatured, ownerName, ownerEmail, promotionEndDate, isActive]
      );
      const { rows } = await client.query('SELECT * FROM businesses ORDER BY id;');
      return response.status(201).json(rows);
    }

    else if (request.method === 'PUT') {
        const { id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Business ID is required for update' });
        }
        await client.query(
            `UPDATE businesses
            SET name = $1, 
                description = $2, 
                logoUrl = $3, 
                phone = $4, 
                whatsapp = $5, 
                website = $6, 
                categoryId = $7, 
                services = $8, 
                products = $9, 
                isFeatured = $10, 
                ownerName = $11, 
                ownerEmail = $12, 
                promotionEndDate = $13, 
                isActive = $14
            WHERE id = $15;`,
            [name, description, logoUrl, phone, whatsapp, website, categoryId, JSON.stringify(services), JSON.stringify(products), isFeatured, ownerName, ownerEmail, promotionEndDate, isActive, id]
        );
        const { rows } = await client.query('SELECT * FROM businesses WHERE id = $1;', [id]);
        return response.status(200).json(rows[0]);
    }

    else {
      response.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return response.status(500).json({ error: 'Internal Server Error', details: errorMessage });
  } finally {
      await client.end();
  }
}