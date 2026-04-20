import React from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import "./Signup.css";
import { Link } from "react-router-dom";
function Signup() {
  const navigate = useNavigate(); // ✅ FIXED
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // ✅ Add name
      await updateProfile(user, {
        displayName: data.name,
      });

      // ✅ Dispatch to Redux (IMPORTANT 🔥)
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          name: data.name,
        })
      );

      alert("Signup Successful ✅");

      // 👉 Redirect
      navigate("/");

    } catch (err) {
      alert(err.message);
    }
  };

  const password = watch("password");

  return (
  <div className="signup-container">
    <div className="signup-box">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message}</p>
        )}

        <button type="submit">Signup</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  </div>
);
}

export default Signup;