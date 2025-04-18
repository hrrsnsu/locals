'use client';

import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/assets/css/leaflet.css';
import { useEffect } from 'react';


const MapSearch = () => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider: provider,
            showMarker: false,
            retainZoomLevel: false, // Allow zoom level to change
            zoomLevel: 14
        });
          

        map.addControl(searchControl);
        return () => {
            map.removeControl(searchControl);
        };
    }, []);

    return null;
};

export default MapSearch;
