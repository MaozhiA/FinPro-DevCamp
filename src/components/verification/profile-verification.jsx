import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import FileDialogue from "../filepicker/file-dialogue.jsx";
import FilePicker from "../filepicker/dialogue.jsx";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";

const ProfileVerification = () => {
  const navigate = useNavigate();

  const [dialogType, setDialogType] = useState(null);
  const [clientKYC, setClientKYC] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [verified, setVerified] = useState({
    document: false,
    selfie: false,
  });
  const customerProfileRef = useRef(null);

  const [documentProfile, setDocumentProfile] = useState([]);
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [accountTypes, seAccountTypes] = useState([]);
  const [completeSetup, setCompleteSetup] = useState(false);
  const fetchClientData = async (userId) => {
    const token = localStorage.getItem("loginAccessKey");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const profileResponse = await axios.get(`/client/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomerProfile(profileResponse.data);
      customerProfileRef.current = profileResponse.data;
      console.log("Profile stored in ref:", customerProfileRef.current);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }

    try {
      const eligibilityResponse = await axios.get(`/v1/kyc/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientKYC(eligibilityResponse.data);
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        setClientKYC(null);
      } else {
        console.error("KYC fetch error:", error);
      }
    }

    try {
      const fetchDcoumentResponse = await axios.get(
        `/client/v1/profile/documents`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setDocumentProfile(fetchDcoumentResponse.data);
      const docs = fetchDcoumentResponse.data;
      setVerified({
        document: localStorage.getItem("uploaded_document") === "true",
        selfie: localStorage.getItem("uploaded_selfie") === "true",
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setDocumentProfile([]);
      } else {
        console.error("Error in fetching Client document", error);
      }
    }
  };

  const submitKYC = async () => {
    console.log("submitKYC called");
    const profile = customerProfileRef.current;
    if (!profile) {
      console.error("No customer profile loaded");
      return;
    }

    const token = localStorage.getItem("loginAccessKey");

    const eligibilityPayload = {
      customerId: profile.id,
      productIds: [1, 3], // remember to link to actual product.id
    };

    const eligibilityResponse = await axios.post(
      `/v1/product/eligibility`,
      eligibilityPayload,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setClientKYC(eligibilityResponse.data);

    const KYCpayload = {
      primaryIndicator: verified.document,
      secondaryIndicator: verified.selfie,
      taxCompliance: "green", // this has to change
    };
    console.log("userId at submitKYC:", userId);
    console.log("KYCpayload:", KYCpayload);

    const kycResponse = await axios.post(`/v1/kyc/${userId}`, KYCpayload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // await axios.post(`/client//profile/accounts/{accountTypeId}`, {
    //accountTypeId: determinedType}) , then navigate home something like this
    console.log("kycResponse status:", kycResponse.status);
    if (kycResponse.status === 204) {
      logEvent(analytics, "kyc_completed", { userId: userId });
      //   navigate("/home"); // the set-complete choice thingie page
      setCompleteSetup(true);
    }
  };

  const handleUploadSuccess = (type) => {
    setVerified((prev) => {
      const updatedVerified = { ...prev, [type]: true };

      if (updatedVerified.document && updatedVerified.selfie) {
        submitKYC();
      }
      return updatedVerified;
    });
  };

  const openDialog = (type) => setDialogType(type);
  const closeDialog = () => setDialogType(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchClientData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Identity Verification
          </h2>
          <p className="text-slate-500 text-sm">
            We are committed to providing a safe and secure experience. Please
            complete the steps below to verify your account.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div
            className={`h-1.5 flex-1 rounded-full ${verified.document ? "bg-green-500" : "bg-slate-200"}`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full ${verified.selfie ? "bg-green-500" : "bg-slate-200"}`}
          />
        </div>

        <div className="space-y-4">
          <div
            onClick={() => openDialog("document")}
            className={`w-full rounded-xl border-2 p-6 cursor-pointer transition
                        ${
                          verified.document
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Proof of Residence
                </h3>
                <p className="text-sm text-slate-500">
                  Upload a utility bill or bank statement
                </p>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${verified.document ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                {verified.document ? "✓" : "1"}
              </div>
            </div>
          </div>

          <div
            onClick={() => openDialog("selfie")}
            className={`w-full rounded-xl border-2 p-6 cursor-pointer transition
                        ${
                          verified.selfie
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Selfie Upload
                </h3>
                <p className="text-sm text-slate-500">
                  Take a photo or upload a selfie
                </p>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${verified.selfie ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                {verified.selfie ? "✓" : "2"}
              </div>
            </div>
          </div>
        </div>
        {verified.document && verified.selfie && (
          <button
            onClick={submitKYC}
            className="w-full mt-6 bg-[#001580] text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            Continue
          </button>
        )}
      </div>

      {dialogType && (
        <FileDialogue
          type={dialogType}
          onClose={closeDialog}
          onUploadSuccess={handleUploadSuccess}
          customerId={customerProfileRef.current?.id}
        />
      )}

      {completeSetup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              You are verified
            </h3>
            <p className="text-sm text-slate-500 mb-6">Whooptiiyy</p>
            <button className="" onClick={() => navigate("/customer-accounts")}>
              {" "}
              Set up account
            </button>
            <button onClick={() => navigate("/home")}>Do it later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileVerification;
