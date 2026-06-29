import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom"
import {useEffect, useState, useRef} from 'react'
import {auth} from '../../firebase';

const CustomerAcounts = (account) => {

    const[customerAccounts,setCustomerAccounts]=useState([]);
    const[accountTypes, setAccountTypes]=useState([]); 
    const[selectedAccounts, setSelectedAccounts]= useState([]); 

    useEffect(()=> {
        
        const fetchAccounts = async()=> {

            const token = localStorage.getItem('loginAccessKey');

            // would this be fpr populating like a form to select the account type or soemthing 
    try{
        const accountTypeResponse = await axios.get(`/client/v1/types`, {
            headers: {Authorization: `Bearer ${token}`},
        }); 
        setAccountTypes(accountTypeResponse.data.accountTypes || []);
    }  catch(error) {
        if(error.reponse?.status === 401 || error.response?.status === 500 ) {
           setAccountTypes(null);
        }else {
            console.error("Error fetching accounts:", error);
        }
    } 
// then what would this one be used for 
     try{
        const accountResponse = await axios.get(`/client/v1/profile/accounts`, {
            headers: {Authorization: `Bearer ${token}`},
        }); 
        setCustomerAccounts(accountResponse.data);

    }  catch(error) {
        if(error.response?.status === 401 || error.response?.status === 500 ) {
            setCustomerAccounts(null);
        }else {
            console.error("Error fetching accounts:", error);
        }
    } 
    
}      
        fetchAccounts(); 

    },[]);
     const addAccount = async (accountTypeId) => {
        await axios.put(`/client/v1/profile/accounts/${accountTypeId}`, 
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
    const toggleAccount = (accountTypeId) => {
    setSelectedAccounts(prev => {
        if(prev.includes(accountTypeId)) {
            return prev.filter(id => id !== accountTypeId);
        } else {
            return [...prev, accountTypeId];
        }
    });
};
    const handleSubmit = async() => {
        
       const token = localStorage.getItem('loginAccessKey');
        const navigate =useNavigate();
        await Promise.all(selectedAccounts.map(accountTypeId => 
            axios.put(`/client/v1/profile/accounts/${accountTypeId}`, 
                {}, 

           {
            headers : {
                Authorization: `Bearer ${token}`}
            })
        )); 
        
                navigate('/home');
            
        };
    

    
    return (
        <div className="min-h-screen bg-white px-6 py-12 "> 
        <div className="max-w-6xl mx-auto px-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-2"> Set up your Account </h2>
            </div>
            <div className=" grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
               {accountTypes.map((account) => (
    <div                                 
        key={account.id}
        onClick={() => toggleAccount(account.id)}
        className={`w-full rounded-xl border-2 p-6 cursor-pointer transition
            ${selectedAccounts.includes(account.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
    >                                   
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-900">{account.name}</p>
                <p className="text-xs text-slate-500 mt-1">{account.description}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${selectedAccounts.includes(account.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                {selectedAccounts.includes(account.id) ? '✓' : '+'}
            </div>
        </div>
       
    </div>   
    
    
))}
      </div>  
       <div>
            <button 
            onClick={handleSubmit}
            >
                Create Account
            </button>
             </div>
        </div>  
          </div>  
    )
}; 
export default CustomerAcounts; 
