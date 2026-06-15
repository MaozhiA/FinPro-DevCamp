import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import FinPro from '../../assets/FinPro (1).png';
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
  <div className="min-h-screen bg-white flex items-center justify-center px-6">
    <div className="w-full max-w-md">

      
      <div className="mb-12">
        <h1 className=" flex justify-center items-center" >
          <img 
          src={FinPro}
          alt="FinPro"
          className="h-64 w-64 flex object-cover "
          />
        </h1>

      </div>

    
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-black">
          Sign in
        </h2>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-black mb-2">
            Username
          </label>
            </div> 

            <div>
          <input
            {...register("username")}
            placeholder="Enter your username"
            className="
              w-full
              border-b
              border-gray-300
              py-3
              text-black
              placeholder:text-gray-400
              focus:border-black
              focus:outline-none
              transition
            "
          />
        </div>

     
        <div>

          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-black">
              Password
            </label>

            <a
              href="#"
              className="text-sm text-gray-600 hover:text-black"
            >
              Forgot Password?
            </a>
          </div>

          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="
              w-full
              border-b
              border-gray-300
              py-3
              text-black
              placeholder:text-gray-400
              focus:border-black
              focus:outline-none
              transition
            "
          />
        </div>

    
        <button
          type="submit"
          className="
            w-full
            bg-[#001580]
            text-white
            py-3
            font-medium
            rounded-md
            hover:bg-gray-900
            transition
          "
        >
          Log In
        </button>
      </form>

      
      <div className="mt-8 flex justify-between text-sm">
        <p className="text-gray-500">
          New customer?
        </p>

        <a
          href="/register"
          className="text-black font-medium hover:underline"
        >
          Create account
        </a>
      </div>

      <p className="mt-12 text-xs text-gray-400">
        Protected by enterprise-grade security and encryption.
      </p>
    </div>
  </div>
);
};

export default Login;