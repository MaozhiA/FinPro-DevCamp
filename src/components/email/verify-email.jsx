import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            navigate('/register');
            return;
        }

        const interval = setInterval(async () => {
            await user.reload();

            if (user.emailVerified) {
                clearInterval(interval);
                navigate('/client-profile'); 
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleResend = async () => {
        const user = auth.currentUser;

        if (user) {
            try {
                await sendEmailVerification(user);
                toast.success("Verification email resent! Check your inbox.");
            } catch (error) {
                toast.error("Failed to resend verification email.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <div className="max-w-md w-full text-center">

                <h1 className="text-2xl font-bold mb-4">
                    Verify Your Email
                </h1>

                <p className="mb-6 text-gray-600">
                    Check your inbox. We sent a verification link to:
                </p>

                <p className="font-medium mb-6">
                    {auth.currentUser?.email}
                </p>

                <p className="text-sm text-gray-500">
                    Waiting for verification...
                </p>

                <button
                    onClick={handleResend}
                    className="mt-4 w-full border border-gray-400 py-3 rounded-md hover:bg-gray-100 transition"
                >
                    Resend Email
                </button>

            </div>
        </div>
    );
};

export default VerifyEmail;