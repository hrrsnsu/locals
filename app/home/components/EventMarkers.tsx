'use client';
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import dynamic from 'next/dynamic';
const CustomMarker = dynamic(() => import('./CustomMarker'), { ssr: false });

interface IEventMarker {
    user: any;
    position: [number, number] | null;
    events?: any[];
    setEvents: any;
}


export default function EventMarkers({ position, events, setEvents }: IEventMarker) {
    useEffect(() => {
        const fetchEvents = async () => {
            if (position) {
                const supabase = createClient();

                const deltaLon =
                    3.5 / (111.32 * Math.cos(position[0] * (Math.PI / 180)));
                const deltaLat = 3.5 / 111.32;

                const minLat = position[0] - deltaLat;
                const maxLat = position[0] + deltaLat;
                const minLon = position[1] - deltaLon;
                const maxLon = position[1] + deltaLon;

                const { data, error } = await supabase
                    .from('events')
                    .select()
                    .gte('lat', minLat)
                    .lte('lat', maxLat)
                    .gte('lng', minLon)
                    .lte('lng', maxLon);

                if (error) {
                    console.error(error);
                    return;
                }
                setEvents(data);
                console.log(data);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            {events?.map((event: any) => {
                return (
                    <CustomMarker
                        key={event.id}
                        event={event}
                    />
                );
            })}
        </div>
    );
}