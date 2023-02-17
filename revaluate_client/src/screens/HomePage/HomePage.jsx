import React from 'react';
import './HomePage.css'
import { Grid } from '@mui/material';

function HomePage() {
    return (<Grid container>
        <Grid item xs={7}>
            <p>REvaluate</p>
        </Grid>
        <Grid item xs={5}>
            <img src={require('./houseVectorImg.png')} alt={'house img'} className='homeImg' />
        </Grid>
    </Grid>)
}

export default HomePage;