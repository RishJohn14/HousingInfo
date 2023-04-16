import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import Header from "../../components/Header/Header";
import auth from "../../firebase";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from 'react-bootstrap/Button';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FcGoogle } from 'react-icons/fc';
import { AiFillFacebook } from 'react-icons/ai';

/**
 * Login Page for REvaluate+
 * @returns Login Page for REvaluate+
 */
function LoginPage() {
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    const [user, loading] = useAuthState(auth);

    //function that performs google SSO login using google identity provider
    function googleLogin() {
        signInWithPopup(auth, googleProvider)
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
    }

    //function that performs facebook SSO login using facebook identity provider
    function facebookLogin() {
        signInWithPopup(auth, facebookProvider)
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
    }

    //on load, if there is already a signed in user, redirect to revaluate+ page
    useEffect(() => {
        console.log(user);
        if (user) {
            navigate('/revaluate+');
        }
    }, [user]);

    return (
    {user} ?
    <div className="loginPage">
        <Header id="loginHeader" />
        {!user && <div className="loginCard">
        <Grid container>
            <Grid item xs={5} className="loginLeft">
                <p className="loginPartitionTitle">Sign In</p>
                <p className="loginPartitionSubtitle">
                    Account creation can be a pain, we know. Here at REvaluate+, we provide a fuss-free login with any of these trusted identity providers!
                </p>
                <div className="ssoButtonDiv">
                <Button className="ssoButton" onClick={googleLogin}>
                    <FcGoogle size={27} style={{marginRight: 15}} />Login with Google
                </Button>
                </div>
                <div className="ssoButtonDiv">
                <Button className="ssoButton" onClick={facebookLogin}>
                    <AiFillFacebook size={30} style={{marginRight:12}} color="#1778F2" />Login with Facebook
                </Button>
                </div>
            </Grid>
            <Grid item xs={7} className="loginRight">
                <p className="loginPartitionTitle">REvaluate+</p>
                <p className="loginPartitionSubtitle">
                    Enjoying our services? We've got more for you!
                    Revaluate+ opens you to more advanced searches and comparisons,
                    and connect with other users as well!
                </p>
                <p><CheckCircleOutlineIcon /> Neighbourhood Comparator</p>
                <p><CheckCircleOutlineIcon /> Robo Housing Advisor</p>
                <p><CheckCircleOutlineIcon /> Forum</p>
            </Grid>
        </Grid>
        </div>}
    </div>
    : <div></div>);
}

export default LoginPage;
