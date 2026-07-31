import { ToastProvider } from '@/components/ui';
import ShopWizard from '@/components/dash/ShopWizard';

export const metadata = { title: 'Créer une boutique' };

export default function NewShop() {
  return (
    <ToastProvider>
      <ShopWizard />
    </ToastProvider>
  );
}