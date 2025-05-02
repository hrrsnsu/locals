'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';

import { LeafletMouseEvent } from 'leaflet';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet/hooks';

interface INewEventModal {
    user: any;
    events: any[];
    setEvents: Dispatch<SetStateAction<any>>;
}

export default function NewEventModal({
    user,
    events,
    setEvents,
}: INewEventModal) {
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
            setEvents([
                ...events,
                {
                    name: eventForm.name,
                    desc: eventForm.description,
                    lat: mapEvent?.latlng.lat,
                    lng: mapEvent?.latlng.lng,
                    owner: user.id,
                },
            ]);
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
