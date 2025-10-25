import { SuccessModal } from '../SuccessModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SuccessModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 bg-background min-h-[400px] flex items-center justify-center">
      <Button onClick={() => setIsOpen(true)}>
        Show Success Modal
      </Button>
      <SuccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        siteUrl="https://meryhost.com/site/abc123"
        siteId="abc123"
      />
    </div>
  );
}
