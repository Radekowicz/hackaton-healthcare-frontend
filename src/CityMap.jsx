import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, {useRef, useState} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {GeoJsonLayer} from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';
import * as config from './config';
import {data} from "./data";
import {makeStyles} from "@material-ui/core";

const token = config.TOKEN;

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

const SearchableMap = () => {
    const [viewport, setViewPort] = useState({
        latitude: 52.1246099075455,
        longitude: 19.30063630556,
        zoom: 6.3,
        transitionDuration: 100,
    });
    const [selectedSOR, setSelectedSOR] = useState(null);
    const [searchResultLayer, setSearchResult] = useState(null);
    const classes = useStyles();
    const mapRef = useRef();

    const handleOnResult = (event) => {
        console.log(event.result);
        setSearchResult(
            new GeoJsonLayer({
                id: 'search-result',
                data: event.result.geometry,
                getFillColor: [255, 0, 0, 128],
                getRadius: 1000,
                pointRadiusMinPixels: 10,
                pointRadiusMaxPixels: 10,
            })
        );
    };

    const handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = {transitionDuration: 1000};
        console.log('Updating');

        return setViewPort({
            ...viewport,
            ...geocoderDefaultOverrides,
        });
    };

    const readInfoFromSOR = () => {
        fetch("https://api.example.com/items")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    return (
        <div style={{height: '100vh'}}>
            <h1
                style={{textAlign: 'center', fontSize: '25px', fontWeight: 'bolder'}}
            >
                Skorzystaj z wyszukiwarki w celu znalezienia swojego miasta
            </h1>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                width="100%"
                height="90%"
                onViewportChange={setViewPort}
                mapboxApiAccessToken={token}
            >
                {
                    data.map(sor => (
                        <Marker key={sor.ID} longitude={sor.geometry.coordinates[1]}
                                latitude={sor.geometry.coordinates[0]}>
                            <button className={classes.markerButton} onClick={(e) => {
                                e.preventDefault();
                                //sor.patients =
                                //sor.estimatedTime =
                                setSelectedSOR(sor);
                            }}>
                                <img className={classes.svgButton} src="/medicine.svg" alt="SOR"/>
                            </button>
                        </Marker>
                    ))
                }
                {selectedSOR ? (
                    <Popup latitude={selectedSOR.geometry.coordinates[0]}
                           longitude={selectedSOR.geometry.coordinates[1]}>
                        <div>
                            <h5>{selectedSOR.name}</h5>
                            <h6>Numer telefonu: {selectedSOR.phone}</h6>
                            <h6>Aktaulna liczba pacjentów czekających na SOR: </h6>
                            <h6>Przewidywany czas ocziekiwania: </h6>
                        </div>
                    </Popup>
                ) : null}
                <Geocoder
                    mapRef={mapRef}
                    onResult={handleOnResult}
                    onViewportChange={handleGeocoderViewportChange}
                    mapboxApiAccessToken={token}
                    position="top-left"
                    placeholder="Szukaj"
                    countries="PL"
                />
            </ReactMapGL>
        </div>
    );
};

export default SearchableMap;
