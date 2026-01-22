import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LogIn.module.css";
import axios from "axios";

function LogIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // ✅ Correct env variable
  const backendUrl = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${backendUrl}/login`, // ✅ updated
        data,
        { withCredentials: true }
      );
      // console.log("Login response:", response.data);

      if (response.data.user?.id) {
        navigate("/chat");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "An error occurred during login");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Log In</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter Email"
            className={styles.loginInput}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Enter Password"
            className={styles.loginInput}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}

          <button type="submit" className={styles.loginBtn}>Submit</button>
        </form>

        <h4 className={styles.loginText}>
          Don't have an account? <Link to="/">Sign Up</Link>
        </h4>

        <p className={styles.footerText}>Developed By HARENDRA BHATI</p>
      </div>
    </div>
  );
}

export default LogIn;
