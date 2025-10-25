import { DeleteConfirmDialog } from '../DeleteConfirmDialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DeleteConfirmDialogExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Site deleted');
    setIsOpen(false);
  };

  return (
    <div className="p-8 bg-background min-h-[400px] flex items-center justify-center">
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Show Delete Dialog
      </Button>
      <DeleteConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        siteName="my-portfolio.zip"
      />
    </div>
  );
}
