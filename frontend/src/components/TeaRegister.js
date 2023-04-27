import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../images/profile.png';
import styles from '../stylesheets/Username.module.css'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import {registerValdation } from '../validations/validate';
import convertToBase64 from '../validations/convert';
import { registerTeacher } from '../apicalls/helper';
import { tregisterUser } from '../apicalls/teachers'
import { registerUser } from '../apicalls/users'
import { message } from 'antd';


export default function TeaRegister() {

  const navigate = useNavigate();

    const [file , setFile] = useState()
      
    const formik = useFormik({
        initialValues : {
           email : '',
           username: '',
           password: '',
           grade: ''
        },
        validate:registerValdation,                 //validate the input text box and return value
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit : async values =>{                 //validate only after submitting button
            values = await Object.assign(values , {profile : file || ''})
           let registerPromise = registerTeacher(values)
           const response = await tregisterUser(values)
            toast.promise(registerPromise,{
              loading: 'Creating...',
              success: <b>Register Successfully...!</b>,
              error: <b>Could not Register</b>
            })

            registerPromise.then(function(){navigate('/pteacherLogin')});
        }            
    })

  //cretae file upload handler
  const onUpload = async e =>{
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }
  const onFinish = async(values) =>{
    try {
        //dispatch(ShowLoading()); //showing loader
        const response = await tregisterUser(values)
        //dispatch(HideLoading()); //hide loader
        if(response.success){
            message.success(response.message);
        }else{
            message.error(response.message);
        }
    } catch (error) {
        //dispatch(HideLoading()); //hide loader
        message.error(error.message);
    }
   }  

  return (
   <div className={styles.body}>      
    <div className="container mx-auto">
      

            <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen' >
        <div className={styles.glass} style={{height: "85%"}}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'> Thilina Registration</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Welcome to Thilina Educational Institute
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit} onFinish={onFinish} >
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
              <img src={file ||avatar} className={styles.profile_img} alt='avatar'></img>
              </label>

              <input onChange={onUpload} type='file' id='profile' name='profile'></input>
          
            </div>
            <div className="textbox flex flex-col items-center gap-6">
            <input {...formik.getFieldProps('email')} className={styles.textbox} type="email" placeholder='Email*' id='email'/>
            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' id='name'/>
            <input {...formik.getFieldProps('password')} className={styles.textbox} type="password" placeholder='Password*' id='password'/>
            {/* <input {...formik.getFieldProps('grade')} className={styles.textbox} type="text" placeholder='Grade'/>  */}
              
              <button className={styles.btn} type='submit'>Register</button>
            </div>
            <div className="text-center py-2 px-3.5">
              <span className='text-gray-500'>Already Register? <Link className='text-red-500' to='/plogin'>Login now</Link></span>
            </div>
          </form>
        </div>

      </div>
    </div>
    </div>
  )
}