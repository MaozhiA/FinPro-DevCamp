import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

const Register =( ) => {
    const [username, setUsername] = useState('') ;
    const[password, setPassword] = useState('');



    const handleSubmit = (h) => {
        h.preventDefault(); 
        
        const payLoad = {
            username: username,
            password: password
           
    }
        axios.post('/v1/user', payLoad)
        .then((response) => {
            console.log("Register successful:", response.data);
            alert("Register successful!");
        })
        .catch((error) => {
            console.error("Register failed:", error); 
        });
    }; 

    return (

        <div> 
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
       
    )
}
export default Register;