'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useEventContext } from './EventsProvider';
import NewEventModal from './NewEventModal';
import EventMarkers from './EventMarkers';

const MapSearch = dynamic(() => import('./MapSearch'), { ssr: false });
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

interface MapProps {
    user: any;
}

export default function Map({ user }: MapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const { events, setEvents } = useEventContext();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    // Fallback to a default location if geolocation fails
                    setPosition([0, 0]);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setPosition([0, 0]); // Default to Las Vegas
        }
    }, []);

    return (
        <MapContainer
            center={position as [number, number]}
            zoom={14}
            style={{ height: '100vh', width: '100%' }}
            className='z-0'
        >
            <TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapSearch />
            <NewEventModal
                user={user}
                events={events}
                setEvents={setEvents}
            />
            <EventMarkers
                user={user}
                position={position}
                events={events}
                setEvents={setEvents}
            />
        </MapContainer>
    );
}
