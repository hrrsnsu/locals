import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
import Map from './components/Map'
export default async function Page() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/login');
    }

    return (
        <SidebarProvider>
            <AppSidebar email={data.user.email} />
            <Map user={data.user}/>
        </SidebarProvider>
    );
}
