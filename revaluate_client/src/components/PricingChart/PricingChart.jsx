import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Chart from "../Chart/Chart";

/**
 * Chart component used to display time series pricing charts
 * @param {type, title, town = '', latitude = '', longitude = '', flat_type = '',  width, height} props 
 * @returns Pricing Chart component
 */
function PricingChart(props) {
    //type can be general, comparisonBuyer, comparisonSeller
    const {type, title, town = '', latitude = '', longitude = '', flat_type = '',  width, height} = props;
    
    //states
    const [xAxis, updateXAxis] = useState([]);
    const [neighbourhoodData, updateNeighbourhoodData] = useState([]);
    const [singaporeData, updateSingaporeData] = useState([]);
    const navigate = useNavigate();

    //get time-series pricing information according to user type
    function getPricing(type) {
        var townData = [];
        var singaporeData = [];
        var labels = [];

        if (type === 'general') {
            Axios.get('http://localhost:3001/generalPricingChart')
            .then((response) => {
                response = response.data;
                if (response?.status !== 'success') {navigate('/nodata');}
                for (var i = 0; i < response?.singaporeData.length; i++) {
                    singaporeData.push(response?.singaporeData[i].avgPrice);
                    labels.push(response?.singaporeData[i]._id);
                }
                updateSingaporeData(singaporeData);
                updateXAxis(labels);
            })
            .catch((err) => console.log(err))
        }
        else if (type === 'comparisonBuyer') {
            Axios.get('http://localhost:3001/neighbourhoodPriceComparisonChart', { params: {town: town.toUpperCase(), flat_type, type: 'buyer'}})
            .then((response) => {
                response = response.data;
                if (response?.status !== 'success') {navigate('/nodata');}
                for (var i = 0; i < response?.singaporeData.length; i++) {
                    singaporeData.push(response?.singaporeData[i].avgPrice);
                    labels.push(response?.singaporeData[i]._id);
                    townData.push(response?.neighbourhoodData[i].avgPrice);
                }
                updateNeighbourhoodData(townData);
                updateSingaporeData(singaporeData);
                updateXAxis(labels);
            })
            .catch(err => console.log(err))
        }
        else if (type === 'comparisonSeller') {
            Axios.get('http://localhost:3001/neighbourhoodPriceComparisonChart', { params: {latitude, longitude, flat_type, type: 'seller'}})
            .then((response) => {
                response = response.data;
                if (response?.status !== 'success') {navigate('/nodata');}
                for (var i = 0; i < response?.singaporeData.length; i++) {
                    singaporeData.push(response?.singaporeData[i].avgPrice);
                    labels.push(response?.singaporeData[i]._id);
                    townData.push(response?.neighbourhoodData[i].avgPrice);
                }
                updateNeighbourhoodData(townData);
                updateSingaporeData(singaporeData);
                updateXAxis(labels);
            })
            .catch(err => console.log(err))
        }
        else if (type === 'revaluate+' && town !== '') {
            Axios.get('http://localhost:3001/neighbourhoodPriceComparisonChart', { params: {town: town.toUpperCase(), type: 'revaluate+'}})
            .then((response) => {
                response = response.data;
                if (response?.status !== 'success') {navigate('/nodata');}
                for (var i = 0; i < response?.singaporeData.length; i++) {
                    singaporeData.push(response?.singaporeData[i].avgPrice);
                    labels.push(response?.singaporeData[i]._id);
                    townData.push(response?.neighbourhoodData[i].avgPrice);
                }
                updateNeighbourhoodData(townData);
                updateSingaporeData(singaporeData);
                updateXAxis(labels);
            })
            .catch(err => console.log(err))
        }
    }

    //get updated pricing information whenever any of the states changes
    useEffect(() => {
        getPricing(type);
    }, [flat_type, latitude, longitude, navigate, town, type]);

    return <Chart
    type="line"
    labels={xAxis}
    data={
        type === 'general' ?
        [{
            label: "Singapore",
            data: singaporeData,
            borderColor: "rgba(8, 114, 201, 0.7)",
            backgroundColor: "rgba(8, 114, 201, 0.7)",
        }] :
        [
            {
            label: 'Neighbourhood',
            data: neighbourhoodData,
            borderColor: "rgba(8, 212, 157, 0.7)",
            backgroundColor: "rgba(8, 212, 157, 0.7)",
            },
            {
            label: "Singapore",
            data: singaporeData,
            borderColor: "rgba(8, 114, 201, 0.7)",
            backgroundColor: "rgba(8, 114, 201, 0.7)",
            },
        ]
    }
    title={title}
    hideLegends={false}
    width={width}
    height={height}
  />
}

export default PricingChart;