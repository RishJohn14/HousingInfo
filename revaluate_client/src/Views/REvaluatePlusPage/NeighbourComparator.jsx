import React, { useEffect, useState } from "react";
import './REvaluatePlusPage.css';
import { towns } from "../../constants";
import { InputLabel, NativeSelect } from '@mui/material';
import Axios from "axios";
import Chart from '../../components/Chart/Chart';
import PricingChart from "../../components/PricingChart/PricingChart";
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';

/**
 * Neighbourhood Comparator Page
 * @returns Neighbourhood Comparator Page
 */
function NeighbourhoodComparator() {
    const navigate = useNavigate();

    //states
    const [selectedTown, updateSelectedTown] = useState('');
    const [neighbourhoodCount, updateNeighbourCount] = useState([]);
    const [xAxis, updateXAxis] = useState([]);
    const [housingStatistics, updateHousingStatistics] = useState([{_id: '1 ROOM'}, {_id: '2 ROOM'}, {_id: '3 ROOM'}, {_id: '4 ROOM'}, {_id: '5 ROOM'}, {_id: 'EXECUTIVE'}, {_id: 'MULTI-GENERATION'}]);

    //function to get time-series number of transaction data for a neighbourhood from backend
    function getNeighbourhoodCount() {
        Axios.get('http://localhost:3001/neighbourhoodCountChart', { params: {town: selectedTown}})
        .then((response) => {
            response = response.data;
            console.log(response);
            if (response?.status === 'success') {
                var neighbourhood_count = [];
                for (var i = 0; i < response?.neighbourhoodData.length; i++) {
                    neighbourhood_count.push(response?.neighbourhoodData[i].count);
                }
                updateNeighbourCount(neighbourhood_count);
                updateXAxis(response?.xAxis);
            }
        })
        .catch((err) => navigate('/nodata'))
    }

    //function that gets statistics of each house type for a neighbourhood from backend
    function getNeighbourhoodStatistics() {
        Axios.get('http://localhost:3001/neighbourhoodStatistics', { params: {town: selectedTown}})
        .then((response) => {
            response = response.data;
            if (response?.data.length > 0) {
                var data = [];
                for (var i = 0; i < housingStatistics.length; i++) {
                    for (var j = 0; j < response.data.length; j++) {
                        if (housingStatistics[i]._id === response.data[j]._id) {
                            data.push({...housingStatistics[i], ...response.data[j]});
                            break;
                        }
                        //no match found
                        if (j === response.data.length - 1) {
                            data.push(housingStatistics[i]);
                        }
                    }
                }
                updateHousingStatistics(data);
            }
        })
        .catch((err) => navigate('/nodata'))
    }

    //whenever the selected neighbourhood is changed, get data of the new neighbourhood from backend
    useEffect(() => {
        getNeighbourhoodCount();
        getNeighbourhoodStatistics();
    }, [selectedTown]);

    return (
    <div>
        <div className="premium-dropdown-box">
            <InputLabel htmlFor="neighbourhood">
            Neighbourhood
            </InputLabel>
            <NativeSelect
            id="neighbourhood"
            value={selectedTown}
            onChange={(e) => {updateSelectedTown(e.target.value)}}
            fullWidth
            >
            <option></option>
            {towns?.map((option, idx) => <option key={idx} >{option}</option>)}
            </NativeSelect>
        </div>
        <PricingChart
            type = 'revaluate+'
            title = 'Average Pricing Across Years'
            town = {selectedTown}
            width="30vw"
            height="35vh"
        />
        <Chart
            type="line"
            labels={xAxis}
            data={[
                {
                    label: 'Neighbourhood',
                    data: neighbourhoodCount,
                    borderColor: "rgba(8, 114, 201, 0.7)",
                    backgroundColor: "rgba(8, 114, 201, 0.7)",
                },
            ]}
            title="Number of Transactions Across Years"
            width="30vw"
            height="35vh"
        />
        <p className='premiumTableTitle'>Average Housing Transactions for the Past Year</p>
        <Table striped bordered hover>
            <thead className='premiumTableHeader'>
                <tr>
                    <th>Flat Type</th>
                    <th>Average Size (sqm)</th>
                    <th>Average tenure (Years)</th>
                    <th>Average Price (SGD)</th>
                </tr>
            </thead>
            <tbody>
            {housingStatistics.map((data, idx) => {
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
    );
}

export default NeighbourhoodComparator;
