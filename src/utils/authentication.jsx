import axios from 'axios';

const ValidateToken= async () => {
    const loginAccessKey = localStorage.getItem('loginAccessKey');

    if (!loginAccessKey) return false;
    try {
        const response = await axios.post('/v1/token/validate',{}
            ,{
                headers:{
                    Authorization: `Bearer ${loginAccessKey}`,
                }, 
               
            }
        );
         return response.data === true  || response.data.valid === true;
    }
                catch(error){
                    console.error("Token validation failed:", error);
                    return false;
                
            }
        
    }


export default ValidateToken;
    