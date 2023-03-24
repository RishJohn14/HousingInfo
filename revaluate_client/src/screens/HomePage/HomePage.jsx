import React from "react";
import { useState } from "react";
import "./HomePage.css";
import {
  Stack,
  Grid,
  Button,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Header from "../../components/Header/Header";
import SwitchButton from "../../components/SwitchButton/SwitchButton";

function HomePage() {
  const [formats, setFormats] = useState();
  const handleFormatChange = (event, updatedFormat) => {
    if (updatedFormat !== null) setFormats(updatedFormat);
  };

  return (
    <Grid container className="home">
      <Grid item xs={7}>
        <Header />
        <div className="home-left">
            <p className="home-title">Find the fair value of a house today!</p>
            <div className="home-form">
            <p className="user-type-label">I am looking to</p>
            <Stack direction="row">
                <ToggleButtonGroup
                aria-label="selection"
                value={formats}
                onChange={handleFormatChange}
                color="success"
                exclusive
                size="large"
                >
                <ToggleButton
                    value="buy"
                    aria-label="buy"
                    style={{ fontSize: 18 }}
                >
                    {" "}
                    Buy a house{" "}
                </ToggleButton>
                <ToggleButton
                    value="sell"
                    aria-label="sell"
                    style={{ fontSize: 18 }}
                >
                    {" "}
                    Sell a house{" "}
                </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <SwitchButton />
            <div className="home-dropdown-box">
                <InputLabel htmlFor="select1">
                Housing District
                </InputLabel>
                <NativeSelect
                id="select1"
                value={formats}
                exclusive
                onChange={handleFormatChange}
                fullWidth
                >
                <option value="option1">Option1</option>
                <option value="option2">Option2</option>
                <option value="option3">Option3</option>
                </NativeSelect>
            </div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="select2">
                Neighbourhood
                </InputLabel>
                <NativeSelect
                id="select2"
                value={formats}
                exclusive
                onChange={handleFormatChange}
                fullWidth
                >
                <option value="option1">Option1</option>
                <option value="option2">Option2</option>
                <option value="option3">Option3</option>
                </NativeSelect>
            </div>
            <div className="home-dropdown-box">
                <InputLabel htmlFor="select3">
                House Type
                </InputLabel>
                <NativeSelect
                id="select3"
                value={formats}
                exclusive
                onChange={handleFormatChange}
                fullWidth
                >
                <option value="1bhk">1BHK</option>
                <option value="2bhk">2BHK</option>
                <option value="3bhk">3BHK</option>
                <option value="4bhk">4BHK</option>
                <option value="5bhk">5BHK</option>
                </NativeSelect>
            </div>
            <button className="home-submit-button">Get Price</button>
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
    </Grid>
  );
}

export default HomePage;
