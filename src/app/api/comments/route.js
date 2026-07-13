import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/serverApi';
import { validateCsrfOrigin } from '@/lib/csrfConstants';

const MAX_COMMENT_LENGTH = 2000;

export async function POST(req) {
  if (!validateCsrfOrigin(req)) {
    return Response.json({ error: "CSRF validation failed: untrusted origin" }, { status: 403 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = getSupabaseServerClient(cookieStore);
    const body = await req.json().catch(() => ({}));
    const { topic_id, content } = body;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!topic_id) {
      return Response.json({ error: 'topic_id is required' }, { status: 400 });
    }

    const trimmedContent = String(content || '').trim();
    if (!trimmedContent) {
      return Response.json({ error: 'content cannot be empty' }, { status: 400 });
    }
    if (trimmedContent.length > MAX_COMMENT_LENGTH) {
      return Response.json({ error: `content must be under ${MAX_COMMENT_LENGTH} characters` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('topic_comments')
      .insert([
        {
          topic_id,
          user_id: user.id,
          content: trimmedContent
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
