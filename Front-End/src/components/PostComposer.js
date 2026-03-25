import React, { useMemo, useRef, useState } from "react";
import { Camera, Smile, AlignLeft, Megaphone, Send, X } from "lucide-react";

// ==============================
// 😀 Emoji List
// ==============================
const EMOJIS = ["😀","😂","😍","😎","🔥","❤️","👍","🎉","🤔","😭","🥳","😅"];

const PostComposer = ({ onCreate, loading }) => {
  // ==============================
  // 🧠 State
  // ==============================
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [tab, setTab] = useState("all");
  const [showEmoji, setShowEmoji] = useState(false);

  const textareaRef = useRef(null);

  // ==============================
  // 🖼️ Image Preview
  // ==============================
  const preview = useMemo(() => {
    return image ? URL.createObjectURL(image) : "";
  }, [image]);

  // ==============================
  // ✍️ Handle Text Change + Auto Resize
  // ==============================
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // ==============================
  // 📤 Submit Post
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !image) return;

    await onCreate({ text, image });

    // Reset form
    setText("");
    setImage(null);
  };

  // ==============================
  // 😊 Add Emoji
  // ==============================
  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ==============================
  // 🖼️ UI
  // ==============================
  return (
    <section className="card composer-card" id="composer">
      {/* Header */}
      <div className="composer-head">
        <h2>Create Post</h2>

        <div className="segmented">
          <button
            type="button"
            className={tab === "all" ? "segmented-active" : ""}
            onClick={() => setTab("all")}
          >
            All Posts
          </button>

          <button
            type="button"
            className={tab === "promotions" ? "segmented-active" : ""}
            onClick={() => setTab("promotions")}
          >
            Promotions
          </button>
        </div>
      </div>

      {/* Promotions Placeholder */}
      {tab === "promotions" ? (
        <div className="empty-state">
          Promotions are coming soon 🚀. Meanwhile, share your thoughts on the main feed.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="composer-form">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="What's on your mind?"
            rows={2}
            style={{ resize: "none", overflow: "hidden" }}
          />

          {/* Image Preview */}
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />

              <button
                type="button"
                className="remove-img"
                onClick={() => setImage(null)}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmoji && (
            <div className="emoji-picker">
              {EMOJIS.map((emoji, index) => (
                <span key={index} onClick={() => handleEmojiSelect(emoji)}>
                  {emoji}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="composer-actions">
            {/* Image Upload */}
            <label className="tool-btn">
              <Camera size={18} />
              <span>Image</span>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>

            {/* Emoji Toggle */}
            <button
              type="button"
              className="tool-btn"
              onClick={() => setShowEmoji((prev) => !prev)}
            >
              <Smile size={18} />
              <span>Emoji</span>
            </button>

            {/* Format */}
            <button
              type="button"
              className="tool-btn"
              onClick={() => alert("Formatting tools coming soon ✨")}
            >
              <AlignLeft size={18} />
              <span>Format</span>
            </button>

            {/* Promote */}
            <button
              type="button"
              className="tool-btn promote-btn"
              onClick={() =>
                alert("Promotion feature coming soon 🚀. Keep posting!")
              }
            >
              <Megaphone size={18} />
              <span>Promote</span>
            </button>

            {/* Submit */}
            <button
              className="post-btn"
              type="submit"
              disabled={loading || (!text.trim() && !image)}
            >
              <Send size={16} />
              <span>{loading ? "Posting..." : "Post"}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default PostComposer;