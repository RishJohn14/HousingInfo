import React, { useEffect, useState } from "react";
import './REvaluatePlusPage.css';
import Header from "../../components/Header/Header";
import auth from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Grid from '@mui/material/Grid';
import NeighbourhoodComparator from "./NeighbourComparator";
import RoboAdvisor from "./RoboAdvisor";
import LogoutIcon from '@mui/icons-material/Logout';
import Forum from "./Forum";
import { useNavigate } from "react-router-dom";

/**
 * REvaluate+ home page
 * @author Augustine Lee
 * @returns REvaluate+ home page
 */
function REvaluatePlusPage() {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    //state
    const [selectedTab, updateSelectedTab] = useState(0);

    //function that handles log out and redirect the user to the home page
    function handleLogout() {
        auth.signOut();
        navigate('/');
    }

    return (
    <div>
        <Header />
        <Grid container>
            <Grid item xs={11}>
                <p className="premiumWelcomeTitle">
                    <img src={user?.photoURL} className="userProfilePic" /> Welcome, {user?.displayName}
                </p>
            </Grid>
            <Grid item xs={1}>
                <p className="premiumLogout" onClick={handleLogout}>Logout <LogoutIcon /></p>
            </Grid>
        </Grid>
        <Grid container paddingLeft={'6rem'} paddingTop={'3rem'}>
            <Grid item xs={2.1} className='premiumTabGroup'>
                <p className={selectedTab === 0 ? 'premiumTabIndexSelected' : 'premiumTabIndex'} onClick={() => updateSelectedTab(0)}>
                    Neighbourhoods Comparator
                </p>
                <p className={selectedTab === 1 ? 'premiumTabIndexSelected' : 'premiumTabIndex'} onClick={() => updateSelectedTab(1)}>
                    RoboAdvisor
                </p>
                <p className={selectedTab === 2 ? 'premiumTabIndexSelected' : 'premiumTabIndex'} onClick={() => updateSelectedTab(2)}>
                    Forum
                </p>
            </Grid>
            <Grid item xs={9.9} paddingLeft={'5rem'}>
                {selectedTab === 0 && <div>
                <p className="NeighbourhoodComparatorTitle">Compare Neighbourhoods</p>
                <Grid container style={{textAlign: 'left', marginBottom: 20}}>
                    <Grid item xs={6} className="neighbourhoodComparatorPartition">
                    <NeighbourhoodComparator />
                    </Grid>
                    <Grid item xs={6} className="neighbourhoodComparatorPartition">
                    <NeighbourhoodComparator />
                    </Grid>
                </Grid>
                </div>
                }
                {selectedTab === 1 && <RoboAdvisor />}
                {selectedTab === 2 && <Forum />}
            </Grid>
        </Grid>
    </div>
    );
}

export default REvaluatePlusPage;
