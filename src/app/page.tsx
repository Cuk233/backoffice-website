import { redirect } from 'next/navigation';

export default function Home() {
  // Server-side redirect
  redirect('/login');
  
  // This part will never be rendered, but we include it for type safety
  return null;
}
