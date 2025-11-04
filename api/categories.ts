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
        return response.status(400).json({ error: 'El nombre de la categoría es requerido.' });
      }
      
      const trimmedName = name.trim();
      const { rowCount } = await sql`SELECT 1 FROM categories WHERE LOWER(name) = LOWER(${trimmedName});`;
      if (rowCount > 0) {
        return response.status(409).json({ error: `La categoría '${trimmedName}' ya existe.` });
      }

      await sql`INSERT INTO categories (name) VALUES (${trimmedName});`;
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
     const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
     return response.status(500).json({ error: message });
  }
}