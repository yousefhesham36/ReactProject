import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { APIClient } from "@/api";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sections, setSections] = useState([{ title: "", body: "" }]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const location = useLocation(); // ⬅️ جديد

  const fetchData = async () => {
    try {
      const token = useAuthStore.getState().token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [postsRes, usersRes] = await Promise.all([
        APIClient.get("/posts", config),
        APIClient.get("/users", config),
      ]);

      setPosts(postsRes.data.reverse());
      setUsers(usersRes.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search]); // ⬅️ يتحدث تلقائيًا عند التنقل

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const { token } = useAuthStore.getState();

      let userId;
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        userId = decoded.id;
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
        return;
      }

      const data = {
        title,
        content,
        userId,
        sections: sections.filter(
          (s) => s.title.trim() !== "" && s.body.trim() !== ""
        ),
      };

      await APIClient.post("/posts", data);
      setTitle("");
      setContent("");
      setSections([{ title: "", body: "" }]);
      fetchData();

      document.getElementById("closeModalBtn")?.click();
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (err) {
      console.error("❌ Error creating post:", err);
    }
  };

  const handleSectionChange = (index, key, value) => {
    const updated = [...sections];
    updated[index][key] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, { title: "", body: "" }]);
  };

  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const getUser = (userId) => users.find((u) => u.id === userId);

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">
        <i className="fa-solid fa-house me-2"></i> All Posts
      </h2>

      {/* Posts List */}
      <div
        className="d-flex flex-column align-items-center gap-4"
        style={{ paddingBottom: "120px" }}
      >
        {posts.map((post) => {
          const user = getUser(post.userId);
          return (
            <div
              key={post.id}
              className="p-4 border rounded shadow-sm bg-white"
              style={{
                width: "100%",
                maxWidth: "800px",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="rounded-circle me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <h5 className="mb-0">{user?.name || "Unknown User"}</h5>
              </div>

              <h4 className="fw-bold">{post.title}</h4>
              <p>{post.content}</p>

              {post.sections.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-muted mb-2">Sections:</h6>
                  {post.sections.map((s, idx) => (
                    <div
                      key={idx}
                      className="mb-3 p-3 bg-light border rounded"
                    >
                      <h6 className="fw-bold mb-1">{s.title}</h6>
                      <p className="mb-0">{s.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ➕ Floating Button */}
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        }}
        data-bs-toggle="modal"
        data-bs-target="#postModal"
      >
        +
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="postModal"
        tabIndex="-1"
        aria-labelledby="postModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleCreatePost}>
              <div className="modal-header">
                <h5 className="modal-title" id="postModalLabel">
                  Create New Post
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="closeModalBtn"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Title</label>
                  <input
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Content</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>

                <h6 className="text-muted mt-3 mb-2">Sections</h6>
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 bg-light border rounded"
                  >
                    <input
                      className="form-control mb-2"
                      placeholder="Section Title"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionChange(index, "title", e.target.value)
                      }
                      required
                    />
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Section Body"
                      value={section.body}
                      onChange={(e) =>
                        handleSectionChange(index, "body", e.target.value)
                      }
                      required
                    ></textarea>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger mt-2"
                      onClick={() => removeSection(index)}
                    >
                      Remove Section
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addSection}
                >
                  Add Section
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  id="closeModalBtn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Submit Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
