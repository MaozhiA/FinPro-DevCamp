import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from "react-router-dom";

import { analytics } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { auth } from '../../firebase';
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import FinPro from '../../assets/INS.png';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const[confirmEmail, setConfirmEmail] = useState('');
    const[emailValid, setEmailValid]= useState(null); 
    const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
});


const checkPassword = (value) => {
    setPasswordRules({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    });
};
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

        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
        if(!emailRegex.test(email)){
            toast.error('Please enter a valid address.');
            return; 
        }

        if(email !== confirmEmail ){
        toast.error('email addresses do not match.');
        return;
    }
        const allRulesMet = Object.values(passwordRules).every(Boolean);
        if(!allRulesMet) {
            toast.error('Please meet all password requirements.');
            return; 
        }


        try {
            
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredentials.user);

            
            await registerWithBackend(email, password);
            logEvent(analytics, 'sign_up', { method: 'email' });
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

    
        await registerWithBackend(user.email, user.uid);
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
                     <div className="mb-8 flex justify-center">
                          <img src={FinPro} alt="FinPro" className="h-64 w-64 object-cover" />
                        </div>

                <h2 className="text-black text-2xl mb-4">Register</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-sm">
                        <label className="flex mb-1">Email:</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="enter your email"
                            onChange={(e) => {
                            setEmail(e.target.value);
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            setEmailValid(emailRegex.test(e.target.value));
                            }}
                            

                            className="w-full border-b border-gray-400 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
                        />
                        {emailValid === false && (
                         <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                      )}
                         {emailValid === true && (
                      <p className="text-xs text-green-600 mt-1"> Valid email</p>
                )}
                    </div>

                    <div className="mb-4 text-sm">
                        <label className="flex mb-1"> Confirm Email:</label>
                        <input 
                        type="email"
                        value={confirmEmail}
                        placeholder='confirm email'
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="w-full border-b border-gray-400 py-3
                         text-black placeholder:text-gray-400 
                         focus:border-black focus:outline-none transition"
    />

                    {confirmEmail && (
    <p className={`text-xs mt-1 ${email === confirmEmail ? 'text-green-600' : 'text-red-500'}`}>
        {email === confirmEmail ? '✓ Emails match' : '✗ Emails do not match'}
    </p>
)}
                    </div>

                    <div className="mb-4 text-sm">
                        <label className="flex mb-1">Password:</label>
                        <input
    type="password"
    value={password}
    placeholder="enter your password"
    onChange={(e) => {
        setPassword(e.target.value);
        checkPassword(e.target.value);
    }}
    className="w-full border-b border-gray-400 py-3 text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition"
/>
<div className="mt-2 space-y-1">
    {[
        { key: 'length', label: 'At least 8 characters' },
        { key: 'uppercase', label: 'At least one uppercase letter' },
        { key: 'lowercase', label: 'At least one lowercase letter' },
        { key: 'special', label: 'At least one special character' },
    ].map(({ key, label }) => (
        <p key={key} className={`text-xs flex items-center gap-1 ${passwordRules[key] ? 'text-green-600' : 'text-slate-400'}`}>
            {passwordRules[key] ? '✓' : '○'} {label}
        </p>
    ))}
</div>
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
    className="text-blue-600
     hover:underline
     font-medium"
  >
    Login
  </Link>
</div>           
{/* 
                <button
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