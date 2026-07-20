import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';

const MAX_COMMENT_LIMIT = 50;

export async function GET(req, { params }) {
  const { topic_id } = await params;
  const cookieStore = await cookies();
  const supabase = getSupabaseServerClient(cookieStore);

  const { searchParams } = new URL(req.url);
  let limit = parseInt(searchParams.get("limit") || "20", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 20;
  if (limit > MAX_COMMENT_LIMIT) limit = MAX_COMMENT_LIMIT;
  let offset = parseInt(searchParams.get("offset") || "0", 10);
  if (!Number.isFinite(offset) || offset < 0) offset = 0;

  const { data: comments, error } = await supabase
    .from('topic_comments')
    .select(`
      *,
      user_profiles ( full_name, avatar_url )
    `)
    .eq('topic_id', topic_id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit);

  if (error) {
    return Response.json({ comments: [], error: error.message }, { status: 500 });
  }

  return Response.json({ comments, limit, offset, hasMore: comments.length === limit + 1 });
}
