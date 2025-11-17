import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zfddipoybjxchbmncepj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZGRpcG95Ymp4Y2hibW5jZXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTM5NzYsImV4cCI6MjA3ODE2OTk3Nn0.th5Pp7tjX58KhlqpqXIzTkbgEhAvmxl1jn3q88Cee70'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const withUserHeader = (userId: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-user-id': userId,
      },
    },
  })
}