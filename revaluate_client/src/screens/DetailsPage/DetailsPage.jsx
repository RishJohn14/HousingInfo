import React from 'react';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import PriceFilterBar from '../../components/PriceFilterBar/PriceFilterBar';

function DetailsPage() {
    return (
        <div>
        <Header/>
        <PriceFilterBar/>
        <Map />
        </div>
    )
}

export default DetailsPage;