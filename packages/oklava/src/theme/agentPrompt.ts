import {
  DEFAULT_THEME,
  VARIANTS,
  configForPreset,
  fontLabel,
  type ThemeConfig,
} from './config';
import { toHex } from './color';
import { buildThemeCss, num, stylesheetImports } from './css';

/** Where the agent prompt tells an agent to put the generated stylesheet. */
export const DEFAULT_THEME_FILE = 'src/manti-theme.css';

export interface AgentPromptOptions {
  /** Path the agent should write, relative to the consumer's repo root. */
  themeFile?: string;
}

/** A ready-to-paste brief for an AI agent working in a Manti UI codebase. */
export function buildAgentPrompt(
  config: ThemeConfig,
  options: AgentPromptOptions = {},
): string {
  const themeFile = options.themeFile ?? DEFAULT_THEME_FILE;
  const css = buildThemeCss(config);
  const d = configForPreset(config.preset);
  const imports = stylesheetImports(config);
  const summary: string[] = [];
  if (config.preset !== DEFAULT_THEME.preset) {
    summary.push(`- base palette: ${config.preset} (from @manti-ui/styles)`);
  }
  for (const variant of VARIANTS) {
    const color = config.colors[variant.key];
    if (color && color !== d.colors[variant.key]) {
      summary.push(`- \`${variant.key}\` variant: ${toHex(color)}`);
    }
  }
  if (config.neutralHue !== d.neutralHue) {
    summary.push(`- neutral hue: ${num(config.neutralHue)}`);
  }
  if (config.radiusFactor !== d.radiusFactor) {
    summary.push(`- radius factor: ${num(config.radiusFactor)}`);
  }
  if (config.density !== d.density) {
    summary.push(`- density multiplier: ${num(config.density)}`);
  }
  if (config.font !== d.font) {
    summary.push(`- sans font: ${fontLabel(config.font)}`);
  }
  if (config.textBase !== d.textBase) {
    summary.push(`- base text size: ${num(config.textBase)}rem`);
  }
  if (config.focusWidth !== d.focusWidth) {
    summary.push(`- focus ring width: ${num(config.focusWidth)}px`);
  }

  return `Apply this custom Manti UI theme to my project. I tuned it live with
the Oklava devtools panel (\`@manti-ui/oklava\`); the CSS below is exactly what
the app was running when I copied this.

Manti UI (\`@manti-ui/react\` + \`@manti-ui/styles\`) is themed entirely through CSS
custom properties. Its defaults ship inside \`@layer manti.tokens\`, so an
UNLAYERED override always wins. Preset base styles come from the published
\`@manti-ui/styles/themes/*.css\` files. Never use \`!important\`, and never
edit files inside node_modules.

Steps:
1. Create \`${themeFile}\` with exactly the CSS below.
2. Import it after the Manti stylesheet, at the app entry point:
   \`\`\`ts
   import '@manti-ui/styles/index.css';
   import './${themeFile.replace(/^src\//, '')}';
   \`\`\`
3. Do not convert the file into a \`@layer\`, and do not move the import above the
   Manti stylesheet; either would hand the cascade back to the defaults.
4. Leave component CSS alone: every Manti component reads these tokens, so no
   component-level change is needed.

Theme summary:
${summary.length > 0 ? summary.join('\n') : '- unchanged (the shipped Manti theme)'}

\`\`\`css
${[imports, css].filter(Boolean).join('\n\n') || '/* no overrides */'}
\`\`\`

Notes for you, the agent:
- \`--variant-*\` is the per-variant vocabulary each component consumes
  (\`solid\`, \`solid-hover\`, \`solid-active\`, \`on-solid\`, \`soft-bg\`,
  \`soft-bg-hover\`, \`soft-text\`, \`border\`, \`text\`, \`ring\`).
- \`--manti-cool-hue\` drives the entire neutral ramp plus every surface, border
  and text role, so changing it retints the whole UI at once.
- \`--manti-accent-fill\` and \`--manti-selection-*\` are branded roles that no
  \`[data-variant]\` block can reach (Progress spends its \`data-variant\` on
  linear/circular; \`::selection\` has its own pair). Keep them in sync with the
  primary color or a themed app keeps a stray default-orange progress bar.
- The radius ramp (\`--manti-radius-xs\` … \`--manti-radius-2xl\`) derives from
  \`--manti-radius-factor\`; override the factor rather than each step.
- Spacing and type scales derive from \`--manti-space-1\` and
  \`--manti-text-base\` respectively, by the same rule.
`;
}
