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
      const { data, error } = await supabase.from('businesses').select('*').order('id');
      if (error) throw error;
      return response.status(200).json(data);
    } 
    
    else if (request.method === 'POST') {
      const { name, ownerName, ownerEmail, ...rest } = request.body;
      if (!name || !ownerName || !ownerEmail) {
         return response.status(400).json({ error: 'Name, owner name, and email are required' });
      }
      const { error } = await supabase
        .from('businesses')
        .insert({ name, ownerName, ownerEmail, ...rest })
        .select();
      if (error) throw error;
      // After insert, Supabase returns an array, so we return all businesses for consistency with old API
      const { data: allBusinesses, error: fetchAllError } = await supabase.from('businesses').select('*').order('id');
      if(fetchAllError) throw fetchAllError;

      return response.status(201).json(allBusinesses);
    }

    else if (request.method === 'PUT') {
        const { id, ...updateData } = request.body;
        if (!id) {
            return response.status(400).json({ error: 'Business ID is required for update' });
        }
        const { data, error } = await supabase
          .from('businesses')
          .update(updateData)
          .eq('id', id)
          .select();
        if (error) throw error;
        return response.status(200).json(data ? data[0] : null);
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