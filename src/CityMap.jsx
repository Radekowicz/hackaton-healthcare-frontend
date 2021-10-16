import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React, {useRef, useState} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {GeoJsonLayer} from 'deck.gl';
import Geocoder from 'react-map-gl-geocoder';
import * as config from './config';
import {data} from "./data";
import {makeStyles, Typography} from "@material-ui/core";
import PhoneIcon from '@material-ui/icons/LocalPhone';
import BusinessIcon from '@material-ui/icons/Business';
import Divider from '@material-ui/core/Divider';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const token = config.TOKEN;

const useStyles = makeStyles(() => ({
    markerButton: {
        background: "none",
        border: "none",
        cursor: "pointer"
    },
    svgButton: {
        width: '40px',
        height: '40px',
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
    const times = ['1,5 h temu', '1 h temu', '0,5 h temu', 'teraz'];

    const handleOnResult = (event) => {
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
        return await fetch(`http://localhost:3000/api/v1/data/${sor.ID}`, {
            method: 'GET',
            mode: 'cors',
        });
    }

    const closePopUp = () => {
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
                            <button className={classes.markerButton} onClick={async (e) => {
                                e.preventDefault();
                                await readInfoFromSOR(sor).then(response => {
                                    response.json().then(p => {
                                        sor.patients = p.data.data[3].queueLength;
                                        sor.estimatedTime = p.data.data[3].expectedWaitTime;
                                        sor.halfHour = p.data.data[2].queueLength;
                                        sor.hour = p.data.data[1].queueLength;
                                        sor.oneAndHalf = p.data.data[0].queueLength;
                                        sor.queueLengths = [p.data.data[3].queueLength, p.data.data[2].queueLength, p.data.data[1].queueLength, p.data.data[0].queueLength  ]
                                        setSelectedSOR(sor);
                                    })
                                })
                            }}>
                                <img className={classes.svgButton} src="/medicine.svg" alt="SOR"/>
                            </button>
                        </Marker>
                    ))
                }
                {selectedSOR ? (
                    <Popup
                        latitude={selectedSOR.coordinates[0]}
                        longitude={selectedSOR.coordinates[1]}
                        closeOnClick={true}
                        onClose={closePopUp}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                justifyContent: 'center',
                                padding: 20,
                            }}
                        >
                            <Typography variant="h5" style={{ marginBottom: 30 }}>
                                {selectedSOR.name}
                            </Typography>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 10,
                                }}
                            >
                                <PhoneIcon style={{ marginRight: 10 }} />
                                <Typography variant="h7">{selectedSOR.phone}</Typography>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: 10,
                                    marginBottom: 30,
                                }}
                            >
                                <BusinessIcon style={{ marginRight: 10 }} />
                                <Typography>{selectedSOR.address}</Typography>
                            </div>
                            <div
                                style={{
                                    margin: 10,
                                    marginBottom: 30,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography>Przewidywany czas oczekiwania: </Typography>
                                <Typography style={{ fontWeight: 600, marginLeft: 10 }}>
                                    {`${selectedSOR.estimatedTime} minut`}
                                </Typography>
                            </div>
                            <Typography style={{ margin: 10 }}>
                                Liczba pacjentów czekających na SOR:
                            </Typography>

                            <div
                                style={{ display: 'flex', flexDirection: 'row', margin: 10 }}
                            >
                                {selectedSOR.queueLengths.map((label, index) =>
                                    index === selectedSOR.queueLengths.length - 1 ? (
                                        <div
                                            style={{
                                                margin: 5,
                                                display: 'flex',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <div>
                                                <Typography variant="h5">{label}</Typography>
                                                <Typography style={{ color: 'grey' }}>
                                                    {times[index]}
                                                </Typography>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                margin: 5,
                                                display: 'flex',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <div>
                                                <Typography variant="h5">{label}</Typography>
                                                <Typography style={{ color: 'grey' }}>
                                                    {times[index]}
                                                </Typography>
                                            </div>
                                            <ArrowRightAltIcon />
                                        </div>
                                    )
                                )}
                            </div>
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
