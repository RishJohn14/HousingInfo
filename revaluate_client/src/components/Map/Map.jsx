import React, { useEffect, useState } from "react";
import "./Map.css"
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import Carousel from 'react-bootstrap/Carousel';
import Axios from 'axios';

/**
 * Map component that uses Google Map API with further customisation
 * @author Augustine Lee
 * @param {minPrice, maxPrice, houseType, centre} props 
 * @returns Map component
 */
function Map(props){
    const { minPrice, maxPrice, houseType, centre } = props;
    const { isLoaded } = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY});

    //states
    const [center, updateCenter] = useState({lat: Number(centre[0]), lng: Number(centre[1])});
    const [mapData, updateMapData] = useState([]);
    const [selectedPin, updateSelectedPin] = useState();
    const [selectedData, updateSelectedData] = useState([]);
    const [cardVisible, updateCardVisibility] = useState(false);
    const [activeCarouselIndex, updateActiveCarouselIndex] = useState(0);

    //on load, get map data from backend
    useEffect(() => {
        getMapData();
    }, []);

    //function to get map data from backend and update state
    function getMapData() {
        Axios.get('http://localhost:3001/map', { params: {minPrice, maxPrice, houseType}})
        .then((res) => updateMapData(res.data))
        .catch((err) => console.log('error occured'))
    }

    //function to get a particular location data and display information card when the pin is clicked
    function handleMarkerPress(idx) {
        updateSelectedPin(idx);
        const latlng = [mapData[idx]?._id, mapData[idx]?.longitude[0]];
        Axios.get('http://localhost:3001/getTransactionsFromPin',
        {'params': {latitude: latlng[0], longitude: latlng[1], flat_type: houseType}})
        .then((response) => {
            response = response.data;
            if (response.status !== 'success') { console.log('error'); }
            updateSelectedData(response.data);
        })
        .catch((err) => console.log(err))

        updateCardVisibility(true);
    }

    //function to close the information card
    function handleClose() {
        updateSelectedPin();
        updateCardVisibility(false);
    }

    return(
        <div className="map">
            { isLoaded &&
            <GoogleMap
                mapContainerStyle={{
                    height: '95vh',
                    width: '90vw',
                    margin: 'auto',
                    borderRadius: 10,
                }}
                center={center}
                zoom={18}
            >
                {mapData.map((data, idx) =>
                <MarkerF
                    key={idx}
                    onClick={() => handleMarkerPress(idx)}
                    position={{lat: data._id, lng: data.longitude[0]}}
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
                        {selectedData.map((data) => {
                            return <Carousel.Item key = {data?._id}>
                                <p className="roadName">{data?.street_name}</p>
                                <p className="block">{'Block ' + data?.block}</p>
                                <p className="flatType">{data?.flat_type + ' Flat'}</p>
                                <p className="sellingPriceLabel">Selling Price</p>
                                <p className="sellingPrice">{'$' + data?.resale_price}</p>
                                <p className="transactionDetailsLabel">Transaction Details</p>
                                <p className="transactionDetails">{'Flat Size (sqm): ' + data?.floor_area_sqm}</p>
                                <p className="transactionDetails">{'Flat Model: ' + data?.flat_model}</p>
                                <p className="transactionDetails">{'Storey Range: ' + data?.storey_range}</p>
                                <p className="transactionDetails">{'Year of Built: ' + data?.lease_commence_date}</p>
                                <p className="transactionDetails">{'Tenure during sale (years): ' + data?.remaining_lease}</p>
                                <p className="transactionDetails">{'Transaction Date (Month/Year): ' + data?.month + '/' + data?.year}</p>
                            </Carousel.Item>
                        })}
                    </Carousel>
                </div>
            </GoogleMap> }
        </div>
    )
}
export default Map;