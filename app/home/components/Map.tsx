'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet/hooks';
import { LeafletMouseEvent, map } from 'leaflet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/utils/supabase/client';
import haversine from '@/utils/formula';
const MapSearch = dynamic(() => import('./MapSearch'), { ssr: false });
const CustomMarker = dynamic(() => import('./CustomMarker'), { ssr: false });
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

interface HandleMapClickProps {
    user: any;
}

function HandleMapClick({ user }: HandleMapClickProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [mapEvent, setMapEvent] = useState<LeafletMouseEvent | null>(null);
    const [eventForm, setEventForm] = useState({
        name: '',
        description: '',
        capacity: '',
        access: '',
    });
    useMapEvents({
        click(e) {
            setIsModalOpen((prev) => !prev);
            setMapEvent(e);
        },
    });

    const handleSubmit = async () => {
        //create the new event here
        if (Object.values(eventForm).every((item) => item)) {
            const supabase = createClient();

            setIsModalOpen((prev) => !prev);

            //add to supabase
            const { error } = await supabase.from('events').insert({
                access: eventForm.access,
                capacity: eventForm.capacity,
                name: eventForm.name,
                desc: eventForm.description,
                owner: user.id,
                lat: mapEvent?.latlng.lat,
                lng: mapEvent?.latlng.lng,
            });
            if (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (!isModalOpen) {
            //reset form
            setEventForm({
                name: '',
                description: '',
                capacity: '',
                access: '',
            });
        }
    }, [isModalOpen]);

    return (
        <div>
            <Dialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            >
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Create a new event!</DialogTitle>
                        <DialogDescription>
                            Create your Locals event and specify capacity and
                            access
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='name'
                                className='text-right'
                            >
                                Event Name
                            </Label>
                            <Input
                                id='name'
                                className='col-span-3'
                                value={eventForm.name}
                                onChange={(e) =>
                                    setEventForm((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='description'
                                className='text-right'
                            >
                                Description
                            </Label>
                            <Textarea
                                id='description'
                                className='col-span-3'
                                value={eventForm.description}
                                onChange={(e) =>
                                    setEventForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='capacity'
                                className='text-right'
                            >
                                Capacity
                            </Label>
                            <Input
                                id='capacity'
                                className='col-span-3'
                                value={eventForm.capacity}
                                onChange={(e) =>
                                    setEventForm((prev) => ({
                                        ...prev,
                                        capacity: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='access'
                                className='text-right'
                            >
                                Access
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setEventForm((prev) => ({
                                        ...prev,
                                        access: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select privacy access' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Access</SelectLabel>
                                        <SelectItem value='public'>
                                            public
                                        </SelectItem>
                                        <SelectItem value='friends'>
                                            friends
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface EventMarkerProps {
    user: any;
    position: [number, number] | null;
}

function EventMarkers({ user, position }: EventMarkerProps) {
    const [events, setEvents] = useState<any>([]);
    useEffect(() => {
        const fetchEvents = async () => {
            //based on the current location (needed as a prop position)
            //calculate the valid area of markers
            //make a supabase call to query all items
            //save it into events
            //
            if (position) {
                const supabase = createClient();
                const { data, error } = await supabase.from('events').select();

                if (error) {
                    console.error(error);
                    return;
                }
                const foundEvents = [];

                for (const event of data) {
                    if (
                        haversine(
                            position[0],
                            position[1],
                            event.lat,
                            event.lng
                        ) < 4
                    ) {
                        foundEvents.push(event);
                    }
                }
                setEvents(foundEvents);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        console.log(events);
    }, [events]);

    return (
        <div>
            {events.map((event: any) => {
                return (
                    <CustomMarker key={event.id} event={event}/>
                );
            })}
        </div>
    );
}

interface MapProps {
    user: any;
}

export default function Map({ user }: MapProps) {
    const [position, setPosition] = useState<[number, number] | null>(null);

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
            <HandleMapClick user={user} />
            <EventMarkers
                user={user}
                position={position}
            />
        </MapContainer>
    );
}
