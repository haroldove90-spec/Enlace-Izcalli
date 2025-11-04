import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
     if (request.method === 'GET') {
      const { rows } = await sql`SELECT * FROM categories ORDER BY id;`;
      return response.status(200).json(rows);
    }

    else if (request.method === 'POST') {
      const { name } = request.body;
      if (!name) {
        return response.status(400).json({ error: 'Category name is required' });
      }
      await sql`INSERT INTO categories (name) VALUES (${name});`;
      const { rows } = await sql`SELECT * FROM categories ORDER BY id;`;
      return response.status(201).json(rows);
    }

    else if (request.method === 'DELETE') {
        const { id } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Category ID is required' });
        }
        await sql`DELETE FROM categories WHERE id = ${id};`;
        return response.status(200).json({ message: 'Category deleted successfully' });
    }
    
    else {
      response.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error) {
     console.error('API Error:', error);
     return response.status(500).json({ error });
  }
}
