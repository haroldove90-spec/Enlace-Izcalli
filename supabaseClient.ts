import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sidhncryoptzcntiirni.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZGhuY3J5b3B0emNudGlpcm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzE2NDQsImV4cCI6MjA3ODU0NzY0NH0.4lyiOT3koaP5YBHv2kHQ5leG_LS3uO41e1lqGRgRNfs';

export const supabase = createClient(supabaseUrl, supabaseKey);
