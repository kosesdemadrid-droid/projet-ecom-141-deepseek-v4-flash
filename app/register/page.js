import { Suspense } from 'react';
import { AuthPage } from '@/components/auth';

export const metadata = { title: 'Inscription' };

export default function Register() {
  return (
    <Suspense fallback={null}>
      <AuthPage mode="register" />
    </Suspense>
  );
}