import { logInAPI } from "@/api/auth";
import { logInAndRegisterSchema } from "@/forms/schema";
import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { search } = useLocation();
  const { redirectTo } = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      logInAndRegisterSchema.pick(["email", "password"])
    ),
  });

  const onSubmit = async (data) => {
    try {
      const res = await logInAPI(data);
      console.log("🟢 Login response: ", res.data);
      setTokens(res.data);
      navigate(redirectTo ?? "/");
    } catch (e) {
      console.error("Login error:", e);
      alert("Email or Password is incorrect");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center text-primary mb-4">Welcome Back</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" {...register("email")} />
            <p className="text-danger">{errors?.email?.message}</p>
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              {...register("password")}
            />
            <p className="text-danger">{errors?.password?.message}</p>
          </div>

          <div className="d-grid">
            <button className="btn btn-success">Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
}
