import { useEffect, useState } from "react";
import { getAllPostsAPI, deletePostAPI } from "@/api/post";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import Swal from "sweetalert2";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const { userId } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllPostsAPI();
        setPosts(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch posts:", error);
      }
    })();
  }, []);

  const userPosts = posts.filter((post) => post.userId === userId);

  const handleDelete = async (postId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deletePostAPI(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      Swal.fire("Deleted!", "The post has been deleted successfully.", "success");
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      Swal.fire("Error", "There was a problem deleting the post.", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary mb-4">
        <i className="fa-solid fa-list me-2"></i> My Posts
      </h2>

      {userPosts.length === 0 ? (
        <p className="text-muted text-center">You haven't created any posts yet.</p>
      ) : (
        <div className="d-flex flex-column align-items-center gap-4">
          {userPosts.map((post) => (
            <div
              className="p-4 border rounded shadow-sm bg-white position-relative"
              key={post.id}
              style={{
                width: "100%",
                maxWidth: "800px",
                maxHeight: "650px",
                overflowY: "auto",
              }}
            >
              <Link
                to={`/posts/${post.id}`}
                className="btn btn-sm btn-dark position-absolute"
                style={{ top: "16px", right: "16px" }}
              >
                <i className="fa-solid fa-eye me-1"></i> View
              </Link>

              <h4 className="fw-bold text-primary">{post.title}</h4>
              <p>{post.content}</p>

              {post.sections?.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-muted mb-2">Sections:</h6>
                  {post.sections.map((section, index) => (
                    <div
                      key={index}
                      className="mb-3 p-3 bg-light border rounded"
                    >
                      <h6 className="fw-bold mb-1">{section.title}</h6>
                      <p className="mb-0">{section.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  <i className="fa-solid fa-pen me-1"></i> Edit
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <i className="fa-solid fa-trash me-1"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
