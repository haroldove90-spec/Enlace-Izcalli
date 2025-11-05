import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Helper to quote identifiers to preserve camelCase
const toQuoted = (key: string) => `"${key}"`;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM businesses ORDER BY id;');
      return response.status(200).json(rows);
    } 
    
    else if (request.method === 'POST') {
      const { name, ownerName, ownerEmail, description, logoUrl, phone, whatsapp, website, categoryId, services, products, isFeatured, isActive, promotionEndDate, address, latitude, longitude } = request.body;
      if (!name || !ownerName || !ownerEmail) {
         return response.status(400).json({ error: 'Name, owner name, and email are required' });
      }
      
      const query = `
        INSERT INTO businesses (
          name, description, "logoUrl", phone, whatsapp, website, "categoryId", 
          services, products, "isFeatured", "ownerName", "ownerEmail", 
          "isActive", "promotionEndDate", address, latitude, longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
      `;

      const values = [
        name, description, logoUrl, phone, whatsapp, website, categoryId,
        JSON.stringify(services || []), JSON.stringify(products || []), isFeatured, ownerName, ownerEmail,
        isActive, promotionEndDate, address, latitude, longitude
      ];
      
      await pool.query(query, values);
      
      // Re-fetch all to maintain consistency with original app logic
      const { rows: allBusinesses } = await pool.query('SELECT * FROM businesses ORDER BY id;');
      return response.status(201).json(allBusinesses);
    }

    else if (request.method === 'PUT') {
        const { id, ...updateData } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Business ID is required for update' });
        }
        
        const fields = Object.keys(updateData);
        if (fields.length === 0) {
            return response.status(400).json({ error: 'No update data provided' });
        }

        const setClause = fields.map((field, index) => `${toQuoted(field)} = $${index + 1}`).join(', ');
        const values = fields.map(field => {
            const value = updateData[field];
            if(field === 'services' || field === 'products') {
                return JSON.stringify(value);
            }
            return value;
        });

        const query = `UPDATE businesses SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *;`;
        values.push(id);

        const { rows } = await pool.query(query, values);
        return response.status(200).json(rows.length > 0 ? rows[0] : null);
    }

    else {
      response.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}