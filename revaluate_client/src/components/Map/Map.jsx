import React, { useState } from "react";
import "./Map.css"
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import CloseIcon from '@mui/icons-material/Close';

function Map(){
    const { isLoaded } = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY});

    const [center, updateCenter] = useState({lat: 1.43, lng: 103.78});
    const [town, updateTown] = useState('Neighbourhood');
    const [selectedPin, updateSelectedPin] = useState();
    const [cardVisible, updateCardVisibility] = useState(false);

    function handleMarkerPress(idx) {
        updateSelectedPin(idx);
        updateCardVisibility(true);
    }

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
                zoom={18}
            >
                {transactionData.map((data, idx) =>
                <MarkerF
                    key={idx}
                    onClick={() => handleMarkerPress(idx)}
                    position={{lat: data.lat, lng: data.lng}}
                />)}
                <div className={cardVisible ? "cardVisible" : "cardNotVisible"}>
                    <div className="closeContainer">
                        <CloseIcon className="closeButton" onClick={() => updateCardVisibility(false)} />
                    </div>
                </div>
            </GoogleMap> }
        </div>
    )
}
export default Map;