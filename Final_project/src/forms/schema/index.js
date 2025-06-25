import * as yup from "yup";

export const logInAndRegisterSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  phone: yup
    .string()
    .matches(/^01[0-2,5]{1}[0-9]{8}$/, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),
  avatar: yup.string().url("Please enter a valid URL for avatar").required("Avatar is required"),
});
