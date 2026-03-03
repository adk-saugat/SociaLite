const API_BASE = "/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: token } : {};
}

export async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export const register = (username, email, password) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

export const login = (email, password) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// Posts
export const fetchAllPosts = () => api("/post/all");
export const fetchPost = (id) => api(`/post/${id}`);
export const createPost = (content) =>
  api("/post", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
export const deletePost = (id) => api(`/post/${id}`, { method: "DELETE" });

// User
export const getUserProfile = () => api("/user/me");
export const getUserFollowers = () => api("/user/follower");
export const getUserFollowing = () => api("/user/following");

// Follow
export const followUser = (id) => api(`/follow/${id}`, { method: "POST" });
export const unfollowUser = (id) =>
  api(`/unfollow/${id}`, { method: "DELETE" });
