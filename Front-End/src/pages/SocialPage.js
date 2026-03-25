import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

// Components
import TopBar from "../components/TopBar";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import BottomNav from "../components/BottomNav";

const SocialPage = () => {
  const { user, logout } = useAuth();
  const composerRef = useRef(null);

  // ==============================
  // 🧠 State Management
  // ==============================
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posting, setPosting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filter, setFilter] = useState("all");

  // ==============================
  // 🔍 Debounced Search
  // ==============================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ==============================
  // 📡 Fetch Posts (Pagination)
  // ==============================
  const fetchPosts = async (nextPage = 1, replace = true) => {
    try {
      replace ? setLoadingPosts(true) : setLoadingMore(true);

      const res = await api.get(`/posts?page=${nextPage}&limit=8`);

      setPosts((prev) =>
        replace ? res.data.posts : [...prev, ...res.data.posts]
      );

      setHasMore(res.data.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoadingPosts(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // ==============================
  // 🎯 Filter + Search Logic
  // ==============================
  const visiblePosts = useMemo(() => {
    let filtered = [...posts];

    // 🔍 Search filter
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();

      filtered = filtered.filter(
        (post) =>
          post.text?.toLowerCase().includes(query) ||
          post.username?.toLowerCase().includes(query) ||
          post.user?.name?.toLowerCase().includes(query)
      );
    }

    // 📊 Sorting filters
    if (filter === "liked") {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (filter === "commented") {
      filtered.sort(
        (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
      );
    }

    return filtered;
  }, [posts, debouncedSearch, filter]);

  // ==============================
  // ✍️ Create Post
  // ==============================
  const createPost = async ({ text, image }) => {
    setPosting(true);

    try {
      const formData = new FormData();
      formData.append("text", text || "");
      if (image) formData.append("image", image);

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add new post on top
      setPosts((prev) => [res.data, ...prev]);

      // Scroll to composer
      composerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Create post error:", error);
    } finally {
      setPosting(false);
    }
  };

  // ==============================
  // ❤️ Like Post
  // ==============================
  const likePost = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (error) {
      console.error("Like post error:", error);
    }
  };

  // ==============================
  // 💬 Comment on Post
  // ==============================
  const commentPost = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comments`, { text });

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data : p))
      );
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  // ==============================
  // 🎯 Scroll to Composer
  // ==============================
  const scrollToComposer = () => {
    composerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ==============================
  // 🖼️ UI
  // ==============================
  return (
    <div className="social-page">
      <TopBar
        search={search}
        setSearch={setSearch}
        user={user}
        onLogout={logout}
      />

      <main className="main-shell">
        {/* Composer */}
        <div ref={composerRef}>
          <PostComposer onCreate={createPost} loading={posting} />
        </div>

        {/* Filters */}
        <div className="filter-row">
          <button
            className={filter === "all" ? "chip active" : "chip"}
            onClick={() => setFilter("all")}
          >
            All Post
          </button>

          <button
            className={filter === "forYou" ? "chip active" : "chip"}
            onClick={() => setFilter("forYou")}
          >
            For You
          </button>

          <button
            className={filter === "liked" ? "chip active" : "chip"}
            onClick={() => setFilter("liked")}
          >
            Most Liked
          </button>

          <button
            className={filter === "commented" ? "chip active" : "chip"}
            onClick={() => setFilter("commented")}
          >
            Most Commented
          </button>
        </div>

        {/* Feed */}
        <section className="feed">
          {loadingPosts ? (
            <div className="center-screen">Loading feed...</div>
          ) : visiblePosts.length ? (
            visiblePosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={user}
                onLike={likePost}
                onComment={commentPost}
              />
            ))
          ) : (
            <div className="empty-state">
              No results found. Try searching something else 🔍
            </div>
          )}

          {/* Pagination */}
          {hasMore && (
            <button
              className="load-more"
              type="button"
              disabled={loadingMore}
              onClick={() => fetchPosts(page + 1, false)}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fab" type="button" onClick={scrollToComposer}>
        +
      </button>

      {/* Bottom Navigation */}
      <BottomNav onCreateClick={scrollToComposer} />
    </div>
  );
};

export default SocialPage;