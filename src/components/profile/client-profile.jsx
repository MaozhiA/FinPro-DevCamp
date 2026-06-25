import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const getStoredToken = () => {
  return (
    localStorage.getItem('firebaseToken') ||
    localStorage.getItem('loginAccessKey') ||
    null
  );
};

const normalizeToken = (token) => {
  if (!token) return null;
  return token.startsWith('Bearer ') ? token.slice(7) : token;
};

const buildAuthHeaders = (token) => {
  const rawToken = normalizeToken(token);
  if (!rawToken) return {};

  return {
    Authorization: `Bearer ${rawToken}`,

  };
};

const ClientProfile = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [customerTypes, setCustomerTypes] = useState([]);
  const [customerTypeId, setCustomerTypeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const[clientDocuments, setClientDocuments]= useState([]); 
  const [customerProfile, setCustomerProfile] = useState(null);

  const validateId = (id) => {
    const idRegex = /^\d{13}$/;
    return idRegex.test(id);
  };

  const getAuthToken = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        return await currentUser.getIdToken(true);
      } catch (error) {
        console.warn('Failed to refresh Firebase token:', error);
      }
    }

    return getStoredToken();
  };
  useEffect(() => {
  const loadData = async () => {
    setLoadingTypes(true);
    try {
      const token = localStorage.getItem('loginAccessKey');

      if (!token) {
        navigate('/login');
        return;
      }
     const [typesResponse, profileResponse, clientResponse] = await Promise.all([
        axios.get('/client/v1/types', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/client/v1/profile', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/client/v1/profile/documents', {
          headers: {Authorization: `  Bearer ${token}`}
        }).catch(() => null), 
      ]);
      setCustomerTypes(typesResponse.data.customerTypes || []);
      setClientDocuments(clientResponse?.data?.clientDocuments || []); 
      if (profileResponse?.data) {
        const p = profileResponse.data;
        setFirstName(p.firstName || '');
        setLastName(p.lastName || '');
        setIdNumber(p.idNumber || '');
        setCustomerTypeId(p.customerType?.id || '');
        setCustomerProfile(profileResponse.data); 
      }

    } catch (error) {
      console.error('Failed to load data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Unable to load profile.');
      }
    } finally {
      setLoadingTypes(false);
    }
  };

  loadData();
}, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateId(idNumber)) {
    toast.error('Invalid ID number. Must be 13 digits.');
    return;
  }

  if (!customerTypeId) {
    toast.error('Please choose a customer type.');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('loginAccessKey');
    const user = auth.currentUser;

    if (!token || !user) {
      toast.error('Authentication expired. Please log in again.');
      navigate('/login');
      return;
    }

    const payload = {
      email: user.email,
      firstName,
      lastName,
      idNumber,
      customerTypeId,
    };

 const method = customerProfile ? "patch" : "post"; 

  const patchClientResponse = await axios[method](`/client/v1/profile`, payload , {
    headers: {Authorization:  `Bearer ${token}`}, 
  });

  setCustomerProfile(patchClientResponse.data); 

    console.log('Profile created:', patchClientResponse.data);
    toast.success('Profile completed successfully!');
    navigate('/profile-verification');

  } catch (error) {
    console.error('Profile error:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    } else {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    }
  } finally {
    setLoading(false);
  }

 

};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-b border-gray-400 py-3 mb-4 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-b border-gray-400 py-3 mb-4 focus:outline-none"
          />

          <input
            type="text"
            placeholder="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full border-b border-gray-400 py-3 mb-4 focus:outline-none"
          />

          {loadingTypes ? (
            <p className="text-gray-500 mb-4">Loading customer types...</p>
          ) : (
            <>
              <select
                value={customerTypeId}
                onChange={(e) => setCustomerTypeId(Number(e.target.value))}
                className="w-full border-b border-gray-400 py-3 mb-4"
              >
                <option value="">Select customer type</option>
                {customerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              {customerTypes.length === 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  No customer types available right now.
                </p>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#001580] text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
           {loading ? 'Saving...' : customerProfile ? 'Update Profile' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfile;
