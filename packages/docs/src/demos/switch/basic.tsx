import { Switch } from '@manti-ui/react';

export default function SwitchBasic() {
  return (
    <>
      <Switch defaultChecked>Wi-Fi</Switch>
      <Switch>Bluetooth</Switch>
      <Switch disabled>Airplane mode</Switch>
    </>
  );
}
