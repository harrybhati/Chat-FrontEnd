import React from "react";
import "./SingIn.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SingIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const Resp = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        data,
        { withCredentials: true }
      );
      console.log("Server response:", Resp.data);
      navigate("/chat");
    } catch (err) {
      console.error("Error during sign up:", err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter Name"
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter Email"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 5, message: "Password must be at least 5 characters" }
            })}
            placeholder="Enter Password"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

          <button type="submit">Submit</button>

          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>

        <p className="footer-text">Developed By HARENDRA BHATI</p>
      </div>
    </div>
  );
}

export default SingIn;
