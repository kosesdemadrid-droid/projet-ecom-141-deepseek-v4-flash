import { Suspense } from 'react';
import { AuthPage } from '@/components/auth';

export const metadata = { title: 'Réinitialisation' };

export default function Reset() {
  return (
    <Suspense fallback={null}>
      <AuthPage mode="reset" />
    </Suspense>
  );
}