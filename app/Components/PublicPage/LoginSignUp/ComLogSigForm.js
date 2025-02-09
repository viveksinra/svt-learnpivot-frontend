"use client";

import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import Link from "next/link";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import ForgetPassword from "./ForgetPassword";

function ComLogSigForm({ isRedirectToDashboard }) {
  // Use localStorage to persist the form state
  // const [isLogin, setIsLogin] = useState(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedState = localStorage.getItem('mockTestFormState');
  //     return savedState ? JSON.parse(savedState).isLogin : true;
  //   }
  //   return true;
  // });
  const [isLogin, setIsLogin] = useState(true);

  const [isForget, setIsForget] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('mockTestFormState');
      return savedState ? JSON.parse(savedState).isForget : false;
    }
    return false;
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockTestFormState', JSON.stringify({
        isLogin,
        isForget
      }));
    }
  }, [isLogin, isForget]);

  // Clear localStorage on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockTestFormState');
      }
    };
  }, []);

  const handleToggleLogin = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsLogin(!isLogin);
  };

  const handleToggleForget = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsForget(!isForget);
  };

  return (
    <div style={{marginTop:"20px", justifyContent:"center"}}>
      <Typography 
        align="center" 
        color="primary" 
        gutterBottom 
        variant="h6" 
      >
        {isLogin ? "Login" : "Sign Up"}
      </Typography>
      <Grid container justifyContent="center" sx={{ marginBottom: 2 }}>
        <Typography color="textPrimary" variant="subtitle1" sx={{ marginRight: 2 }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
        </Typography>
        <Link href="#" onClick={handleToggleLogin} passHref>
          <Typography color="secondary" variant="subtitle1" component="a">
            {isLogin ? "Register" : "Login"}
          </Typography>
        </Link>
      </Grid>
      {isLogin ? (
        <>
          {isForget ? 
            <ForgetPassword setIsForget={setIsForget} /> : 
            <LoginForm isRedirectToDashboard={isRedirectToDashboard} />
          }
          <Grid container justifyContent="right" sx={{ marginBottom: 2 }}>
            <Link 
              style={{marginRight:"10px"}} 
              href="#" 
              onClick={handleToggleForget} 
              passHref
            >
              <Typography color="secondary" variant="subtitle1" component="a">
                {isForget ? "Back to Login" : "Forgot Password?"}
              </Typography>
            </Link>
          </Grid>
        </>
      ) : (
        <SignUpForm isRedirectToDashboard={isRedirectToDashboard} setIsLogin={setIsLogin} />
      )}
    </div>
  );
}

export default ComLogSigForm;