import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    if (request.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM categories ORDER BY id;');
      return response.status(200).json(rows);
    }

    else if (request.method === 'POST') {
      const { name } = request.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return response.status(400).json({ error: 'El nombre de la categoría es requerido y no puede estar vacío.' });
      }
      const trimmedName = name.trim();
      
      const { rows: existing } = await pool.query('SELECT id FROM categories WHERE name ILIKE $1 LIMIT 1', [trimmedName]);
      if (existing.length > 0) {
        return response.status(409).json({ error: `La categoría '${trimmedName}' ya existe.` });
      }

      await pool.query('INSERT INTO categories (name) VALUES ($1)', [trimmedName]);
      return response.status(201).json({ success: true, message: 'Categoría añadida exitosamente.' });
    }

    else if (request.method === 'DELETE') {
        const { id } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Category ID is required' });
        }
        
        const { rows } = await pool.query('SELECT COUNT(*) AS count FROM businesses WHERE "categoryId" = $1', [id]);
        const count = parseInt(rows[0].count, 10);

        if (count > 0) {
          return response.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo utilizada por uno o más negocios.' });
        }

        await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        return response.status(200).json({ message: 'Category deleted successfully' });
    }
    
    else {
      response.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error: any) {
     console.error('API Error in categories.ts:', error);
     const errorMessage = error.message || 'Ocurrió un error inesperado en el servidor.';
     return response.status(500).json({ error: errorMessage });
  }
}