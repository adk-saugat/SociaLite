import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
} from "../api/client";

const getId = (f) => f.FollowerId ?? f.followerId;
const getName = (f) => f.Username ?? f.username;

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(true);
  const [followingLoading, setFollowingLoading] = useState(true);
  const [followedBackIds, setFollowedBackIds] = useState(new Set());

  useEffect(() => {
    getUserFollowers()
      .then((data) => setFollowers(data.followers || []))
      .catch(() => setFollowers([]))
      .finally(() => setFollowersLoading(false));
  }, []);

  useEffect(() => {
    getUserFollowing()
      .then((data) => setFollowing(data.following || []))
      .catch(() => setFollowing([]))
      .finally(() => setFollowingLoading(false));
  }, []);

  const handleFollowBack = async (followerId) => {
    try {
      await followUser(followerId);
      setFollowedBackIds((prev) => new Set([...prev, followerId]));
    } catch {
      setFollowedBackIds((prev) => new Set([...prev, followerId]));
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await unfollowUser(followingId);
      setFollowing((prev) => prev.filter((f) => getId(f) !== followingId));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-slate-800">Profile</h1>
        <dl className="space-y-5">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Username
            </dt>
            <dd className="mt-1 text-base sm:text-lg font-medium text-slate-800 break-all">
              {user?.username}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </dt>
            <dd className="mt-1 text-base sm:text-lg font-medium text-slate-800 break-all">
              {user?.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              User ID
            </dt>
            <dd className="mt-1 text-base sm:text-lg font-medium text-slate-800 break-all">
              {user?.id}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === "followers"
                ? "bg-slate-50 text-slate-900 border-b-2 border-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === "following"
                ? "bg-slate-50 text-slate-900 border-b-2 border-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            Following ({following.length})
          </button>
        </div>

        <div className="p-3 sm:p-4 min-h-[180px] sm:min-h-[200px]">
          {activeTab === "followers" && (
            <>
              {followersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : followers.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-600 font-medium">No followers yet.</p>
                  <p className="mt-1 text-sm text-slate-500">
                    When people follow you, they&apos;ll appear here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {followers.map((f) => {
                    const id = getId(f);
                    const followed = followedBackIds.has(id);
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between gap-3 rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-800 truncate min-w-0">
                          {getName(f)}
                        </span>
                        <button
                          onClick={() => handleFollowBack(id)}
                          disabled={followed}
                          className="rounded-lg bg-blue-600 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-default transition-colors shrink-0"
                        >
                          {followed ? "Following" : "Follow back"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}

          {activeTab === "following" && (
            <>
              {followingLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : following.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-600 font-medium">
                    Not following anyone yet.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Find people to follow from the feed!
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {following.map((f) => {
                    const id = getId(f);
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between gap-3 rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-800 truncate min-w-0">
                          {getName(f)}
                        </span>
                        <button
                          onClick={() => handleUnfollow(id)}
                          className="rounded-lg border border-slate-300 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                        >
                          Unfollow
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
