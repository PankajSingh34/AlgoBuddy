import { cookies } from 'next/headers';
import { getSupabaseServerClient, jsonResponse, errorResponse } from '@/lib/serverApi';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    
    const { data: leaderboard, error } = await supabase
      .from('global_leaderboard')
      .select('*')
      .limit(50);

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
    
    return jsonResponse({ leaderboard: leaderboard || [] });
  } catch (error) {
    return errorResponse(error);
  }
}
