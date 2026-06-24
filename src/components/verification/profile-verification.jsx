import { Navigate, useNavigate } from "react-router-dom"
import {useEffect, useState} from 'react'
import FileDialogue from "../filepicker/file-dialogue.jsx";
import FilePicker from "../filepicker/dialogue.jsx";


const ProfileVerification = () => 
{
     const navigate = useNavigate(); 
     const [dialogType, setDialogType]= useState(null);
    

     const openDialog = (type) => setDialogType(type);
     const closeDialog= () => setDialogType(null); 

     const handlePick= (type) =>{
        console.log("User selected",type);
        openFilePicker();
     }

     const handleUplaodSuccess = (type => {
        setVerified(pre => ({ ...PreviousMap_, [type]: true}));
     });

     
    // const[clientDocuments, setClientDocuments]= useState([]); //implementing  once I can fetch documents  
    
    const[clientKYC,setClientKYC]= useState(null); // basically eligibilitty status 
    const[customerProfile, setCustomerProfile]= useState(null); 
    const[userId, setUserId] = useState(null); 
    
    useEffect(()=> {

        const fetchClientData = async() => {

        const user = auth.currentUser; 
        setUserId= user.uid;
        
       
        const profileResponse = await  axios.get(`/client/v1/profile`);

        const eligibilityResponse = await axios.get(`/client/v1/kyc/${userId}`); 

        setCustomerProfile(profileResponse.data);

        setClientKYC(eligibilityResponse.data); 

       
       
    }
     fetchClientData(); 

     },[]);

        const submitKYC = async () => {
        const payload = {
        primaryIndicator: verified.document,
        secondaryIndicator: verified.selfie,
        taxCompliance: "green"
    }

    const kycResponse = await axios.post(`/client/v1/product/eligibility`, payload)
    const kycResponses = await axios.post(`/client/v1/kyc/${userId}`, payload)
    // not sure where /home (navigaating)
}


    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md mb-3">
        <h2 className="flex text-2xl font-bold mb-6">Identity Verification</h2>

        <p className="flex">We are committed to providing a safe secure shopping experience,
          therefore your account must be verified by completing a KYC verification.
        </p>

    
        <div
          className="w-full max-w-xs rounded-lg 
          border border-slate-200 bg-white 
          shadow-lg mb-3 cursor-pointer"
          onClick={() => openDialog("document")} 
        >
          <div className="h-max w-full rounded px-6 py-4">
            <h3 className="font-bold">Proof of Residence</h3>
            <p>Upload a utility bill or bank statement</p>
          </div>
        </div>

        <div
          className="w-full max-w-xs rounded-lg 
          border border-slate-200 bg-white shadow-lg 
          mb-3 cursor-pointer"
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
          onUploadSuccess={handleUplaodSuccess}
        />
      )}
    </div>
  );
};

export default ProfileVerification;