import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import './login.css';


const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const { username, password } = data;

      const credentials = btoa(`${username}:${password}`);

      const response = await axios.post(
        '/v1/token',
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            Accept: 'application/json',
          }
        }
      );

      const token =
        response.data.loginAccessKey ||
        response.data.token ||
        response.data.accessToken;

      if (!token) throw new Error("No token returned");

      localStorage.setItem('loginAccessKey', token);

      navigate('/home');

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-sm space-y-8 ">

        <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8">

        <div>
          <label className="block mb-3 text-sm font-medium ">Username:</label>

          <input {...register("username")} 
          placeholder="Enter your username"
          className="w-full border-b border-gray-300 py-3 outline-none focus:border-slate-900 placeholder:text-sm "/>

        </div>

        <div>
          <label className="block mb-3 text-sm font-medium ">Password:</label>

          <input type="password" {...register("password")} 
          placeholder="Enter your password"
          className="w-full border-b border-gray-300 py-3 outline-none focus:border-slate-900 placeholder:text-sm "/>
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Dont have an account ? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
      </p>
    </div>
    </div>
  );
};

export default Login;