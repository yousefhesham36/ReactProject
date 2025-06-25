// src/pages/SinglePost.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "@/api/post";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPostById(id);
        setPost(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-center mt-5">🔄 Loading post...</p>;

  if (!post) return <p className="text-center text-danger mt-5">❌ Post not found</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-primary mb-3">
          <i className="fa-solid fa-pen me-2"></i> {post.title}
        </h2>
        <p className="text-muted">{post.content}</p>

        {post.sections?.length > 0 && (
          <>
            <h4 className="mt-4">Sections</h4>
            {post.sections.map((section, idx) => (
              <div key={idx} className="border rounded p-3 mb-3 bg-light">
                <h5 className="fw-bold text-secondary">
                  <i className="fa-solid fa-book me-2"></i>
                  {section.title}
                </h5>
                <p>{section.body}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
