import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBSr4CMX520FqsGWTQvBAcna3wXdQqe2A8',
    });

    const neighbourhoodData = [
        {
            neighbourhood: 'Woodlands',
            lat: 1.43,
            lng: 103.78,
        },
        {
            neighbourhood: 'Sembawang',
            lat: 1.44,
            lng: 103.81,
        },
        {
            neighbourhood: 'Jurong East',
            lat: 1.33,
            lng: 103.72,
        },
        {
            neighbourhood: 'Tampines',
            lat: 1.34,
            lng: 103.95,
        },
        {
            neighbourhood: 'Orchard',
            lat: 1.30,
            lng: 103.81,
        },
    ];

    const [center, updateCenter] = useState({
        lat: 1.35,
        lng: 103.81,
    });
    const [town, updateTown] = useState('Neighbourhood');


    return (<div>
        <Dropdown>
            <Dropdown.Toggle variant="">{town}</Dropdown.Toggle>
            <Dropdown.Menu>
                { neighbourhoodData.map((item, id) =>
                    <Dropdown.Item key={id} onClick={() => {
                        updateCenter({
                            lat: item.lat,
                            lng: item.lng,
                        });
                        updateTown(item.neighbourhood);
                    }}>{item.neighbourhood}</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>

        { isLoaded && <GoogleMap
            mapContainerStyle={{
                height: '80vh',
                width: '80vw',
                margin: 'auto',
                borderRadius: 10,
            }}
            center={center}
            zoom={town==='Neighbourhood' ? 12 : 14}
        >
            <Marker position={center}></Marker>
        </GoogleMap> }
    </div>)
}

export default Home;