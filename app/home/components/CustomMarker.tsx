'use client';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet'
import dynamic from 'next/dynamic';
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
    ssr: false,
});

interface CustomMarkerProps {
    event: any;
}

const customIcon = new L.Icon({
    iconUrl: '/map-pin.svg', // or 'https://example.com/pin.svg'
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const CustomMarker = ({event} : CustomMarkerProps) => {
    return (
        <div>
            <Marker position={[event.lat, event.lng]} icon={customIcon}>
                <Popup>
                    <h1>{event.name}</h1>
                    <p>{event.desc}</p>
                </Popup>
            </Marker>
        </div>
    );
}

export default CustomMarker;




