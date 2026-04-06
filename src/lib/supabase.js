// lib/supabase.js
// Exporta o cliente Supabase APENAS se as variáveis estiverem configuradas.
// Assim evita erros de inicialização com URL inválida.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
