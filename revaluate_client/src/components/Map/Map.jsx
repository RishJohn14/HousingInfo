import React, { useState } from "react";
import "./Map.css"
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import { Grid, requirePropFactory } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';

const transactionData = [
    {
        neighbourhood: 'Woodlands',
        lat: 1.3082,
        lng: 103.793,
    },
    {
        neighbourhood: 'Sembawang',
        lat: 1.309,
        lng: 103.79377,
    },
    {
        neighbourhood: 'Jurong East',
        lat: 1.3093,
        lng: 103.795,
    },
    {
        neighbourhood: 'Tampines',
        lat: 1.309,
        lng: 103.796,
    },
    {
        neighbourhood: 'Orchard',
        lat: 1.3075,
        lng: 103.7948,
    },
];

function Map(){
    const { isLoaded } = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY});

    const [center, updateCenter] = useState({lat: 1.308, lng: 103.793});
    const [town, updateTown] = useState('Neighbourhood');
    const [selectedPin, updateSelectedPin] = useState();
    const [cardVisible, updateCardVisibility] = useState(false);
    const [activeCarouselIndex, updateActiveCarouselIndex] = useState(0);

    function handleMarkerPress(idx) {
        updateSelectedPin(idx);
        updateCardVisibility(true);
    }

    function handleClose() {
        updateSelectedPin();
        updateCardVisibility(false);
    }

    return(
        <div className="map">
            { isLoaded &&
            <GoogleMap
                mapContainerStyle={{
                    height: '80vh',
                    width: '90vw',
                    margin: 'auto',
                    borderRadius: 10,
                }}
                center={center}
                zoom={18}
            >
                {transactionData.map((data, idx) =>
                <MarkerF
                    key={idx}
                    onClick={() => handleMarkerPress(idx)}
                    position={{lat: data.lat, lng: data.lng}}
                    options={{
                        icon: selectedPin === idx ? require('./greenPin.png') : require('./redPin.png'),
                    }}
                />)}
                <div className={cardVisible ? "cardVisible" : "cardNotVisible"}>
                    <Grid container>
                        <Grid item xs={11} className="swipeDiv">
                            <p className="swipe">Click next for more transactions in the same block {'>>'}</p>
                        </Grid>
                        <Grid item xs={1}>
                            <CloseIcon className="closeButton" onClick={handleClose} />
                        </Grid>
                    </Grid>
                    <Carousel
                        activeIndex={activeCarouselIndex}
                        onSelect={(idx) => {updateActiveCarouselIndex(idx)}}
                        variant="dark"
                        interval={null}
                        className="carousel"
                    >
                        <Carousel.Item>
                            <p className="roadName">Holland Close</p>
                            <p className="block">Block 123</p>
                            <p className="flatType">5-Room Flat</p>
                            <p className="sellingPriceLabel">Selling Price</p>
                            <p className="sellingPrice">$850,000</p>
                            <p className="transactionDetailsLabel">Transaction Details</p>
                            <p className="transactionDetails">Flat Size</p>
                            <p className="transactionDetails">Tenure Left</p>
                            <p className="transactionDetails">Proximity to MRT</p>
                            <p className="transactionDetails">Year Sold</p>
                        </Carousel.Item>
                        <Carousel.Item>
                            <p className="roadName">Holland Close</p>
                            <p className="block">Block 123</p>
                            <p className="flatType">5-Room Flat</p>
                            <p className="sellingPriceLabel">Selling Price</p>
                            <p className="sellingPrice">$850,000</p>
                            <p className="transactionDetailsLabel">Transaction Details</p>
                            <p className="transactionDetails">Flat Size</p>
                            <p className="transactionDetails">Tenure Left</p>
                            <p className="transactionDetails">Proximity to MRT</p>
                            <p className="transactionDetails">Year Sold</p>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </GoogleMap> }
        </div>
    )
}
export default Map;