import { useState } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapsible,
  createToaster,
  Dialog,
  HoverCard,
  mantiUi,
  Menu,
  Popover,
  RadioGroup,
  Spinner,
  Switch,
  Tabs,
  TextField,
  Toggle,
  Tooltip,
} from '@manti-ui/react';

const InfoIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 11v5M12 7.5v.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
    <circle
      cx="11"
      cy="11"
      r="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="m20 20-3.5-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const tabIconProps = {
  viewBox: '0 0 24 24',
  width: 16,
  height: 16,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const DoughIcon = (
  <svg {...tabIconProps}>
    <circle cx="12" cy="12" r="7.5" />
  </svg>
);

const FillingIcon = (
  <svg {...tabIconProps}>
    <rect x="5" y="5" width="14" height="14" rx="3.5" />
  </svg>
);

const SauceIcon = (
  <svg {...tabIconProps} strokeLinecap="round">
    <path d="M12 3c4 5 6 7.6 6 10a6 6 0 1 1-12 0c0-2.4 2-5 6-10Z" />
  </svg>
);

const { toaster, Toaster } = createToaster({ placement: 'bottom-end' });

type MotionTier = 'none' | 'default' | 'full';

// Storybook ships alongside the playground build at `/storybook/`. In dev it runs
// on its own server (`pnpm storybook`), so point there instead.
const STORYBOOK_URL = import.meta.env.DEV
  ? 'http://localhost:6006'
  : '/storybook/';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [motion, setMotion] = useState<MotionTier>('default');

  return (
    <div className="manti-app" data-theme={theme} data-motion={motion}>
      <main className="page">
        <header className="page__header">
          <div className="page__intro">
            <p className="page__eyebrow">Integration playground</p>
            <h1 className="page__title">{mantiUi.name}</h1>
            <p className="page__lede">
              A framework-agnostic design system with smooth colors, smooth
              transitions, and smooth components.
            </p>
          </div>
          <div className="page__controls">
            <a className="page__storybook-link" href={STORYBOOK_URL}>
              Storybook
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <div className="page__settings">
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) =>
                  setTheme(checked ? 'dark' : 'light')
                }
              >
                Dark theme
              </Switch>
              <RadioGroup
                label="Motion"
                orientation="horizontal"
                value={motion}
                onValueChange={(value) => setMotion(value as MotionTier)}
                items={[
                  { value: 'none', label: 'None' },
                  { value: 'default', label: 'Default' },
                  { value: 'full', label: 'Full' },
                ]}
              />
            </div>
          </div>
        </header>

        <Card elevated className="spotlight">
          <Card.Body>
            <div className="spotlight__workspace">
              <Badge tone="primary" variant="soft" dot>
                Beverly Hills Dental
              </Badge>
            </div>
            <TextField
              aria-label="Search"
              placeholder="Search"
              leadingAddon={SearchIcon}
              trailingAddon={<kbd className="spotlight__kbd">/</kbd>}
              fullWidth
            />
            <p className="spotlight__label">Workspace</p>
            <nav className="spotlight__menu">
              <a className="spotlight__row" data-active aria-current="page">
                <span className="spotlight__dot" /> Dashboard
              </a>
              <a className="spotlight__row">
                <span className="spotlight__dot" /> Patients
              </a>
              <a className="spotlight__row">
                <span className="spotlight__dot" /> Appointments
              </a>
            </nav>
          </Card.Body>
        </Card>

        <div className="grid">
          <Card>
            <Card.Header>
              <Card.Title>Buttons</Card.Title>
              <Card.Description>
                Four variants across every tone.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="cluster">
                <Button trailingIcon={ArrowIcon}>Order Mantı</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button tone="primary">Primary</Button>
                <Button tone="success">Success</Button>
                <Button tone="danger" variant="soft">
                  Danger
                </Button>
                <Button loading>Loading</Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Selection</Card.Title>
              <Card.Description>
                Switches, checkboxes, and toggles.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <Switch defaultChecked>Garlic yogurt</Switch>
                <Checkbox defaultChecked>Extra sumac</Checkbox>
                <Checkbox indeterminate>Mixed fillings</Checkbox>
                <div className="cluster">
                  <Toggle defaultPressed>Spicy</Toggle>
                  <Toggle tone="success">Vegetarian</Toggle>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Form</Card.Title>
              <Card.Description>
                Labels, hints, and validation.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <TextField
                  label="Recipe name"
                  placeholder="Kayseri mantısı"
                  hint="Visible in the shared cookbook."
                  fullWidth
                />
                <TextField
                  label="Servings"
                  defaultValue="0"
                  error="Add at least one serving."
                  fullWidth
                />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Feedback</Card.Title>
              <Card.Description>Badges, alerts, and spinners.</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <div className="cluster">
                  <Badge tone="success" dot>
                    Fresh
                  </Badge>
                  <Badge tone="warning" variant="solid">
                    Resting
                  </Badge>
                  <Badge tone="info" variant="outline">
                    Steamed
                  </Badge>
                </div>
                <Alert tone="info" title="Dough is resting" icon={InfoIcon}>
                  Give it 30 minutes before you start rolling.
                </Alert>
                <div className="cluster">
                  <Spinner />
                  <span style={{ color: 'var(--manti-text-muted)' }}>
                    Simmering…
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Navigation</Card.Title>
              <Card.Description>Tabs and disclosures.</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <Tabs
                  variant="pill"
                  items={[
                    {
                      value: 'dough',
                      label: 'Dough',
                      icon: DoughIcon,
                      content: 'Flour, egg, water, salt.',
                    },
                    {
                      value: 'filling',
                      label: 'Filling',
                      icon: FillingIcon,
                      content: 'Beef or lamb, onion, spice.',
                    },
                    {
                      value: 'sauce',
                      label: 'Sauce',
                      icon: SauceIcon,
                      content: 'Garlic yogurt, paprika butter.',
                    },
                  ]}
                />
                <Tabs
                  variant="soft"
                  items={[
                    {
                      value: 'dough',
                      label: 'Dough',
                      icon: DoughIcon,
                      content: 'Flour, egg, water, salt.',
                    },
                    {
                      value: 'filling',
                      label: 'Filling',
                      icon: FillingIcon,
                      content: 'Beef or lamb, onion, spice.',
                    },
                    {
                      value: 'sauce',
                      label: 'Sauce',
                      icon: SauceIcon,
                      content: 'Garlic yogurt, paprika butter.',
                    },
                  ]}
                />
                <Tabs
                  variant="line"
                  items={[
                    {
                      value: 'boiled',
                      label: 'Boiled',
                      content: 'The classic — simmered until they float.',
                    },
                    {
                      value: 'steamed',
                      label: 'Steamed',
                      content: 'Gentler, with a silkier wrapper.',
                    },
                    {
                      value: 'fried',
                      label: 'Fried',
                      content: 'Crisp edges, for leftovers.',
                    },
                  ]}
                />
                <Accordion
                  items={[
                    {
                      value: 'shape',
                      title: 'How small should they be?',
                      content:
                        'Traditionally tiny — many fit on a single spoon.',
                    },
                    {
                      value: 'serve',
                      title: 'What goes on top?',
                      content:
                        'Garlic yogurt, melted chili butter, dried mint, sumac.',
                    },
                  ]}
                />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Choice</Card.Title>
              <Card.Description>Radio group and tooltip.</Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <RadioGroup
                  label="Cooking method"
                  defaultValue="boiled"
                  items={[
                    { value: 'boiled', label: 'Boiled' },
                    { value: 'steamed', label: 'Steamed' },
                    { value: 'fried', label: 'Fried' },
                  ]}
                />
                <Collapsible trigger="Show chef's note">
                  <p
                    style={{
                      padding: '12px 4px 0',
                      color: 'var(--manti-text-muted)',
                    }}
                  >
                    Rest the dough for 30 minutes for a smoother roll.
                  </p>
                </Collapsible>
                <Tooltip content="Backed by a Zag.js machine">
                  <Button variant="soft" tone="neutral">
                    Hover or focus me
                  </Button>
                </Tooltip>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Overlays</Card.Title>
              <Card.Description>
                Dialog, popover, menu, hover card, and toast.
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <div className="stack">
                <div className="cluster">
                  <Dialog
                    title="Freeze a batch?"
                    description="Raw mantı freeze beautifully — lay them on a floured tray first."
                    trigger={<Button>Open dialog</Button>}
                    footer={
                      <>
                        <Button variant="ghost">Cancel</Button>
                        <Button tone="primary">Freeze them</Button>
                      </>
                    }
                  >
                    They keep for up to three months and cook straight from
                    frozen.
                  </Dialog>
                  <Popover
                    title="Dough resting"
                    trigger={<Button variant="soft">Popover</Button>}
                  >
                    Let the dough rest 30 minutes so it rolls paper-thin without
                    springing back.
                  </Popover>
                  <Menu
                    trigger={<Button variant="outline">Serve as…</Button>}
                    onSelect={(value) =>
                      toaster.info({ title: `Serving: ${value}` })
                    }
                    items={[
                      { value: 'yogurt', label: 'Garlic yogurt', shortcut: '⌘1' },
                      { value: 'butter', label: 'Chili butter', shortcut: '⌘2' },
                      { type: 'separator' },
                      { value: 'plain', label: 'Plain', disabled: true },
                    ]}
                  />
                </div>
                <HoverCard
                  trigger={
                    <a href="https://en.wikipedia.org/wiki/Manti_(food)">
                      What is mantı?
                    </a>
                  }
                >
                  <strong>Mantı</strong> — tiny Turkish dumplings under garlicky
                  yogurt and chili butter.
                </HoverCard>
                <div className="cluster">
                  <Button
                    onClick={() =>
                      toaster.success({
                        title: 'Saved',
                        description: 'Your recipe is in the cookbook.',
                      })
                    }
                  >
                    Toast: success
                  </Button>
                  <Button
                    tone="danger"
                    variant="soft"
                    onClick={() =>
                      toaster.error({ title: 'Dough too dry' })
                    }
                  >
                    Toast: error
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <footer className="page__footer">
          <code>{mantiUi.packageName}</code> · powered by{' '}
          {mantiUi.behaviorFoundation}
        </footer>
      </main>
      <Toaster />
    </div>
  );
}
