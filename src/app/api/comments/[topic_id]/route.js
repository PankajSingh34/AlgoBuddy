import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(req, { params }) {
  const { topic_id } = await params;

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit')) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);

  const { data: comments, error, count } = await supabase
    .from('topic_comments')
    .select(`
      id,
      topic_id,
      content,
      created_at,
      user_profiles ( full_name, avatar_url )
    `, { count: 'exact' })
    .eq('topic_id', topic_id)
    .order('created_at', { ascending: false })
    .range(skip, skip + limit - 1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    comments: comments || [],
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  });
}
