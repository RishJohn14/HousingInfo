import React, { useEffect, useState } from "react";
import './REvaluatePlusPage.css';
import Grid from '@mui/material/Grid';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import PricingChart from "../../components/PricingChart/PricingChart";

/**
 * RoboAdvisor Page
 * @returns RoboAdvisor Page
 */
function RoboAdvisor() {
    const navigate = useNavigate();

    //state
    const [minValue, updateMinValue] = useState(200000);
    const [maxValue, updateMaxValue] = useState(800000);
    const [householdPax, updateHouseholdPax] = useState(3);
    const [workplaceLocation, updateWorkplaceLocation] = useState('');
    const [inputsValid, updateInputsValid] = useState(false);
    const [apiResponse, updateApiResponse] = useState(false);

    //function to validate user input
    function validateForm() {
        if (maxValue - minValue < 100000) {return false;}
        if (workplaceLocation === '') {return false;}
        updateInputsValid(true);
    }

    //function that sends data to backend to get a recommendation
    function getAdvisorData() {
        Axios.get('http://localhost:3001/roboadvisor', { params: {minValue, maxValue, householdPax, workplaceLocation}})
        .then((response) => {
            response = response?.data;
            if (response?.data) {
                updateApiResponse(response);
            }
        })
        .catch((err) => navigate('/nodata'))
    }

    //whenever any of the user input is changed, validate user input
    useEffect(() => {
        validateForm();
    }, [minValue, maxValue, householdPax, workplaceLocation]);

    return (<div>
        <Grid container style={{textAlign: 'left', marginBottom: 20}}>
            <Grid item xs={6} className="neighbourhoodComparatorPartition">
                <p className="RoboAdvisorTitle">Robo Housing Advisor</p>
                <p className="RoboAdvisorSubtitle">Get advice catered to your needs</p>
                <Form>
                    <p className="RoboAdvisorSectionHeader">Your Budget</p>
                    <Form.Label><b>Minimum</b>: SGD {minValue}</Form.Label>
                    <Form.Range
                        value={minValue}
                        onChange={(e) => updateMinValue(e.target.value)}
                        min="100000"
                        max="300000"
                        className="RoboAdvisorSlider"
                    />
                    <Form.Label><b>Maximum</b>: SGD {maxValue}</Form.Label>
                    <Form.Range
                        value={maxValue}
                        onChange={(e) => updateMaxValue(e.target.value)}
                        min="400000"
                        max="1200000"
                        className="RoboAdvisorSlider"
                    />
                    <p className="RoboAdvisorSectionHeader">Your Workplace</p>
                    <div>
                        <Button
                            variant="dark"
                            className={workplaceLocation === 'North' ? "workplaceLocationButtonSelected" : "workplaceLocationButton"}
                            onClick={(e) => updateWorkplaceLocation(e.target.value)}
                            value = 'North'
                        >North</Button>
                        <Button
                            variant="dark"
                            className={workplaceLocation === 'East' ? "workplaceLocationButtonSelected" : "workplaceLocationButton"}
                            onClick={(e) => updateWorkplaceLocation(e.target.value)}
                            value='East'
                        >East</Button>
                        <Button
                            variant="dark"
                            className={workplaceLocation === 'West' ? "workplaceLocationButtonSelected" : "workplaceLocationButton"}
                            onClick={(e) => updateWorkplaceLocation(e.target.value)}
                            value='West'
                        >West</Button>
                        <Button
                            variant="dark"
                            className={workplaceLocation === 'Central' ? "workplaceLocationButtonSelected" : "workplaceLocationButton"}
                            onClick={(e) => updateWorkplaceLocation(e.target.value)}
                            value='Central'
                        >Central</Button>
                    </div>
                    <p className="RoboAdvisorSectionHeader">Number Of People In Your Household: {householdPax}</p>
                    <Form.Range
                        value={householdPax}
                        onChange={(e) => updateHouseholdPax(e.target.value)}
                        min="1"
                        max="8"
                        className="RoboAdvisorSlider"
                    />
                    <Button disabled={!inputsValid} onClick={getAdvisorData} className="RoboAdvisorSubmitButton">Submit</Button>
                </Form>
            </Grid>
            <Grid item xs={6}>
                {apiResponse && <div className="RoboAdvisorPartition">
                    <p className="RoboAdvisorResultsTitle">RESULTS</p>
                    <p className="RoboAdvisorResultsSectionHeader">Recommended Town: {apiResponse?.town}</p>
                    <p className="RoboAdvisorResultsSectionHeader">Suitable Flat Types</p>
                    <Table striped bordered hover>
                        <thead className='premiumTableHeader'>
                            <tr>
                                <th>Flat Type</th>
                                <th>Average Size (sqm)</th>
                                <th>Average Price (SGD)</th>
                            </tr>
                        </thead>
                        <tbody>
                        {apiResponse?.data.map((data, idx) => {
                            return <tr key={idx} className="tableRow">
                                <td>{data._id}</td>
                                <td>{data.avgSize?.toFixed(2)}</td>
                                <td>{data.avgPrice?.toFixed(2)}</td>
                            </tr>
                        })}
                        </tbody>
                    </Table>
                    <PricingChart
                        type="revaluate+"
                        town={apiResponse?.town}
                        title={"Prices Of " + apiResponse?.town + " Across Years"}
                        width="30vw"
                        height="40vh"
                    />
                </div>}
            </Grid>
        </Grid>
    </div>)
};

export default RoboAdvisor;