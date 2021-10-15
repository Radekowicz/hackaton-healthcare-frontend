//<a href='https://dryicons.com/free-icons/medical'> Icon by Dryicons </a>
import React, {useState} from 'react'
import ReactMapGL, {GeolocateControl, Marker} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as config from "./config";
import {Wroclaw} from "./data/Wroclaw";
import {makeStyles} from "@material-ui/core";

const TOKEN = config.TOKEN;

const useStyles = makeStyles(() => ({
    markerButton: {
        background: "none",
        border: "none",
        cursor: "pointer"
    },
    svgButton: {
        width: '20px',
        height: '20px',
    }
}));

const geolocateStyle = {
    float: 'left',
    margin: '50px',
    padding: '10px'
}
export default function Map() {

    const classes = useStyles();

    const [viewport, setViewPort] = useState({
        width: "100wh",
        height: '100vh',
        latitude: 0,
        longitude: 0,
        zoom: 2
    })

    const _onViewportChange = viewport => setViewPort({...viewport, transitionDuration: 3000})

    return (

        <div style={{margin: '0 auto'}}>
            <h1 style={{textAlign: 'center', fontSize: '25px', fontWeight: 'bolder'}}>GeoLocator: Click the Geolocator
                to Find Your Location</h1>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={TOKEN}
                onViewportChange={_onViewportChange}
            >
                {
                    Wroclaw.map(sor => (
                        <Marker key={sor.ID} longitude={sor.geometry.coordinates[1]}
                                latitude={sor.geometry.coordinates[0]}>
                            <button className={classes.markerButton}>
                                <img className={classes.svgButton} src="/medicine.svg" alt="SOR"/>
                            </button>
                        </Marker>
                    ))
                }
                <GeolocateControl
                    style={geolocateStyle}
                    positionOptions={{enableHighAccuracy: true}}
                    trackUserLocation={true}
                />
            </ReactMapGL>
        </div>
    )
}

