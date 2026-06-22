import { Editable } from '@manti-ui/react';

export default function EditableBasic() {
  return (
    <Editable
      label="Recipe name"
      tone="primary"
      defaultValue="Kayseri mantısı"
      placeholder="Enter a name…"
      activationMode="focus"
      submitMode="both"
    />
  );
}
