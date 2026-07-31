import { AuthPage } from '@/components/auth';

export const metadata = { title: 'Mot de passe oublié' };

export default function Forgot() {
  return <AuthPage mode="forgot" />;
}