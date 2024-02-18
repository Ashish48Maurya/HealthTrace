import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useAuth } from '../store/auth'
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const { address, connectWallet,state,setIsloggedIn,setUser } = useAuth();
  const { contract } = state;
    useEffect(() => {
        connectWallet();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const result = await contract.login(pass);
          if (result) {
            const isUser = await contract.users(address);
            alert("Login Successful");
            setIsloggedIn(true);
            console.log(isUser)
            const user = isUser[3];
            if(user == 1){
                setUser("manu");
                navigate('/manufacturer');
            }
            else if(user==4){
                navigate('/user');
            }
            else if(user==2){
                setUser("dist");
                navigate('/dProducts');
            }
            else{
                setUser("retail");
                navigate('/rProducts');
            }
          } else {
            alert("Login Failed: Incorrect password or Adderss");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred during login. Please try again.");
        }
      };
      

    const [pass,setPass] = useState('');
    return (
        <>
            <Navbar />
            <div class="container ">

            <div class="form-body">
        <form id="registerForm" onSubmit={handleSubmit}>
            <div class="form-group">
                <label for="address">Address:</label>
                <input type="text" id="address" name="address" required value={address}/>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"  value={pass}
                onChange={(e) => setPass(e.target.value)} required/>
            </div>
            <div class="form-group">
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
            </div >
        <style>{`


.container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 400px;
}

.form-header {
    background-color: #4CAF50;
    color: #fff;
    padding: 20px;
    text-align: center;
}

.form-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 5px;
}

button {
    background-color: #0d6efd;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
`}</style>
        </>
    )
}
