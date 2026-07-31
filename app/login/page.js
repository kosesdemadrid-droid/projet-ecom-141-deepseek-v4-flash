import { Suspense } from 'react';
import { AuthPage } from '@/components/auth';

export const metadata = { title: 'Connexion' };

export default function Login() {
  return (
    <Suspense fallback={null}>
      <AuthPage mode="login" />
    </Suspense>
  );
}