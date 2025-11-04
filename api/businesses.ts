import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    if (request.method === 'GET') {
      const { rows } = await sql`SELECT * FROM businesses ORDER BY id;`;
      return response.status(200).json(rows);
    } 
    
    else if (request.method === 'POST') {
      const { name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive } = request.body;
      if (!name || !ownerName || !ownerEmail) {
         return response.status(400).json({ error: 'Name, owner name, and email are required' });
      }
      await sql`
        INSERT INTO businesses (name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive)
        VALUES (${name}, ${description}, ${logoUrl}, ${phone}, ${whatsapp}, ${website}, ${categoryId}, ${JSON.stringify(services)}, ${JSON.stringify(products)}, ${isFeatured}, ${ownerName}, ${ownerEmail}, ${promotionEndDate}, ${isActive});
      `;
      const { rows } = await sql`SELECT * FROM businesses ORDER BY id;`;
      return response.status(201).json(rows);
    }

    else if (request.method === 'PUT') {
        const { id, name, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, ownerName, ownerEmail, promotionEndDate, isActive } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Business ID is required for update' });
        }
        await sql`
            UPDATE businesses
            SET name = ${name}, 
                description = ${description}, 
                logoUrl = ${logoUrl}, 
                phone = ${phone}, 
                whatsapp = ${whatsapp}, 
                website = ${website}, 
                categoryId = ${categoryId}, 
                services = ${JSON.stringify(services)}, 
                products = ${JSON.stringify(products)}, 
                isFeatured = ${isFeatured}, 
                ownerName = ${ownerName}, 
                ownerEmail = ${ownerEmail}, 
                promotionEndDate = ${promotionEndDate}, 
                isActive = ${isActive}
            WHERE id = ${id};
        `;
        const { rows } = await sql`SELECT * FROM businesses WHERE id = ${id};`;
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
  }
}