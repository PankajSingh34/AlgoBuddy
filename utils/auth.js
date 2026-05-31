import { supabase } from '../lib/supabase'

export async function getToken() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user || null
}