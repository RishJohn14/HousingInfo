import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import Header from "../../components/Header/Header";
import auth from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

function LoginPage() {
    const googleProvider = new GoogleAuthProvider();
    const [user, loading] = useAuthState(auth);

    async function googleLogin() {
        try {
            const login = await signInWithPopup(auth, googleProvider);
        } catch (err) { console.log(err); }
    }

    async function googleLogout() {
        try {
            const logout = await signOut(auth, googleProvider);
        } catch(err) { console.log(err); }
    }

    return (
    <div>
        <Header />
        {!user && <div>
        <Button variant="contained" endIcon={<GoogleIcon />} onClick={googleLogin}>
            Login with Google
        </Button>
        <Button variant="contained" endIcon={<GoogleIcon />} onClick={googleLogin}>
            Login with Microsoft
        </Button>
        <Button variant="contained" endIcon={<GoogleIcon />} onClick={googleLogin}>
            Login with Google
        </Button>
        </div>}
        { user && 
        <div>
        <p>{user.displayName}</p>
        <Button variant="contained" onClick={googleLogout}>Log out</Button>
        </div>}
    </div>
    );
}

export default LoginPage;
