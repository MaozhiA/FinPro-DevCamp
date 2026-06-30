import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import FinPro from "../../assets/INS.png";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    const { username, password } = data;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        navigate("/verify-email");
        return;
      }

      const backendResponse = await axios.post(
        "/v1/token",
        {},
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        },
      );
      console.log("Backend response:", backendResponse.data);

      const loginAccessKey = backendResponse.data.loginAccessKey;
      console.log("Logging in as:", username);
      console.log("Token received:", loginAccessKey);
      console.log("Stored token:", loginAccessKey);
      if (!loginAccessKey) {
        alert("Backend login failed. Please try again.");
        return;
      }

      localStorage.setItem("loginAccessKey", loginAccessKey);
      console.log("Login successful:", user.email);
      console.log("Token set:", localStorage.getItem("loginAccessKey"));
      logEvent(analytics, "login", { method: "email" });
      navigate("/client-profile");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img src={FinPro} alt="FinPro" className="h-64 w-64 object-cover" />
        </div>

        <h2 className="text-3xl font-semibold text-black mb-6">Log in</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="flex text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("username")}
              placeholder="Enter your email"
              className="w-full border-b border-gray-300 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
            />
          </div>

          <div>
            <label className="flex text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border-b border-gray-300 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#001580] text-white py-3 font-medium rounded-md hover:bg-gray-900 transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm">
          <p className="text-gray-500">New customer?</p>
          <a
            href="/register"
            className="text-black font-medium hover:underline"
          >
            Create account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
