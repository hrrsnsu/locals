'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

interface IEventProviderValue {
    events: any[];
    setEvents: Dispatch<SetStateAction<any>>;
}

export const EventContext = React.createContext({} as IEventProviderValue);

export const useEventContext = () => React.useContext(EventContext);

export const EventsProvider = (props: any) => {
    const [events, setEvents] = useState([]);

    return (
        <EventContext.Provider value={{ events, setEvents }}>
            {props.children}
        </EventContext.Provider>
    );
};

export default EventsProvider;
