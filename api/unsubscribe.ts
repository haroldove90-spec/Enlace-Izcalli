import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
  );
  
  try {
    const { endpoint } = request.body;

    if (!endpoint) {
      return response.status(400).json({ error: 'Endpoint is required to unsubscribe.' });
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Supabase error removing subscription:', error);
      throw error;
    }

    return response.status(200).json({ message: 'Subscription removed successfully.' });

  } catch (error: any) {
    console.error('API Error in unsubscribe.ts:', error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}