import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
  );

  try {
    if (request.method === 'GET') {
      const { data, error } = await supabase.from('categories').select('*').order('id');
      if (error) throw error;
      return response.status(200).json(data);
    }

    else if (request.method === 'POST') {
      const { name } = request.body;
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return response.status(400).json({ error: 'El nombre de la categoría es requerido y no puede estar vacío.' });
      }
      const trimmedName = name.trim();
      
      const { data: existing, error: selectError } = await supabase.from('categories').select('id').ilike('name', trimmedName).limit(1);
      if (selectError) throw selectError;
      if (existing && existing.length > 0) {
        return response.status(409).json({ error: `La categoría '${trimmedName}' ya existe.` });
      }

      const { error: insertError } = await supabase.from('categories').insert({ name: trimmedName });
      if (insertError) throw insertError;

      return response.status(201).json({ success: true, message: 'Categoría añadida exitosamente.' });
    }

    else if (request.method === 'DELETE') {
        const { id } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Category ID is required' });
        }
        
        const { count, error: countError } = await supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('categoryId', id);
        if (countError) throw countError;

        if (count && count > 0) {
          return response.status(409).json({ error: 'No se puede eliminar la categoría porque está siendo utilizada por uno o más negocios.' });
        }

        const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
        if (deleteError) throw deleteError;

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