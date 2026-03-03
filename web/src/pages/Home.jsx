import { useState, useEffect } from "react";
import { fetchAllPosts, createPost, deletePost, followUser } from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatRelativeTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const secs = Math.floor((now - date) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ name, size = "md", className = "" }) {
  const s = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`${s} shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-sm ${className}`}
    >
      {initial}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [followedIds, setFollowedIds] = useState(new Set());

  useEffect(() => {
    fetchAllPosts()
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await createPost(content.trim());
      setPosts((prev) => [data.post, ...prev]);
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, postUserId) => {
    if (postUserId !== user?.id) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
  };

  const handleFollow = async (userId) => {
    if (userId === user?.id) return;
    try {
      await followUser(userId);
      setFollowedIds((prev) => new Set([...prev, userId]));
    } catch {
      // already following or error - treat as followed for UI
      setFollowedIds((prev) => new Set([...prev, userId]));
    }
  };

  return (
    <div className="max-w-[600px] mx-auto w-full">
      {user && (
        <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          <form onSubmit={handleCreatePost} className="flex gap-2 sm:gap-3">
            <Avatar name={user?.username} className="hidden sm:flex shrink-0" />
            <div className="flex-1 min-w-0">
              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <div className="mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-100 pt-2 sm:pt-3">
                <span className="text-sm text-slate-400">Text only</span>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white py-12 sm:py-16 text-center shadow-sm">
          <p className="text-slate-600 font-medium">No posts yet.</p>
          <p className="mt-1 text-sm text-slate-500">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <header className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 pb-0 flex-wrap">
                <Avatar name={post.username} />
                <div className="flex-1 min-w-0 flex-shrink">
                  <p className="font-semibold text-slate-900">
                    {post.username || `User ${post.userId}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatRelativeTime(post.createdAt)}
                  </p>
                </div>
                {user && user.id !== post.userId && (
                  <button
                    onClick={() => handleFollow(post.userId)}
                    disabled={followedIds.has(post.userId)}
                    className="rounded-lg bg-blue-600 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-default transition-colors shrink-0"
                  >
                    {followedIds.has(post.userId) ? "Following" : "Follow"}
                  </button>
                )}
                {user?.id === post.userId && (
                  <button
                    onClick={() => handleDelete(post.id, post.userId)}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete post"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </header>
              <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>
              <div className="flex items-center gap-0 sm:gap-1 px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-100">
                <button className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-default">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Like
                </button>
                <button className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-default shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comment
                </button>
                <button className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-default shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
