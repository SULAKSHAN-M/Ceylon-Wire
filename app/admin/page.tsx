import { cookies } from 'next/headers';
import { ADMIN_COOKIE,adminConfigured,validSession } from '@/lib/admin-auth';
import { AdminPanel } from '@/components/AdminPanel';
export const metadata={title:'Editorial dashboard',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function AdminPage(){const token=(await cookies()).get(ADMIN_COOKIE)?.value;return <main id="main-content" className="mx-auto max-w-read px-5 py-12"><h1 className="font-display text-3xl font-semibold">Editorial dashboard</h1><AdminPanel authenticated={validSession(token)} configured={adminConfigured()}/></main>;}
