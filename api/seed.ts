import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse,
) {
  return response.status(410).json({ 
    error: 'This API endpoint is deprecated and has been removed.',
    message: 'Database seeding is now handled in the admin dashboard via the Supabase client.' 
  });
}
