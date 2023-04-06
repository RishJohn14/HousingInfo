import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './GetInsights.css';
import Header from '../../components/Header/Header';
import Chart from '../../components/Chart/Chart';
import PricingChart from '../../components/PricingChart/PricingChart';
import { Grid } from '@mui/material';
import Table from 'react-bootstrap/Table';

function GetInsightsPage() {
    const navigate = useNavigate();
    const [mostValued, updateMostValued] = useState([[], []]);
    const [mostAffordable, updateMostAffordable] = useState([[], []]);
    const [housingStats, updateHousingStats] = useState([]);

    function getNeighbourhoodAffordabilityData() {
        Axios.get('http://localhost:3001/neighbourhoodAffordability')
        .then((response) => {
            response = response.data;
            if (response.status !== 'success') {navigate('/');}
            var valuedNeighbourhoodsLabels = [];
            var affordableNeighbourhoodsLabels = [];
            var valuedNeighbourhoodsAvgPrices = [];
            var affordableNeighbourhoodsAvgPrices = [];
            for (var i = 0; i < 5; i++) {
                valuedNeighbourhoodsLabels.push(response?.mostValued[i]._id);
                valuedNeighbourhoodsAvgPrices.push(response?.mostValued[i].avgPrice);
                affordableNeighbourhoodsLabels.push(response?.mostAffordable[i]._id);
                affordableNeighbourhoodsAvgPrices.push(response?.mostAffordable[i].avgPrice);
            }
            updateMostValued([valuedNeighbourhoodsLabels, valuedNeighbourhoodsAvgPrices]);
            updateMostAffordable([affordableNeighbourhoodsLabels, affordableNeighbourhoodsAvgPrices]);
        })
        .catch((err) => navigate('/'))
    };

    function getFlatStatsByType() {
        Axios.get('http://localhost:3001/flatStatsByType')
        .then((response) => {
            response = response.data;
            if (response?.status !== 'success') { navigate('/'); }
            console.log(response.data);
            updateHousingStats(response.data);
        })
        .catch((err) => navigate('/') )
    }

    useEffect(() => {
        getNeighbourhoodAffordabilityData();
        getFlatStatsByType();
    }, []);

    return (
        <div>
            <Header/>
            <div className="container-insights" >
                <Grid container >
                    <Grid item xs={5}>
                        <div className='grid-item'>
                            <Chart
                                type="bar"
                                labels={mostValued[0]}
                                data={[
                                    {
                                    data: mostValued[1],
                                    backgroundColor: 'rgba(7, 149, 171, 0.7)',
                                    },
                                ]}
                                title="Most Valued Neighbourhoods"
                                hideLegends={true}
                                width="30vw"
                                height="35vh"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={7}>
                        <div className='grid-item'>
                            <PricingChart
                                type="general"
                                title="Resale Flat Prices across years"
                                width="50vw"
                                height="35vh"
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={5}>
                        <div className='grid-item'>
                            <Chart
                                type="bar"
                                labels={mostAffordable[0]}
                                data={[
                                    {
                                    data: mostAffordable[1],
                                    backgroundColor: 'rgba(7, 149, 171, 0.7)',
                                    },
                                ]}
                                title="Most Affordable Neighbourhoods"
                                hideLegends={true}
                                width="30vw"
                                height="35vh"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={7}>
                        <div className='grid-item'>
                            <p className='tableTitle'>Average Housing Transactions for the Past Year</p>
                            <Table striped bordered hover>
                                <thead className='tableHeader'>
                                    <tr>
                                        <th>Flat Type</th>
                                        <th>Average Size (sqm)</th>
                                        <th>Average tenure (Years)</th>
                                        <th>Average Price (SGD)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {housingStats.map((data, idx) => {
                                    return <tr key={idx} className="tableRow">
                                        <td>{data._id}</td>
                                        <td>{data.avgSize?.toFixed(2)}</td>
                                        <td>{data.avgTenure?.toFixed(2)}</td>
                                        <td>{data.avgPrice?.toFixed(2)}</td>
                                    </tr>
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default GetInsightsPage;