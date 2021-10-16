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
        width: '30px',
        height: '30px',
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

    async function readInfoFromSOR(sor) {
        const responseSOR = await fetch("https://api.example.com/items")
        return responseSOR;
    }

    const closePopUp = () =>{
        setSelectedSOR(null);
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
                mapStyle="mapbox://styles/mapbox/light-v10"
                width="100%"
                height="90%"
                onViewportChange={setViewPort}
                mapboxApiAccessToken={token}
            >
                {
                    data.map(sor => (
                        <Marker key={sor.ID} longitude={sor.coordinates[1]}
                                latitude={sor.coordinates[0]}>
                            <button className={classes.markerButton} onClick={(e) => {
                                e.preventDefault();
                                /*       readInfoFromSOR(sor).then(response => {
                                           //sor.patients =
                                           //sor.estimatedTime =

                                       })*/
                                setSelectedSOR(sor);

                            }}>
                                <img className={classes.svgButton} src="/medicine.svg" alt="SOR"/>
                            </button>
                        </Marker>
                    ))
                }
                {selectedSOR ? (
                    <Popup latitude={selectedSOR.coordinates[0]}
                           longitude={selectedSOR.coordinates[1]}
                           closeOnClick={true}
                           onClose={closePopUp}>
                        <div>
                            <h5>{selectedSOR.name}</h5>
                            <h6>Numer telefonu: {selectedSOR.phone}</h6>
                            <h6>Aktaulna liczba pacjentów czekających na SOR: </h6>
                            <h6>Przewidywany czas ocziekiwania: </h6>
                            <h6>Historia liczby pacjentów w punkcie SOR: </h6>
                            <ul>
                                <li><h6>0,5h temu: </h6></li>
                                <li><h6>1h temu: </h6></li>
                                <li><h6>1,5h temu: </h6></li>
                            </ul>

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
