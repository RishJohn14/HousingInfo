import React from 'react';
import './GetInsights.css';
import Header from '../../components/Header/Header';
import Chart from '../../components/Chart/Chart';
import { Grid } from '@mui/material';
import Table from 'react-bootstrap/Table';

function GetInsightsPage() {
    const currentYear = new Date().getFullYear();
    var years = [];
    for (let i = 1; i <= 10; i++) {
        years.push(currentYear - 10 + i);
    };

    return (
        <div>
            <Header/>
            <div className="background" >
                <Grid container >
                    <Grid item xs={5}>
                        <div className='insightsContainer'>
                            <Chart
                                type="bar"
                                labels={['Bukit Timah', 'Tanjong Pagar', 'Queenstown', 'Holland', 'Buona Vista']}
                                data={[
                                    {
                                    label: 'Dataset 1',
                                    data: [5, 4, 3, 2, 1],
                                    backgroundColor: 'rgba(7, 149, 171, 0.7',
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
                        <div className='insightsContainer'>
                            <Chart
                                type="line"
                                labels={years}
                                data={[
                                    {
                                        label: 'Singapore',
                                        data: [350000, 450000, 500000, 480000, 520000, 550000, 570000, 580000, 630000, 600000],
                                        borderColor: "rgba(8, 114, 201, 0.7",
                                        backgroundColor: 'rgba(8, 114, 201, 0.7',
                                    },
                                ]}
                                title="Resale Flat Prices across years"
                                hideLegends={true}
                                width="50vw"
                                height="35vh"
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={5}>
                        <div className='insightsContainer'>
                            <Chart
                                type="bar"
                                labels={['Jurong West', 'Woodlands', 'Sembawang', 'Yishun', 'Yew Tee']}
                                data={[
                                    {
                                    label: 'Dataset 1',
                                    data: [1, 2, 3, 4, 5],
                                    backgroundColor: 'rgba(7, 149, 171, 0.7',
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
                        <div className='insightsContainer'>
                            <p className='tableTitle'>Average Housing Transactions for the Past Year</p>
                            <Table striped bordered hover>
                                <thead className='tableHeader'>
                                    <tr>
                                        <th>Flat Type</th>
                                        <th>Average Size</th>
                                        <th>Average tenure</th>
                                        <th>Average Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>2</td>
                                        <td>3</td>
                                        <td>4</td>
                                    </tr>
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