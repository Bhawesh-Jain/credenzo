import { validateSession } from '@/lib/session';
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await validateSession();
  if (session.isLoggedIn) {
    redirect('/dashboard')
  } else
    redirect('/login')
}
