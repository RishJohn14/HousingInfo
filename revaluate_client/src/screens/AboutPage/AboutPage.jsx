import React from 'react';
import './AboutPage.css'
import { Grid } from '@mui/material';
import Header from '../../components/Header/Header';


function AboutPage() {
    return (
        <div className='about'>
            <Header/>
            <Grid container className='about-grid'>
                <Grid item xs={8} className="about-content" >
                    <p className='about-title'>We are on a mission to help you revaluate your houses</p>
                    <p className='about-text'>For most of us, buying or selling a house is the biggest transaction of our lives. Here at HousingInfo, we help you handle it with care.</p>
                    <p className='about-minititle'>Our Services</p>
                    <ul>
                        <li>Help buyers find the estimated cost of a flat type in a neighbourhood</li>
                        <li>Help sellers find an estimated selling price for their house</li>
                        <li>Provide data insights on factors affecting housing prices in a neighbourhood </li>
                    </ul>
                </Grid>
                <Grid item xs={4}>
                <img src={require('./image 17.png')} alt={'about img'} className='aboutImg' />
                </Grid>

            </Grid>
        </div>
    )
}

export default AboutPage;