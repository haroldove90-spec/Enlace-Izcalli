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
    const { endpoint } = request.body;

    if (!endpoint) {
      return response.status(400).json({ error: 'Endpoint is required to unsubscribe.' });
    }

    await pool.query('DELETE FROM subscriptions WHERE endpoint = $1', [endpoint]);

    return response.status(200).json({ message: 'Subscription removed successfully.' });

  } catch (error: any) {
    console.error('API Error in unsubscribe.ts:', error);
    return response.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}