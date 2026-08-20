import { useMemo } from 'react';
import { Button, createToaster } from '@manti-ui/react';

export default function ToastBasic() {
  const { toaster, Toaster } = useMemo(() => createToaster(), []);

  return (
    <div className="toast-actions">
      <Button
        onClick={() =>
          toaster.create({
            title: 'Mantı boiling',
            description: 'They float when they are ready — about four minutes.',
          })
        }
      >
        Default
      </Button>
      <Button
        variant="success"
        onClick={() =>
          toaster.success({
            title: 'Saved',
            description: 'Your recipe is in the cookbook.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toaster.error({
            title: 'Dough too dry',
            description: 'Add a splash of water and knead again.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="info"
        onClick={() =>
          toaster.info({ title: 'Tip', description: 'Rest the dough first.' })
        }
      >
        Info
      </Button>
      <Toaster />
    </div>
  );
}
