import { Input } from '@manti-ui/react';

export default function InputBasic() {
  return (
    <div className="input-field">
      <Input
        label="Recipe name"
        placeholder="Kayseri mantısı"
        hint="Shown to everyone browsing the cookbook."
      />
    </div>
  );
}
