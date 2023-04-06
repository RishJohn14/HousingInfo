import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import "./HomePage.css";
import { buyerOptions, flatTypes } from "../../constants";
import {
  Grid,
  TextField,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import Header from "../../components/Header/Header";
import SwitchButton from "../../components/SwitchButton/SwitchButton";
import { TypeAnimation } from 'react-type-animation';
import { GuardSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [loading, updateLoading] = useState(true);
  const [loadingFade, updateLoadingFade] = useState(false);
  const [isBuyer, updateIsBuyer] = useState(true);
  const [districtIdx, updateDistrictIdx] = useState(0);
  const [searchDetails, updateSearchDetails] = useState({'buyerNeighbourhood': '', 'buyerHouseType': ''});

  function handleDistrictChange(event) {
    updateDistrictIdx(event.target.selectedIndex - 1);
    updateSearchDetails({...searchDetails, 'buyerDistrict': event.target.value, 'buyerNeighbourhood': ''});
  }

  async function handleSubmission() {
    const res = await Axios.get("http://localhost:3001/validateform", { params: {...searchDetails, "type": isBuyer ? "buyer" : "seller" }});
    if (res?.data?.status === 'success') {
      navigate('/details', {'state': res.data});
    }
  }

  useEffect(() => {
    setTimeout(() => updateLoadingFade(true), 1400);
    setTimeout(() => updateLoading(false), 2000);
  }, []);

  return (
    <Grid container className="home">
    { loading
      ? <div className={loadingFade ? "loading fade" : "loading"}>
          <div className="guardLoader">
          <GuardSpinner size={50} frontColor="#FFFFFF" />
          </div>
          <TypeAnimation sequence={['REvaluate']} speed={15} cursor={false} className="revaluateLoader" />
        </div>
      : <>
      <Grid item xs={7}>
        <Header />
        <div className="home-left">
            <p className="home-title">Find the fair value of a house today!</p>
            <div className="home-form">
            <p className="user-type-label">I am looking to</p>
            <SwitchButton callback={updateIsBuyer} onChange={() => console.log('hello')}/>
            { isBuyer && <div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="buyerDistrict">
                Housing District
                </InputLabel>
                <NativeSelect
                id="buyerDistrict"
                value={searchDetails?.buyerDistrict || ''}
                onChange={(e) => handleDistrictChange(e)}
                fullWidth
                >
                <option></option>
                {buyerOptions.map((option, idx) => <option key={idx}>{option?.district}</option>)}
                </NativeSelect>
            </div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="buyerNeighbourhood">
                Neighbourhood
                </InputLabel>
                <NativeSelect
                id="buyerNeighbourhood"
                value={searchDetails?.buyerNeighbourhood || ''}
                onChange={(e) => updateSearchDetails({...searchDetails, 'buyerNeighbourhood': e.target.value})}
                fullWidth
                >
                <option></option>
                {buyerOptions[districtIdx]?.towns.map((option, idx) => <option key={idx} >{option?.name}</option>)}
                </NativeSelect>
            </div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="buyerHouseType">
                House Type
                </InputLabel>
                <NativeSelect
                id="buyerHouseType"
                value={searchDetails?.buyerHouseType}
                onChange={(e) => updateSearchDetails({...searchDetails, 'buyerHouseType': e.target.value})}
                fullWidth
                >
                <option></option>
                {flatTypes.map((type, idx) => <option key={idx}>{type}</option>)}
                </NativeSelect>
            </div>
            </div> }
            { !isBuyer && <div>
            <div className="home-dropdown-box">
              <TextField
                id="postalCode"
                label="Postal Code"
                variant="standard"
                value={searchDetails?.sellerPostalCode || ''}
                onChange={(e) => updateSearchDetails({...searchDetails, 'sellerPostalCode': e.target.value})}
                fullWidth
              />
            </div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="sellerHouseType">
                House Type
                </InputLabel>
                <NativeSelect
                id="sellerHouseType"
                value={searchDetails?.sellerHouseType || ''}
                onChange={(e) => updateSearchDetails({...searchDetails, 'sellerHouseType': e.target.value})}
                fullWidth
                >
                <option></option>
                {flatTypes.map((type, idx) => <option key={idx}>{type}</option>)}
                </NativeSelect>
            </div>
            </div> }
            <button className="home-submit-button" onClick={handleSubmission}>Get Price</button>
            </div>
        </div>
      </Grid>
      <Grid item xs={5}>
        <img
          src={require("./houseVectorImg.png")}
          alt={"house img"}
          className="home-img"
        />
      </Grid>
      </>
    }
    </Grid>
  );
}

export default HomePage;
