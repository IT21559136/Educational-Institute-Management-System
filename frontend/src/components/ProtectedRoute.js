import React, { useEffect , useState} from 'react';
import { getUserInfo } from '../apicalls/users';
import { message } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice.js';

export default function ProtectedRoute({children}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [load,setLoader] = useState(true);
 
  const getUserData = async() =>{
    try {
      const response = await getUserInfo()
     
      if(response.success){
        message.success(response.message)
        console.log(response);
        dispatch(SetUser(response.data))
        
      
      }else{
        message.error(response.message)
      }
    } catch (error) {
      message.error(error.message)
    }
  }
  const fetchUser = () => {
    return async dispatch => {
      const response = await getUserInfo();
      console.log(response);
      setLoader(false)
      const user = response.data
      user.password = null
      localStorage.setItem("user" , JSON.stringify(user))
      dispatch(SetUser(response.data))

      
    };
  };
  

  useEffect(()=>{
    if (localStorage.getItem("token")) {
      dispatch(fetchUser());
    } else {
      navigate("/login");
    }
  }, [dispatch])

  const {user}  = useSelector((state) =>  {console.log(state.users)
    return state.users
  });
  

  return (
    
    <div>
      
      {user?.name} 
     {children}
    </div>
  )
}

