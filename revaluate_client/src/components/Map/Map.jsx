import React, { useState } from "react";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

function Map(){
    const { isLoaded } = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY});

    const [center, updateCenter] = useState({lat: 1.43, lng: 103.78});
    const [town, updateTown] = useState('Neighbourhood');
    const [selectedPin, updateSelectedPin] = useState();

    const transactionData = [
        {
            neighbourhood: 'Woodlands',
            lat: 1.43,
            lng: 103.78,
        },
        {
            neighbourhood: 'Sembawang',
            lat: 1.43,
            lng: 103.779,
        },
        {
            neighbourhood: 'Jurong East',
            lat: 1.43,
            lng: 103.781,
        },
        {
            neighbourhood: 'Tampines',
            lat: 1.431,
            lng: 103.78,
        },
        {
            neighbourhood: 'Orchard',
            lat: 1.431,
            lng: 103.781,
        },
    ];

    return(
        <div>
            { isLoaded &&
            <GoogleMap
                mapContainerStyle={{
                    height: '80vh',
                    width: '80vw',
                    margin: 'auto',
                    borderRadius: 10,
                }}
                center={center}
                zoom={17}
            >
                {transactionData.map((data, idx) =>
                <MarkerF
                    key={idx}
                    onClick={() => updateSelectedPin(idx)}
                    position={{lat: data.lat, lng: data.lng}}
                ></MarkerF>)}
            </GoogleMap> }
        </div>
    )
}
export default Map;