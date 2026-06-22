import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInAnonymously } from "firebase/auth";
import FinPro from '../../assets/FinPro (3).png';

const LoginStart = () => {
    const navigate = useNavigate();

    const handleGuest = async () => {
        try {
            await signInAnonymously(auth);
            navigate('/home');
        } catch (error) {
            console.error("Guest login failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                <div className="mb-8">
                    <h1 className="flex justify-center items-center">
                        <img
                            src={FinPro}
                            alt="FinPro"
                            className="h-70 w-70 object-cover"
                        />
                    </h1>
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#001580] text-white
                    font-medium rounded-md hover:bg-black transition 
                    mb-3 py-3 "
                >
                    Log in
                </button>

                <button
                    onClick={() => navigate('/register')}
                    className="w-full bg-[#001580] text-white 
                    font-medium rounded-md hover:bg-black transition
                     mb-3 py-3 "
                >
                    Register
                </button>

                <button
                    onClick={handleGuest}
                    className="w-full border border-gray-400 py-3 rounded-md hover:bg-gray-100 transition"
                >
                    Continue as guest
                </button>

            </div>
        </div>
    );
};

export default LoginStart;