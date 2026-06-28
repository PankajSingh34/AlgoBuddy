import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req, { params }) {
  const { topic_id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: comments } = await supabase
    .from('topic_comments')
    .select(`
      *,
      user_profiles ( full_name, avatar_url )
    `)
    .eq('topic_id', topic_id)
    .order('created_at', { ascending: false });

  return Response.json({ comments });
}
