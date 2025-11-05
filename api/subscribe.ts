import { Pool } from 'pg';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
  
  try {
    const subscription = request.body;

    if (!subscription || !subscription.endpoint) {
      return response.status(400).json({ error: 'Subscription object is invalid.' });
    }

    const query = `
      INSERT INTO subscriptions (endpoint, subscription_data)
      VALUES ($1, $2)
      ON CONFLICT (endpoint)
      DO UPDATE SET subscription_data = EXCLUDED.subscription_data;
    `;
    const values = [subscription.endpoint, subscription];
    
    await pool.query(query, values);

    return response.status(201).json({ message: 'Subscription saved successfully.' });

  } catch (error: any) {
    console.error('API Error in subscribe.ts:', error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}