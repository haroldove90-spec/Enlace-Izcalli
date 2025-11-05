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
    const subscription = request.body;

    if (!subscription || !subscription.endpoint) {
      return response.status(400).json({ error: 'Subscription object is invalid.' });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        { 
          endpoint: subscription.endpoint, 
          subscription_data: subscription 
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('Supabase error saving subscription:', error);
      throw error;
    }

    return response.status(201).json({ message: 'Subscription saved successfully.' });

  } catch (error: any) {
    console.error('API Error in subscribe.ts:', error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}