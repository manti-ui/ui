import { Button, Dialog } from '@manti-ui/react';

export default function DialogFooter() {
  return (
    <Dialog
      trigger={<Button tone="primary">Freeze a batch</Button>}
      title="Freeze a batch?"
      description="Lay the mantı on a floured tray, freeze them solid, then bag them."
      footer={({ close }) => (
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button tone="primary" onClick={close}>
            Freeze them
          </Button>
        </>
      )}
    >
      They keep for up to three months and cook straight from frozen.
    </Dialog>
  );
}
