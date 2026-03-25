import React, { useMemo, useState } from "react";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";

// ==============================
// 🕒 Format Date Helper
// ==============================
const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const PostCard = ({ post, currentUser, onLike, onComment }) => {
  // ==============================
  // 🧠 State
  // ==============================
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // ==============================
  // ❤️ Check if user liked post
  // ==============================
  const isLiked = useMemo(() => {
    return post.likes?.some(
      (like) =>
        like.user === currentUser?.id ||
        like.user?._id === currentUser?.id
    );
  }, [post.likes, currentUser]);

  // ==============================
  // 💬 Handle Comment Submit
  // ==============================
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    await onComment(post._id, comment);
    setComment("");
  };

  // ==============================
  // ❤️ Handle Like Click
  // ==============================
  const handleLikeClick = () => {
    if (isLiked) {
      alert("You already liked this post ❤️");
      return;
    }

    onLike(post._id);

    // Trigger animation
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
  };

  // ==============================
  // 🖼️ Resolve Image URL
  // ==============================
  const imageSrc = post.imageUrl?.startsWith("http")
    ? post.imageUrl
    : `${
        process.env.REACT_APP_API_URL?.replace("/api", "") ||
        "http://localhost:5000"
      }${post.imageUrl}`;

  // ==============================
  // 🖼️ UI
  // ==============================
  return (
    <article className="card post-card">
      {/* User Info */}
      <div className="post-top">
        <div className="post-user">
          <div className="post-avatar">
            {post.username?.slice(0, 1).toUpperCase()}
          </div>

          <div>
            <h3>{post.user?.name || post.username}</h3>
            <p>@{post.username}</p>
          </div>
        </div>

        <button className="follow-btn" type="button">
          Follow
        </button>
      </div>

      {/* Date */}
      <div className="post-meta">{formatDate(post.createdAt)}</div>

      {/* Text */}
      {post.text && <p className="post-text">{post.text}</p>}

      {/* Image */}
      {post.imageUrl && (
        <div className="post-image-wrap">
          <img className="post-image" src={imageSrc} alt="Post" />
        </div>
      )}

      {/* Stats */}
      <div className="post-stats">
        <span onClick={() => setShowLikes((prev) => !prev)} style={{ cursor: "pointer" }}>
          {post.likes?.length || 0} likes
        </span>

        <span onClick={() => setShowComments((prev) => !prev)} style={{ cursor: "pointer" }}>
          {post.comments?.length || 0} comments
        </span>
      </div>

      {/* Likes Popup */}
      {showLikes && (
        <div className="likes-popup">
          <strong>Liked by:</strong>

          {post.likes?.length ? (
            post.likes.map((like, i) => (
              <div key={i}>@{like.username}</div>
            ))
          ) : (
            <div>No likes yet</div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={isLiked ? "action-btn liked" : "action-btn"}
          type="button"
          onClick={handleLikeClick}
        >
          <Heart
            size={18}
            className={`${likeAnimating ? "like-animate" : ""} ${
              isLiked ? "heart-liked" : ""
            }`}
            fill={isLiked ? "red" : "none"}
          />
          <span>Like</span>
        </button>

        <button
          className="action-btn"
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </button>

        <button
          className="action-btn"
          type="button"
          onClick={() => alert("Sharing feature coming soon 🚀")}
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <form className="comment-box" onSubmit={handleCommentSubmit}>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" disabled={!comment.trim()}>
              <Send size={16} />
            </button>
          </form>

          {post.comments?.length > 0 && (
            <div className="comments-list">
              {post.comments.slice(-2).map((c) => (
                <div className="comment-item" key={c._id}>
                  <strong>@{c.username}</strong>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default PostCard;