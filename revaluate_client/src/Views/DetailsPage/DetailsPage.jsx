import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import "./DetailsPage.css";
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
import PriceFilterBar from "../../components/PriceFilterBar/PriceFilterBar";
import Chart from "../../components/Chart/Chart";
import PricingChart from "../../components/PricingChart/PricingChart";
import { townLatLongMap } from "../../constants";
import { Grid } from "@mui/material";
import Axios from "axios";
import { TypeAnimation } from 'react-type-animation';
import { FlagSpinner } from "react-spinners-kit";
import { useLocation } from "react-router-dom";
import Table from 'react-bootstrap/Table';

/**
 * Details Page displaying search results
 * @author Lavanya Sharma
 * @returns Details Page
 */
function DetailsPage() {
  //get information passed from home page
  const { state } = useLocation();
  const navigate = useNavigate();

  //states
  const [loading, updateLoading] = useState(true);
  const [loadingFade, updateLoadingFade] = useState(false);
  const [detailsData, updateDetailsData] = useState([]);
  const [correlationData, updateCorrelationData] = useState({});
  const [minPrice, updateMinPrice] = useState(0);
  const [maxPrice, updateMaxPrice] = useState(2000000);

  //function that gets search text results from backend
  function getDetailsData() {
    Axios.get("http://localhost:3001/details", { params: state })
    .then((res) => updateDetailsData(res.data))
    .catch((err) => console.log("error"))
  }

  //function that gets correlation between features and price to plot graph
  function getCorrelationData() {
    Axios.get("http://localhost:3001/correlation", { params: state })
    .then((res) => {
      res = res.data;
      if (res === 'failure') {navigate('/nodata');}
      updateCorrelationData({
        labels: ['Year', 'Storey Range', 'Flat Size', 'Remaining Lease'],
        data: [res?.yearCorrelation, res?.storeyRangeCorrelation, res?.sizeCorrelation, res?.leaseCorrelation]
      })
    })
    .catch((err) => console.log("error"))
  }

  //on load, display loading animation
  useEffect(() => {
    setTimeout(() => updateLoadingFade(true), 1700);
    setTimeout(() => updateLoading(false), 2300);
  }, []);

  //on load, get data from backend
  useEffect(() => {
    if (!state?.type) {
      navigate('/');
    } else {
      getDetailsData();
      getCorrelationData();
    }
  }, []);

  if (state)
    return (
      <div>
        { loading
        ? <div className={loadingFade ? "searching fade" : "searching"}>
            <div className="flagLoader">
            <FlagSpinner size={50} />
            </div>
            <TypeAnimation sequence={['Loading...']} speed={12} cursor={false} className="searchLoader" />
          </div>
        : <>
          <Header />
          <Grid container>
            <Grid item xs={7}>
              <div className="left-half">
                <p className="Location_Title">
                  {state.type === 'buyer' ?
                  state.buyerNeighbourhood + " Estate" :
                  state.road_name}
                </p>
                <p className="TypeofFlat">{state.buyerHouseType}</p>
                <p className="Estimated Price">Est Price</p>
                <p className="Price">${detailsData["50th_percentile_price"]}</p>
                <div className="bar">
                  <div className="line left">
                    <div className="price1">${detailsData["25th_percentile_price"]}</div>
                  </div>
                  <div className="line center">
                    <div className="price2">${detailsData["50th_percentile_price"]}</div>
                  </div>
                  <div className="line right">
                    <div className="price3">${detailsData["75th_percentile_price"]}</div>
                  </div>
                </div>
                <h1
                  className="Features of Holland State"
                >
                  { state.type === "buyer" && ("Features of " + state.buyerNeighbourhood + " Estate") }
                  { state.type === "seller" && "At this quoted price, the average features are:" }
                </h1>
                <p className="Features">
                  Average Remaining Lease (Years): {detailsData["avg_remaining_lease"]?.toFixed(2)}<br></br>
                  Average House Age: {detailsData["avg_house_age"]}<br></br>
                  Average Resale Flat Size (sqm): {detailsData["avg_flat_size"]?.toFixed(2)}<br></br>
                </p>
                { state.type === "buyer" &&
                <>
                <h1 className="Most valued">
                  Most Valued streets in {state.buyerNeighbourhood} Estate
                </h1>
                <div className="streets">
                  <p>{detailsData?.most_common_street?.length > 0 ? '1. ' + detailsData?.most_common_street[0][0] : ''}</p>
                  <p>{detailsData?.most_common_street?.length > 1 ? '2. ' + detailsData?.most_common_street[1][0] : ''}</p>
                  <p>{detailsData?.most_common_street?.length > 2 ? '3. ' + detailsData?.most_common_street[2][0] : ''}</p>
                  <p>{detailsData?.most_common_street?.length > 3 ? '4. ' + detailsData?.most_common_street[3][0] : ''}</p>
                  <p>{detailsData?.most_common_street?.length > 4 ? '5. ' + detailsData?.most_common_street[4][0] : ''}</p>
                </div>
                </> }
                { state.type === "seller" &&
                <>
                <h1 className="Most valued">
                  Most Recent Transactions In Your Area
                </h1>
                <div className="streets">
                  <Table striped bordered hover className="sellerTable">
                    <thead className='sellerTableHeader'>
                        <tr>
                            <th>Street Name</th>
                            <th>Flat Type</th>
                            <th>Remaining Lease (Years)</th>
                            <th>Resale Price (SGD)</th>
                        </tr>
                    </thead>
                    <tbody>
                    {detailsData?.transactions && detailsData.transactions.map((data, idx) => {
                        return <tr key={idx} className="tableRow">
                            <td>{data?.street_name}</td>
                            <td>{data?.flat_type}</td>
                            <td>{data?.remaining_lease}</td>
                            <td>{data?.resale_price}</td>
                        </tr>
                    })}
                    </tbody>
                  </Table>
                </div>
                </> }
              </div>
            </Grid>
            <Grid item xs={5} padding={3}>
              <div className="chartDiv">
                <Chart
                  type="bar"
                  labels={correlationData?.labels}
                  data={[
                    {
                      data: correlationData?.data,
                      backgroundColor: "rgba(7, 149, 171, 0.7",
                    },
                  ]}
                  title={"Flat features importance " +
                  (state.type === 'buyer' ?
                  "in " + state.buyerNeighbourhood :
                  "near " + state.road_name)}
                  hideLegends={true}
                  width="30vw"
                  height="20vw"
                />
                <PricingChart
                  type = {state.type === 'buyer' ? 'comparisonBuyer' : 'comparisonSeller'}
                  title = {(state.type === "buyer" ? state.buyerNeighbourhood : "Nearby") + " Flat Prices across Years"}
                  town = {state.type === 'buyer' ? state.buyerNeighbourhood : ''}
                  latitude = {state.type === 'seller' ? state.latitude : ''}
                  longitude = {state.type === 'seller' ? state.longitude : ''}
                  flat_type = {state.type === 'buyer' ? state.buyerHouseType : state.sellerHouseType}
                  width="30vw"
                  height="20vw"
                />
              </div>
            </Grid>
          </Grid>
          <p className="detailsSeparator">
            Check out below how much your neighbours are selling their houses for
          </p>
          <PriceFilterBar updateMinCallback={updateMinPrice} updateMaxCallback={updateMaxPrice} />
          <Map
            minPrice={minPrice}
            maxPrice={maxPrice}
            centre={state?.type === 'buyer' ? townLatLongMap[state?.buyerNeighbourhood] : [state?.latitude, state?.longitude]}
            houseType={state?.type === 'buyer' ? state?.buyerHouseType : state?.sellerHouseType}
          />
          </>
        }
      </div>
    );
}

export default DetailsPage;
