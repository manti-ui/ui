import { useState } from 'react';
import { Clipboard, Tabs } from '@manti-ui/react';

const DEFAULT_PACKAGES = '@manti-ui/react @manti-ui/styles';

/** Each manager and how it spells "install these packages". */
const MANAGERS = [
  { value: 'npm', label: 'npm', install: 'install' },
  { value: 'yarn', label: 'yarn', install: 'add' },
  { value: 'pnpm', label: 'pnpm', install: 'add' },
  { value: 'bun', label: 'bun', install: 'add' },
];

export interface InstallTabsProps {
  /**
   * The package(s) to install, space-separated. Defaults to the two packages a
   * React app needs (the renderer + the stylesheet).
   */
  packages?: string;
}

/**
 * A package-manager install snippet framed like the live demos: one bordered
 * card whose top bar switches managers (npm / yarn / pnpm / bun) and whose body
 * shows the matching command in Manti's own Clipboard component, copyable in one
 * click. The Tabs here are only a switcher (their content is hidden); the command
 * is rendered below from the active manager.
 */
export function InstallTabs({ packages = DEFAULT_PACKAGES }: InstallTabsProps) {
  const [manager, setManager] = useState(MANAGERS[0].value);
  const active = MANAGERS.find((m) => m.value === manager) ?? MANAGERS[0];

  return (
    <div className="install-card">
      <div className="install-card-bar">
        <Tabs
          variant="soft"
          tone="primary"
          value={manager}
          onValueChange={setManager}
          items={MANAGERS.map((m) => ({
            value: m.value,
            label: m.label,
            content: null,
          }))}
        />
      </div>
      <div className="install-card-body">
        {/* Coloured for display (a Clipboard <input> can't carry highlighted
            spans); the adjacent Clipboard holds the raw value and does the copy. */}
        <code className="install-cmd">
          <span className="install-cmd-pm">{active.value}</span>{' '}
          <span className="install-cmd-sub">{active.install}</span> {packages}
        </code>
        <Clipboard value={`${active.value} ${active.install} ${packages}`} />
      </div>
    </div>
  );
}
