import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const { topic_id, content } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('topic_comments')
      .insert([
        {
          topic_id,
          user_id: user.id,
          content
        }
      ])
      .select(`
        *,
        user_profiles ( full_name, avatar_url )
      `)
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ comment: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
