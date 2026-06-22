import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Home from './home.jsx';
import ClientHome from './client-home.jsx';

const OriginalHome = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setStatus('guest');
            } else if (currentUser.isAnonymous) {
                setStatus('guest');
            } else {
                setStatus('user');
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
      
            {/* <div className="fixed top-4 right-4 z-50">
                {status === 'guest' ? (
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                        Guest User
                    </span>
                ) : (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-300">
                        {user?.displayName || user?.email || 'User'}
                    </span>
                )}
            </div> */}

           
            {user && !user.isAnonymous ? (
                <ClientHome user={user} />
            ) : (
                <Home />
            )}
        </>
    );
};

export default OriginalHome;