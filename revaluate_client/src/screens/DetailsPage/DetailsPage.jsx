import React from "react";
import "./DetailsPage.css";
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
import PriceFilterBar from "../../components/PriceFilterBar/PriceFilterBar";
import Chart from "../../components/Chart/Chart";
import { Grid } from "@mui/material";

function DetailsPage() {
  const currentYear = new Date().getFullYear();
  var years = [];
  for (let i = 1; i <= 10; i++) {
    years.push(currentYear - 10 + i);
  }

  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={7}>
          <div className="left-half">
            <p className="Location_Title">
              Holland Estate
            </p>
            <p className="TypeofFlat">5-Room Flat</p>
            <p className="Estimated Price">Est Price</p>
            <p className="Price">$700,000</p>
            <div className="bar">
              <div className="line left">
                <div className="price1">$500,000</div>
              </div>
              <div className="line center">
                <div className="price2">$700,000</div>
              </div>
              <div className="line right">
                <div className="price3">$1,000,000</div>
              </div>
            </div>
            <h1
              className="Features of Holland State"
            >
              Features of Holland Estate
            </h1>
            <p className="Features">
              Average Distance from flat to mrt:<br></br>
              Most common flat type Trasnacted:<br></br>
              Average Tenure left during transaction:<br></br>
              Average resale flat size:
            </p>
            <h1 className="Most valued">
              Most Valued streets in Holland Estate
            </h1>
            <p className="streets">
              1. Holland Drive <br></br>
              &nbsp;&nbsp;&nbsp;2. Holland Avenue <br></br>
              3. Holland Close <br></br>
              4. Holland Grove <br></br>
              5. Holland Road <br></br>
            </p>
          </div>
        </Grid>
        <Grid item xs={5} padding={3}>
          <div className="chartDiv">
            <Chart
              type="bar"
              labels={[
                "Flat Size",
                "Tenure Left",
                "Year Sold",
                "Proximity to MRT",
                "Floor range",
              ]}
              data={[
                {
                  label: "Dataset 1",
                  data: [7, 5, 3, 4, 2],
                  backgroundColor: "rgba(7, 149, 171, 0.7",
                },
              ]}
              title="Most valued flat features in Holland"
              hideLegends={true}
              width="30vw"
              height="20vw"
            />
            <Chart
              type="line"
              labels={years}
              data={[
                {
                  label: "Holland",
                  data: [
                    500000, 550000, 600000, 570000, 590000, 670000, 680000,
                    750000, 850000, 800000,
                  ],
                  borderColor: "rgba(8, 212, 157, 0.7",
                  backgroundColor: "rgba(8, 212, 157, 0.7",
                },
                {
                  label: "Singapore",
                  data: [
                    350000, 450000, 500000, 480000, 520000, 550000, 570000,
                    580000, 630000, 600000,
                  ],
                  borderColor: "rgba(8, 114, 201, 0.7",
                  backgroundColor: "rgba(8, 114, 201, 0.7",
                },
              ]}
              title="Holland Flat Prices across Years"
              hideLegends={false}
              width="30vw"
              height="20vw"
            />
          </div>
        </Grid>
      </Grid>
      <p className="detailsSeparator">
        Check out below how much your neighbours are selling their houses for
      </p>
      <PriceFilterBar />
      <Map />
    </div>
  );
}

export default DetailsPage;
