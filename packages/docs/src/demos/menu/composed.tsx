import { Badge, Button, Menu } from '@manti-ui/react';

export default function MenuComposed() {
  return (
    <Menu>
      <Menu.Trigger>
        <Button variant="tertiary">Serve as…</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>Toppings</Menu.GroupLabel>
          <Menu.Item value="yogurt" shortcut="⌘1">
            Garlic yogurt
          </Menu.Item>
          <Menu.Item value="butter" shortcut="⌘2">
            Chili butter
          </Menu.Item>
          <Menu.Item value="mint">
            <Menu.ItemText>Dried mint</Menu.ItemText>
            <Badge variant="success">New</Badge>
          </Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Item value="plain" disabled>
          Plain
        </Menu.Item>
        <Menu.Item value="return" tone="danger" shortcut="⌫">
          Send it back
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
