'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Contact, User, Ticket, Settings } from 'lucide-react';
const items = [
    {
        title: 'Profile',
        url: '/profile',
        icon: User,
    },
    {
        title: 'Events',
        url: '/',
        icon: Ticket,
    },
    {
        title: 'Friends',
        url: '/',
        icon: Contact,
    },
    {
        title: 'Settings',
        url: '/',
        icon: Settings,
    },
];

interface UserData {
    email?: string;
}

export function AppSidebar({ email }: UserData) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarHeader>Welcome {email}</SidebarHeader>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
