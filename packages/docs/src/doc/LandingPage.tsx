import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Progress,
  Switch,
  Tabs,
  Tooltip,
} from '@manti-ui/react';
import type { MantiBuiltinVariant, MantiRadiusMode } from '@manti-ui/tokens';

import { MANTI_VERSION } from '../data/navigation';
import { ReactIcon, SolidIcon, SvelteIcon, VueIcon } from './framework-icons';
import { LinkButton } from './LinkButton';

type PreviewTheme = Extract<
  MantiBuiltinVariant,
  'primary' | 'info' | 'success'
>;

const themeOptions: Array<{ value: PreviewTheme; label: string }> = [
  { value: 'primary', label: 'Ember' },
  { value: 'info', label: 'Lake' },
  { value: 'success', label: 'Moss' },
];

const radiusOptions: Array<{ value: MantiRadiusMode; label: string }> = [
  { value: 'none', label: 'Square' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'default', label: 'Default' },
  { value: 'round', label: 'Round' },
];

const teamMembers = [
  {
    username: 'tutkuofnight',
    avatar: 'https://avatars.githubusercontent.com/u/72797914?v=4',
    initials: 'TU',
  },
  {
    username: 'usirin',
    avatar: 'https://avatars.githubusercontent.com/u/1783869?v=4',
    initials: 'US',
  },
  {
    username: 'cansirin',
    avatar: 'https://avatars.githubusercontent.com/u/8138047?v=4',
    initials: 'CS',
  },
  {
    username: 'tuna4ll',
    avatar: 'https://avatars.githubusercontent.com/u/66411462?v=4',
    initials: 'TK',
  },
] as const;

