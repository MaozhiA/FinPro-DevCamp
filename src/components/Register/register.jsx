import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from "react-router-dom";

import { auth } from '../../firebase';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

    const registerWithBackend = async (email, password) => {
        try {
            await axios.post('/v1/user', { username: email, password });
        } catch (error) {
           
            if (error.response?.status !== 400) {
                throw new Error('Backend registration failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1. Firebase registration
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredentials.user);

            // 2. Backend registration
            await registerWithBackend(email, password);

            toast.success("Verification email sent! Check your inbox.");
            navigate("/verify-email");

        } catch (error) {
            console.error(error);

            if (error.code === "auth/email-already-in-use") {
                toast.error("Account already exists. Please log in.");
                navigate("/login");
                return;
            }

            toast.error(error.message || "Registration failed. Please try again.");
        }
    };

const handleGoogleSignin = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Register Google user in backend (uses Firebase UID as their backend password)
        await registerWithBackend(user.email, user.uid);

        // Log in to backend to get loginAccessKey
        const backendResponse = await axios.post(
            '/v1/token',
            {},
            {
                headers: {
                    Authorization: `Basic ${btoa(`${user.email}:${user.uid}`)}`,
                },
            }
        );

        const loginAccessKey = backendResponse.data.loginAccessKey;

        if (!loginAccessKey) {
            toast.error("Backend login failed. Please try again.");
            return;
        }

        localStorage.setItem('loginAccessKey', loginAccessKey);

        if (user.emailVerified) {
            navigate("/client-profile");
        } else {
            navigate("/verify-email");
        }

    } catch (error) {
        console.error("Google sign-in failed:", error);
        toast.error("Google sign-in failed. Please try again.");
    }
};

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                <h2 className="text-black text-2xl mb-4">Register</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-sm">
                        <label className="flex mb-1">Email:</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-gray-400 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                        />
                    </div>

                    <div className="mb-4 text-sm">
                        <label className="flex mb-1">Password:</label>
                        <input
                            type="password"
                            value={password}
                            placeholder="enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-gray-400 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#001580] text-white py-3 font-medium rounded-md hover:bg-gray-900 transition"
                    >
                        Register
                    </button>
                </form>
          <div className="flex justify-between items-center w-full">
  <p className="text-black">Already have an account?</p>

  <Link
    to="/login"
    className="text-blue-600 hover:underline font-medium"
  >
    Login
  </Link>
</div>
              

            

                {/* <button
                    type="button"
                    onClick={handleGoogleSignin}
                    className="w-full border border-gray-400 py-3 mt-3 rounded-md hover:bg-gray-100 transition"
                >
                    Continue with Google
                </button> */}

            </div>
        </div>
    );
};

export default Register;