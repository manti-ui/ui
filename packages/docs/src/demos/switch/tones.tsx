import { Switch } from '@manti-ui/react';

const tones = ['primary', 'success', 'warning', 'danger', 'info'] as const;

export default function SwitchTones() {
  return (
    <>
      {tones.map((tone) => (
        <Switch key={tone} tone={tone} defaultChecked>
          {tone}
        </Switch>
      ))}
    </>
  );
}
