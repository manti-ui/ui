import { Button, Dialog } from '@manti-ui/react';

export default function DialogBasic() {
  return (
    <Dialog
      trigger={<Button tone="primary">Open dialog</Button>}
      title="Freeze a batch?"
      description="Raw mantı freeze beautifully. Lay them on a floured tray, freeze solid, then bag them."
    >
      They keep for up to three months and cook straight from frozen — just add
      a minute to the boil.
    </Dialog>
  );
}
