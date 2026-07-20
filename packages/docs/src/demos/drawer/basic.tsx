import { Button, Drawer, Input } from '@manti-ui/react';

export default function DrawerBasic() {
  return (
    <Drawer
      trigger={<Button variant="primary">Edit recipe</Button>}
      title="Edit recipe"
      description="Adjust the filling and the finish, then save."
      footer={({ close }) => (
        <>
          <Button variant="tertiary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={close}>
            Save
          </Button>
        </>
      )}
    >
      <div style={{ display: 'grid', gap: 'var(--manti-space-4)' }}>
        <Input label="Name" defaultValue="Kayseri mantı" fullWidth />
        <Input label="Filling" defaultValue="Spiced lamb" fullWidth />
        <Input
          label="Finish"
          defaultValue="Garlic yogurt, mint butter"
          fullWidth
        />
      </div>
    </Drawer>
  );
}
