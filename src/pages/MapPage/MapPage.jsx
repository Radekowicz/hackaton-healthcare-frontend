import React from 'react';
import useStyles from './MapPage.styles';
import SearchBar from '../../components/SearchBar/SearchBar';
import Map from '../../components/Map/Map';

export default function MapPage(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SearchBar />
      <Map />
    </div>
  );
}
