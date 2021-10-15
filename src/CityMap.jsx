import React,{ useState } from 'react'
import MapGL, {GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as config from "./config";

const TOKEN=config.TOKEN;

const geolocateStyle = {
    float: 'left',
    margin: '50px',
    padding: '10px'
};

const Map = () => {

    const [viewport, setViewPort ] = useState({
        width: "100whs",
        height: '100vh',
        latitude: 0,
        longitude: 0,
        zoom: 2
    })

    const _onViewportChange = viewport => setViewPort({...viewport, transitionDuration: 3000 })

    return (
        <div style={{ margin: '0 auto'}}>
            <h1 style={{textAlign: 'center', fontSize: '25px', fontWeight: 'bolder' }}>GeoLocator: Click the Geolocator to Find Your Location</h1>

            <MapGL
                {...viewport}
                mapboxApiAccessToken={TOKEN}
                mapStyle="mapbox://styles/mapbox/dark-v8"
                onViewportChange={_onViewportChange}
            >
                <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{enableHighAccuracy: true}}
                    trackUserLocation={true}
                />
            </MapGL>
        </div>
    )
}

export default Map