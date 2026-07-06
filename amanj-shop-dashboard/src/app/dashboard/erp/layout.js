import ErpLayoutClient from '@/components/erp/ErpLayoutClient';
import { ErpProvider } from '@/context/ErpContext';

export default function ErpLayout({ children }) {
  return (
    <ErpProvider>
      <ErpLayoutClient>{children}</ErpLayoutClient>
    </ErpProvider>
  );
}
