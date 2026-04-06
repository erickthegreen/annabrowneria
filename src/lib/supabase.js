// lib/supabase.js
// Cliente Supabase configurado via variáveis de ambiente VITE_*.
// Nunca exponha chaves secretas no frontend — apenas a anon key é segura aqui.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis de ambiente não configuradas. ' +
    'Crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
