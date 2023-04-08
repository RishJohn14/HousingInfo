import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import Header from "../../components/Header/Header";
import auth from "../../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from 'react-bootstrap/Button';
import { Google, Microsoft, Facebook } from 'react-bootstrap-icons'
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Login Page for REvaluate+
 * @author Rishabh John, Augustine Lee
 * @returns Login Page for REvaluate+
 */
function LoginPage() {
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const [user, loading] = useAuthState(auth);

    //function that performs google SSO login using google identity provider
    async function googleLogin() {
        try {
            const login = await signInWithPopup(auth, googleProvider);
        } catch (err) { console.log(err); }
    }

    //on load, if there is already a signed in user, redirect to revaluate+ page
    useEffect(() => {
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
                    Login with Google <Google size={20} />
                </Button>
                </div>
                <div className="ssoButtonDiv">
                <Button className="ssoButton" onClick={googleLogin}>
                    Login with Microsoft <Microsoft size={20} />
                </Button>
                </div>
                <div className="ssoButtonDiv">
                <Button className="ssoButton" onClick={googleLogin}>
                    Login with Facebook <Facebook size={20} />
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
