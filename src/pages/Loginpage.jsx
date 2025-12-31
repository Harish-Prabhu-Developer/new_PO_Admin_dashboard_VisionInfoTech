// src/pages/LoginPage.jsx
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { fetchPOHeaders } from '../redux/Slice/PO/poHeaderSlice';
import useUser from '../hooks/useUser'; // Import the custom hook
import toast from 'react-hot-toast';

const Loginpage = () => {
const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState("Select");
    const navigate = useNavigate();
    const dispatch =useDispatch();
    const { setUser } = useUser(); // Use the hook
    
      const { headers, status, error } = useSelector(
        (state) => state.poHeader
      );
    
      useEffect(() => {
        dispatch(fetchPOHeaders({ page: 1, limit: 20 }));
      }, [dispatch]);
    
    const handleSelect = async(User) => {
        setSelected(User.po_ref_no);
        
        // Use custom hook to set user
        setUser(User.po_ref_no);
        
        navigate('/dashboard');
        toast.success(`Logged in as ${User.po_ref_no}`);
        setIsOpen(false);
    };
    
    return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="rounded-xl border border-gray-200 bg-card-background py-8 px-6 max-w-md w-full shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
    
        <h3 className="mb-6 text-center text-xl font-bold text-gray-800">Quick Login</h3>
    
        {/* <form>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Email or Patient ID</label>
            <input 
              type="text" 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white" 
              required 
              placeholder="Enter your email or patient ID" 
            />
          </div>
    
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white" 
              required 
              placeholder="Enter your password" 
            />
          </div>
    
          <button 
            type="submit" 
            className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
    
          <div className="mt-4 text-center">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition"
            >
              Forgot Password?
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form> */}
        {/* Now Select User to Navigate Dashboard */}
        {/* Dropdown select to navigate */}
         <div className="flex flex-col w-44 text-sm relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
                <span>{selected}</span>
                <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul className="w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                    {headers.map((userId) => (
                        <li key={userId} className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer" onClick={() => handleSelect(userId)} >
                            {userId.po_ref_no}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    </div>
  )
}

export default Loginpage