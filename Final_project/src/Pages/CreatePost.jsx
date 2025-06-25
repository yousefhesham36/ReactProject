import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getMe } from "@/api/user";
import { createPostAPI } from "@/api/post";

export default function CreatePost() {
    const { register, handleSubmit, control } = useForm({
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

    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await getMe();
                setUserId(res.data.id);
            } catch (err) {
                console.log(err)
                Swal.fire("Error", "User not found", "error");
            }
        })();
    }, []);

    const onSubmit = async (data) => {
        if (!userId) return Swal.fire("Error", "No user ID", "error");

        try {
            await createPostAPI({ ...data, userId });
            Swal.fire("Success", "Post created", "success");
            navigate("/posts");
        } catch (err) {
            console.log(err)

            Swal.fire("Error", "Creation failed", "error");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h3 className="text-primary mb-4">New Post</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input className="form-control" {...register("title")} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Content</label>
                        <textarea className="form-control" {...register("content")} rows={4} required />
                    </div>

                    <h5 className="mt-3">Sections</h5>
                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded p-3 mb-3 bg-light">
                            <div className="mb-2">
                                <label className="form-label">Section Title</label>
                                <input className="form-control" {...register(`sections.${index}.title`)} required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Section Body</label>
                                <textarea className="form-control" rows="3" {...register(`sections.${index}.body`)} required />
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => remove(index)}
                            >
                                Remove Section
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline-primary mb-3"
                        onClick={() => append({ title: "", body: "" })}
                    >
                        + Add Section
                    </button>

                    <button className="btn btn-success w-100" type="submit">
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
}
