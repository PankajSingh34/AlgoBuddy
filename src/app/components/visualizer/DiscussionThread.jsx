'use client';
import { useState, useEffect, useCallback } from 'react';

const PAGE_LIMIT = 20;

export default function DiscussionThread({ topicId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadComments = useCallback(async (targetPage) => {
    const res = await fetch(`/api/comments/${encodeURIComponent(topicId)}?page=${targetPage}&limit=${PAGE_LIMIT}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load comments');
    }
    return data;
  }, [topicId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadComments(1)
      .then(data => {
        setComments(data.comments || []);
        setTotalPages(data.totalPages || 1);
        setPage(1);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [loadComments]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const data = await loadComments(nextPage);
      setComments(prev => [...prev, ...(data.comments || [])]);
      setTotalPages(data.totalPages || 1);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topicId, content: newComment })
      });
      const data = await res.json();
      if (data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto dark:text-white px-4 pb-12 w-full">
      <h2 className="text-2xl font-bold mb-6">Community Discussion</h2>
      
      <form onSubmit={handleSubmit} className="mt-4 flex gap-4 mb-8">
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question..." 
          className="flex-1 p-3 border rounded dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white" 
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded transition-colors">Post</button>
      </form>

      {loading ? (
        <p>Loading comments...</p>
      ) : error && comments.length === 0 ? (
        <p className="text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to start the discussion!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 border rounded dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-2">
                {comment.user_profiles?.avatar_url ? (
                  <img src={comment.user_profiles.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold">
                    {comment.user_profiles?.full_name?.[0] || 'U'}
                  </div>
                )}
                <span className="font-semibold">{comment.user_profiles?.full_name || 'Anonymous User'}</span>
                <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {page < totalPages && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-2.5 rounded border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load more comments'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
