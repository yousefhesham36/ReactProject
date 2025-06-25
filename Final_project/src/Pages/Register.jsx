import { logInAndRegisterSchema } from "@/forms/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAPI } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(logInAndRegisterSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAPI(data);
      navigate("/login");
    } catch (e) {
      console.error("❌ Registration failed:", e);
    } finally {
      reset();
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-primary mb-4">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" {...register("email")} />
            <p className="text-danger">{errors?.email?.message}</p>
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" {...register("password")} />
            <p className="text-danger">{errors?.password?.message}</p>
          </div>

          <div className="mb-3">
            <label>Name</label>
            <input className="form-control" {...register("name")} />
            <p className="text-danger">{errors?.name?.message}</p>
          </div>

          <div className="mb-3">
            <label>Username</label>
            <input className="form-control" {...register("username")} />
            <p className="text-danger">{errors?.username?.message}</p>
          </div>

          <div className="mb-3">
            <label>Phone</label>
            <input className="form-control" {...register("phone")} />
            <p className="text-danger">{errors?.phone?.message}</p>
          </div>

          <div className="mb-3">
            <label>Avatar URL</label>
            <input className="form-control" {...register("avatar")} placeholder="https://example.com/image.jpg" />
            <p className="text-danger">{errors?.avatar?.message}</p>
          </div>

          <div className="d-grid">
            <button className="btn btn-success">Create My Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