function FrameworkSupport() {
  const upcoming = [
    { name: 'Vue', icon: VueIcon },
    { name: 'Svelte', icon: SvelteIcon },
    { name: 'Solid', icon: SolidIcon },
  ];

  return (
    <div className="docs-frameworks" aria-label="Framework support">
      <ul aria-label="Framework support">
        <li className="docs-framework-icon docs-framework-icon-react">
          <span aria-hidden="true">{ReactIcon}</span>
          <span className="docs-visually-hidden">React — available now</span>
        </li>
        {upcoming.map((framework) => (
          <li key={framework.name}>
            <Tooltip content="Coming soon" placement="bottom">
              <span
                className="docs-framework-icon docs-framework-icon-upcoming"
                aria-label={`${framework.name} — coming soon`}
                tabIndex={0}
              >
                {framework.icon}
              </span>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductPreview({
  theme = 'primary',
  radius,
  compact = false,
}: {
  theme?: PreviewTheme;
  radius?: MantiRadiusMode;
  compact?: boolean;
}) {
  return (
    <div
      className="docs-product-preview"
      data-variant={theme}
      data-radius={radius}
      data-compact={compact || undefined}
    >
      <div className="docs-preview-toolbar">
        <span className="docs-preview-mark">
          <img src="/manti-white.svg" alt="" width="28" height="28" />
          <span>Fold</span>
        </span>
        <Badge variant={theme} dot>
          Live
        </Badge>
      </div>

      <div className="docs-preview-heading">
        <div>
          <span className="docs-eyebrow">Workspace</span>
          <strong>Good morning, Tutku.</strong>
        </div>
        <Button size="sm" variant={theme}>
          New task
        </Button>
      </div>

      <Tabs
        size="sm"
        variant="pill"
        items={[
          {
            value: 'overview',
            label: 'Overview',
            content: (
              <div className="docs-preview-content">
                <Card className="docs-preview-progress">
                  <Card.Body>
                    <span className="docs-eyebrow">Weekly focus</span>
                    <Progress
                      value={72}
                      label="Design system"
                      showValue
                      size="sm"
                    />
                  </Card.Body>
                </Card>
                <Card className="docs-preview-people">
                  <Card.Body>
                    <span className="docs-eyebrow">Team</span>
                    <div
                      className="docs-avatar-stack"
                      aria-label="Four team members"
                    >
                      {teamMembers.map((member) => (
                        <Tooltip
                          key={member.username}
                          content={`@${member.username}`}
                          placement="top"
                          portalled
                        >
                          <a
                            className="docs-avatar-link"
                            href={`https://github.com/${member.username}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open @${member.username} on GitHub`}
                          >
                            <Avatar
                              src={member.avatar}
                              alt={`@${member.username}`}
                              size="sm"
                            >
                              {member.initials}
                            </Avatar>
                          </a>
                        </Tooltip>
                      ))}
                    </div>
                    <strong>4 online</strong>
                  </Card.Body>
                </Card>
              </div>
            ),
          },
          {
            value: 'activity',
            label: 'Activity',
            content: (
              <div className="docs-preview-activity">
                <Badge variant={theme} dot>
                  Tokens published
                </Badge>
                <span>Just now</span>
              </div>
            ),
          },
        ]}
      />

      <div className="docs-preview-footer">
        <span>
          <span className="docs-status-dot" aria-hidden="true" />
          All systems calm
        </span>
        <Switch size="sm" defaultChecked variant={theme}>
          Focus mode
        </Switch>
      </div>
    </div>
  );
}

function ThemeLab() {
  const [theme, setTheme] = useState<PreviewTheme>('primary');
  const [radius, setRadius] = useState<MantiRadiusMode>('default');

  return (
    <section
      className="docs-landing-section docs-theme-lab"
      aria-labelledby="theme-lab-title"
    >
      <div className="docs-theme-lab-copy">
        <span className="docs-landing-kicker">Adapt without forks</span>
        <h2 id="theme-lab-title">One system. Your signature.</h2>
        <p>
          Semantic variants and shared shape channels let an entire interface
          change character without rewriting a component.
        </p>

        <fieldset className="docs-theme-control">
          <legend>Theme</legend>
          <div className="docs-theme-options">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="docs-theme-option"
                data-active={theme === option.value || undefined}
                data-theme-option={option.value}
                aria-pressed={theme === option.value}
                onClick={() => setTheme(option.value)}
              >
                <span aria-hidden="true" />
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="docs-theme-control">
          <legend>Radius</legend>
          <div className="docs-theme-options">
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className="docs-theme-option"
                data-active={radius === option.value || undefined}
                aria-pressed={radius === option.value}
                onClick={() => setRadius(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="docs-theme-stage">
        <ProductPreview theme={theme} radius={radius} compact />
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="docs-landing">
      <section className="docs-landing-hero" aria-labelledby="landing-title">
        <div className="docs-hero-glow" aria-hidden="true" />
        <div className="docs-landing-hero-copy">
          <div className="docs-landing-brand-row">
            <img
              className="docs-landing-logo"
              src="/manti-white.svg"
              alt="Manti UI"
            />
            <a
              className="docs-npm-badge-link"
              href="https://www.npmjs.com/org/manti-ui"
              target="_blank"
              rel="noreferrer"
              aria-label={`Manti UI v${MANTI_VERSION} — view packages on npm`}
            >
              <Badge variant="secondary" size="md" dot>
                v{MANTI_VERSION} · View on npm
              </Badge>
            </a>
          </div>
          <h1 id="landing-title">
            Calm components,
            <br />
            <span>built to adapt.</span>
          </h1>
          <p>
            Accessible components powered by framework-agnostic tokens, CSS, and
            state machines. Familiar to use, unmistakably yours.
          </p>
          <div className="docs-landing-actions">
            <LinkButton to="/getting-started" size="lg">
              Get started
            </LinkButton>
            <LinkButton to="/components" variant="secondary" size="lg">
              Explore components
            </LinkButton>
          </div>
          <FrameworkSupport />
        </div>

        <div className="docs-hero-stage">
          <div className="docs-preview-scene">
            <ProductPreview />
            <div className="docs-floating-note docs-floating-note-top">
              <span>⌘ K</span>
              Search everything
            </div>
            <div className="docs-floating-note docs-floating-note-bottom">
              <span className="docs-status-dot" aria-hidden="true" />
              Accessible by default
            </div>
          </div>
        </div>
      </section>

      <section className="docs-proof-strip" aria-label="Manti UI in numbers">
        <div>
          <strong>53</strong>
          <span>Accessible components</span>
        </div>
        <div>
          <strong>WCAG 2.2</strong>
          <span>AA target</span>
        </div>
        <div>
          <strong>4 layers</strong>
          <span>Tokens to renderers</span>
        </div>
        <div>
          <strong>0 forks</strong>
          <span>Stable styling anatomy</span>
        </div>
      </section>

      <ThemeLab />

      <section
        className="docs-landing-section docs-architecture"
        aria-labelledby="architecture-title"
      >
        <div className="docs-landing-section-heading">
          <span className="docs-landing-kicker">Built in layers</span>
          <h2 id="architecture-title">
            Own the surface. Reuse the hard parts.
          </h2>
          <p>
            Each layer has one job, so future renderers can share the same
            behavior and visual contract.
          </p>
        </div>
        <ol className="docs-architecture-flow">
          <li>
            <span>01</span>
            <strong>Tokens</strong>
            <p>Typed visual decisions</p>
          </li>
          <li>
            <span>02</span>
            <strong>Styles</strong>
            <p>Stable public anatomy</p>
          </li>
          <li>
            <span>03</span>
            <strong>Folds</strong>
            <p>Framework-free behavior</p>
          </li>
          <li>
            <span>04</span>
            <strong>Renderers</strong>
            <p>Thin, accessible adapters</p>
          </li>
        </ol>
      </section>

      <section className="docs-landing-cta">
        <img src="/manti-animated.svg" alt="" width="160" height="160" />
        <span className="docs-landing-kicker">Ready when you are</span>
        <h2>Build something calm.</h2>
        <p>Start with sensible defaults. Adapt every layer when you need to.</p>
        <div className="docs-landing-actions">
          <LinkButton to="/getting-started" size="lg">
            Get started
          </LinkButton>
          <LinkButton
            to="/foundations/design-signature"
            variant="secondary"
            size="lg"
          >
            Read the design story
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
