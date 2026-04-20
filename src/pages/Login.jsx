import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import { loginSuccess } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
const user = useSelector((state) => state.auth.user);
useEffect(() => {
  if (user) {
    navigate("/"); 
  }
}, [user, navigate]);
  
  const handleLogin = async (data) => {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = result.user;

      
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          name:user.displayName
        })
      );

      alert("Login Successful ✅");

      
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to OLX</h2>

        <form onSubmit={handleSubmit(handleLogin)}>
          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          <button type="submit">Login</button>
        </form>

        
        <p className="signup-text">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;