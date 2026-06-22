import { Button, Drawer, TextField } from '@manti-ui/react';

export default function DrawerBasic() {
  return (
    <Drawer
      trigger={<Button tone="primary">Edit recipe</Button>}
      title="Edit recipe"
      description="Adjust the filling and the finish, then save."
      footer={({ close }) => (
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button tone="primary" onClick={close}>
            Save
          </Button>
        </>
      )}
    >
      <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
        <TextField label="Name" defaultValue="Kayseri mantı" fullWidth />
        <TextField label="Filling" defaultValue="Spiced lamb" fullWidth />
        <TextField
          label="Finish"
          defaultValue="Garlic yogurt, mint butter"
          fullWidth
        />
      </div>
    </Drawer>
  );
}
