import { Navigate, useNavigate } from "react-router-dom"
import {useEffect, useState, useRef} from 'react'
import FileDialogue from "../filepicker/file-dialogue.jsx";
import FilePicker from "../filepicker/dialogue.jsx";
import {auth} from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const ProfileVerification = () => 
{
    const navigate = useNavigate(); 


    const [dialogType, setDialogType] = useState(null);
    const [clientKYC, setClientKYC] = useState(null);
    const [customerProfile, setCustomerProfile] = useState(null); 
    const [userId, setUserId] = useState(null); 
    const [verified, setVerified] = useState({
        document: false, 
        selfie: false
    });

    // 2. useRef declarations
    const customerProfileRef = useRef(null);

    // 3. fetchClientData
const fetchClientData = async (userId) => {
    const token = localStorage.getItem('loginAccessKey');
    if (!token) { navigate('/login'); return; }

  
    try {
        const profileResponse = await axios.get(`/client/v1/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setCustomerProfile(profileResponse.data);
        customerProfileRef.current = profileResponse.data;
        console.log('Profile stored in ref:', customerProfileRef.current);
    } catch (error) {
        console.error('Profile fetch error:', error);
    }


    try {
        const eligibilityResponse = await axios.get(`/v1/kyc/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setClientKYC(eligibilityResponse.data);
    } catch (error) {
        if (error.response?.status === 404) {
            setClientKYC(null); 
        } else {
            console.error('KYC fetch error:', error);
        }
    }
}

    // 4. submitKYC
    const submitKYC = async () => {
        const profile = customerProfileRef.current;
        if (!profile) {
            console.error('No customer profile loaded');
            return;
        }

        const token = localStorage.getItem('loginAccessKey'); 

        const eligibilityPayload = {
            customerId: profile.id,
            productIds: [1, 3]
        };

        const eligibilityResponse = await axios.post(`/v1/product/eligibility`, eligibilityPayload, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setClientKYC(eligibilityResponse.data);

        const KYCpayload = {
            primaryIndicator: verified.document,
            secondaryIndicator: verified.selfie,
            taxCompliance: "green"
        };
        console.log('userId at submitKYC:', userId);
        console.log('KYCpayload:', KYCpayload);

        const kycResponse = await axios.post(`/v1/kyc/${userId}`, KYCpayload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (kycResponse.status === 204) {
            navigate('/home');
        }
    }

    // 5. handleUploadSuccess
    const handleUploadSuccess = (type) => {
        setVerified(prev => {
            const updatedVerified = { ...prev, [type]: true };

            if (updatedVerified.document && updatedVerified.selfie) {
                submitKYC(); 
            }
            return updatedVerified;
        });
    };

    // 6. openDialog / closeDialog
    const openDialog = (type) => setDialogType(type);
    const closeDialog = () => setDialogType(null); 

    // 7. useEffect
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid); 
                fetchClientData(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    // 8. return JSX
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="w-full max-w-md mb-3">
                <h2 className="flex text-2xl font-bold mb-6">Identity Verification</h2>

                <p className="flex">We are committed to providing a safe secure shopping experience,
                    therefore your account must be verified by completing a KYC verification.
                </p>

                <div
                    className={`w-full max-w-xs rounded-lg 
                    border border-slate-200 
                    shadow-lg mb-3 cursor-pointer
                    ${verified.document ? "bg-green-500" : "bg-white"}`}
                    onClick={() => openDialog("document")} 
                >
                    <div className="h-max w-full rounded px-6 py-4">
                        <h3 className="font-bold">Proof of Residence</h3>
                        <p>Upload a utility bill or bank statement</p>
                    </div>
                </div>

                <div
                    className={`w-full max-w-xs rounded-lg 
                    border border-slate-200 shadow-lg 
                    mb-3 cursor-pointer
                    ${verified.selfie ? "bg-green-500" : "bg-white"}`}
                    onClick={() => openDialog("selfie")}  
                >
                    <div className="h-max w-full rounded px-6 py-4">
                        <h3 className="font-bold">Selfie Upload</h3>
                        <p>Take a photo or upload a selfie</p>
                    </div>
                </div>
            </div>

            {dialogType && (
                <FileDialogue
                    type={dialogType}   
                    onClose={closeDialog}
                    onUploadSuccess={handleUploadSuccess}
                />
            )}
        </div>
    );
};

export default ProfileVerification;