import React, { createContext, useEffect, useState } from 'react'
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { getRoomCheckUserId } from '../Services/RoomChatService';
import { getUserDetail } from '../Services/UserService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();
function AuthLoginProvider({ children }) {

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [isLoading, setIsLoading] = useState(false);
  const [isOutlet, setIsOutlet] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (userId) {
      getRoomCheckUserId((res) => {
        if (res.data) {
          navigate(`/chat-room/${res.data._id}`)
        }
      }, userId);
    } else {
      navigate('/')
    }

    if (userId && role == null) {
      getUserDetail((res) => {
        console.log(res);
        if (res.statusCode === 200) {
          setRole(res.data.role);
        }
      }, userId, '');
    }

    return () => {

    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [])
  
  return (
    <AuthContext.Provider value={{ setIsLoading, isOutlet, setIsOutlet, setRole, role }}>
      {isLoading ? <div className="loading">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div> : children}
    </AuthContext.Provider>
  )
}

export default AuthLoginProvider;