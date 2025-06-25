import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePostAPI } from "@/api/post";
import { useForm, useFieldArray } from "react-hook-form";
import { getMe } from "@/api/user";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const { register, handleSubmit, control, reset } = useForm({
        defaultValues: {
            title: "",
            content: "",
            sections: [{ title: "", body: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sections",
    });

    useEffect(() => {
        (async () => {
            try {
                const postRes = await getPostById(id);
                const userRes = await getMe();

                setUserId(userRes.data.id);

                reset({
                    title: postRes.data.title,
                    content: postRes.data.content,
                    sections:
                        postRes.data.sections?.length > 0
                            ? postRes.data.sections.map((s) => ({
                                title: s.title,
                                body: s.body,
                            }))
                            : [{ title: "", body: "" }],
                });
            } catch (err) {
                console.error("❌ Error loading post or user:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            const updatedPost = {
                title: data.title,
                content: data.content,
                userId: userId,
                sections: data.sections.filter(
                    (section) => section.title.trim() !== "" && section.body.trim() !== ""
                ),
            };

            console.log("📤 Data to be sent to API:", JSON.stringify(updatedPost, null, 2));

            await updatePostAPI(id, updatedPost);
            navigate(`/posts/${id}`);
        } catch (err) {
            console.error("❌ Error updating post:", err);
            alert("Error while updating the post.");
        }
    };


    if (loading) return <p className="text-center mt-5">🔄 Loading post...</p>;

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-lg">
                <h3 className="mb-3 text-primary text-center">Edit Post</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input className="form-control" {...register("title")} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea
                            className="form-control"
                            rows="5"
                            {...register("content")}
                            required
                        ></textarea>
                    </div>

                    <h5 className="mb-2">Sections</h5>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded p-3 mb-3">
                            <div className="mb-2">
                                <label>Section Title</label>
                                <input
                                    className="form-control"
                                    {...register(`sections.${index}.title`)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label>Section Body</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    {...register(`sections.${index}.body`)}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => remove(index)}
                            >
                                Remove Section
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline-secondary mb-3"
                        onClick={() => append({ title: "", body: "" })}
                    >
                        + Add Section
                    </button>

                    <button className="btn btn-success w-100" type="submit">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
