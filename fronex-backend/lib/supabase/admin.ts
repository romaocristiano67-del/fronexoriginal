import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com a SERVICE_ROLE_KEY — ignora RLS.
 * USO EXCLUSIVO no servidor (API Routes), NUNCA exposto ao cliente.
 * Necessário para: gerir anon_sessions, deduzir tokens, gravar chat_logs
 * e service_inquiries independentemente do usuário estar autenticado.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Variáveis de ambiente do Supabase (admin) não configuradas: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
