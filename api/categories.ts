import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const client = createClient({
      connectionString: process.env.POSTGRES_URL,
  });

  try {
    await client.connect();

    if (request.method === 'GET') {
      const { rows } = await client.query('SELECT * FROM categories ORDER BY id;');
      return response.status(200).json(rows);
    }

    else if (request.method === 'POST') {
      const { name } = request.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return response.status(400).json({ error: 'El nombre de la categoría es requerido y no puede estar vacío.' });
      }
      
      const trimmedName = name.trim();
      const { rowCount } = await client.query('SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1);', [trimmedName]);
      if (rowCount > 0) {
        return response.status(409).json({ error: `La categoría '${trimmedName}' ya existe.` });
      }

      await client.query('INSERT INTO categories (name) VALUES ($1);', [trimmedName]);
      return response.status(201).json({ success: true, message: 'Categoría añadida exitosamente.' });
    }

    else if (request.method === 'DELETE') {
        const { id } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Category ID is required' });
        }
        
        const { rowCount } = await client.query('SELECT 1 FROM businesses WHERE categoryId = $1;', [id]);
        if (rowCount > 0) {
          return response.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo utilizada por uno o más negocios.' });
        }

        await client.query('DELETE FROM categories WHERE id = $1;', [id]);
        return response.status(200).json({ message: 'Category deleted successfully' });
    }
    
    else {
      response.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return response.status(405).end(`Method ${request.method} Not Allowed`);
    }
  } catch (error) {
     console.error('API Error in categories.ts:', error);
     let errorMessage = 'Ocurrió un error inesperado en el servidor.';
     if (error instanceof Error) {
       errorMessage = error.message;
     } else if (typeof error === 'string') {
       errorMessage = error;
     }
     return response.status(500).json({ error: errorMessage });
  } finally {
    await client.end();
  }
}