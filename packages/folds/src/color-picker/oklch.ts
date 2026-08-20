import { parse as parseZagColor } from '@zag-js/color-picker';

/** Formats accepted by the Manti color picker adapter. */
export const COLOR_PICKER_FORMATS = [
  'hex',
  'rgba',
  'hsla',
  'hsba',
  'oklch',
] as const;

export type ColorPickerFormat = (typeof COLOR_PICKER_FORMATS)[number];

/** A color value whose interaction state remains in the OKLCH color space. */
export interface OklchColor {
  lightness: number;
  chroma: number;
  hue: number;
  alpha: number;
}

export interface RgbColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export type OklchChannel = keyof OklchColor;

/** Interactive color spaces currently implemented by Manti's picker. */
export type ColorSpaceId = 'oklch';

export interface ColorChannelRange {
  minValue: number;
  maxValue: number;
  step: number;
  pageSize: number;
}

export interface OklchAreaPosition {
  x: number;
  y: number;
}

export interface OklchGradients {
  area: string;
  areaBackground: string;
  hue: string;
  alpha: string;
}

/** The highest chroma exposed by the two-dimensional palette. */
export const OKLCH_CHROMA_MAX = 0.4;

const OKLCH_RANGES: Record<OklchChannel, ColorChannelRange> = {
  lightness: { minValue: 0, maxValue: 1, step: 0.001, pageSize: 0.1 },
  chroma: {
    minValue: 0,
    maxValue: OKLCH_CHROMA_MAX,
    step: 0.001,
    pageSize: 0.05,
  },
  hue: { minValue: 0, maxValue: 360, step: 1, pageSize: 30 },
  alpha: { minValue: 0, maxValue: 1, step: 0.01, pageSize: 0.1 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision: number) => {
  const rounded = Number(value.toFixed(precision));
  return Object.is(rounded, -0) ? 0 : rounded;
};

const formatNumber = (value: number, precision: number) =>
  String(round(value, precision));

const wrapHue = (value: number) => ((value % 360) + 360) % 360;

const toLinearSrgb = (value: number) => {
  const channel = clamp(value, 0, 1);
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
};

const fromLinearSrgb = (value: number) => {
  const channel = clamp(value, 0, 1);
  return channel <= 0.0031308
    ? channel * 12.92
    : 1.055 * channel ** (1 / 2.4) - 0.055;
};

/** Convert an sRGB color to an OKLCH value. */
export function rgbToOklch(color: RgbColor): OklchColor {
  const red = toLinearSrgb(color.red / 255);
  const green = toLinearSrgb(color.green / 255);
  const blue = toLinearSrgb(color.blue / 255);

  const l = 0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue;
  const m = 0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue;
  const s = 0.0883024619 * red + 0.2817188376 * green + 0.6299787015 * blue;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  const lightness =
    0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot;
  const a = 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot;
  const b = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
  const chroma = Math.sqrt(a * a + b * b);

  return {
    lightness,
    chroma,
    hue: chroma < 0.000001 ? 0 : wrapHue((Math.atan2(b, a) * 180) / Math.PI),
    alpha: clamp(color.alpha, 0, 1),
  };
}

/** Convert an OKLCH value to sRGB, clipping only at this output boundary. */
export function oklchToRgb(color: OklchColor): RgbColor {
  const hue = (color.hue * Math.PI) / 180;
  const a = color.chroma * Math.cos(hue);
  const b = color.chroma * Math.sin(hue);

  const lRoot = color.lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mRoot = color.lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sRoot = color.lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;

  return {
    red:
      fromLinearSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) *
      255,
    green:
      fromLinearSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) *
      255,
    blue:
      fromLinearSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) *
      255,
    alpha: clamp(color.alpha, 0, 1),
  };
}

/** Format an sRGB color as the public hex/hexa representation. */
export function formatHexColor(color: RgbColor): string {
  const toByte = (value: number) =>
    Math.round(clamp(value, 0, 255))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  const red = toByte(color.red);
  const green = toByte(color.green);
  const blue = toByte(color.blue);
  const alpha = clamp(color.alpha, 0, 1);
  const alphaSuffix = alpha < 1 ? toByte(alpha * 255) : '';

  return `#${red}${green}${blue}${alphaSuffix}`;
}

/** Format an sRGB color as a stable, token-style OKLCH string. */
export function formatOklchColor(color: RgbColor): string {
  return formatOklchValue(rgbToOklch(color));
}

/** Format a native OKLCH value without routing through sRGB. */
export function formatOklchValue(color: OklchColor): string {
  const alphaSuffix =
    color.alpha < 1 ? ` / ${formatNumber(color.alpha, 3)}` : '';
  return `oklch(${formatNumber(color.lightness, 3)} ${formatNumber(
    color.chroma,
    3,
  )} ${formatNumber(color.hue, 1)}${alphaSuffix})`;
}

const numberToken = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';
const componentToken = `${numberToken}%?`;
const angleToken = `${numberToken}(?:deg|grad|rad|turn)?`;
const oklchPattern = new RegExp(
  `^oklch\\(\\s*(${componentToken})\\s+(${componentToken})\\s+(${angleToken})(?:\\s*\\/\\s*(${componentToken}))?\\s*\\)$`,
  'i',
);

const parseComponent = (value: string, percentageScale: number) => {
  const isPercentage = value.endsWith('%');
  const numeric = Number(isPercentage ? value.slice(0, -1) : value);
  if (!Number.isFinite(numeric)) throw new Error('Invalid color component');
  return isPercentage ? numeric * percentageScale : numeric;
};

const parseHue = (value: string) => {
  const lower = value.toLowerCase();
  const numeric = Number.parseFloat(lower);
  if (!Number.isFinite(numeric)) throw new Error('Invalid color hue');
  if (lower.endsWith('turn')) return wrapHue(numeric * 360);
  if (lower.endsWith('rad')) return wrapHue((numeric * 180) / Math.PI);
  if (lower.endsWith('grad')) return wrapHue(numeric * 0.9);
  return wrapHue(numeric);
};

/** Parse an OKLCH CSS value while preserving its native channels. */
export function parseOklchValue(value: string): OklchColor | undefined {
  if (!/^oklch\s*\(/i.test(value)) return undefined;

  const match = value.trim().match(oklchPattern);
  if (!match) throw new Error('Invalid OKLCH color');

  const lightness = clamp(parseComponent(match[1], 0.01), 0, 1);
  const chroma = parseComponent(match[2], 0.004);
  if (chroma < 0) throw new Error('Invalid OKLCH chroma');

  return {
    lightness,
    chroma,
    hue: parseHue(match[3]),
    alpha: clamp(parseComponent(match[4] ?? '1', 0.01), 0, 1),
  };
}

/** Parse an OKLCH CSS value as clipped sRGB for legacy format adapters. */
export function parseOklchColor(value: string): RgbColor | undefined {
  const parsed = parseOklchValue(value);
  return parsed ? oklchToRgb(parsed) : undefined;
}

/** Parse every supported CSS color at the boundary into native OKLCH. */
export function parseColorValue(value: string): OklchColor {
  const text = value.trim();
  const oklch = parseOklchValue(text);
  if (oklch) return oklch;

  const rgba = parseZagColor(text).toFormat('rgba');
  return rgbToOklch({
    red: rgba.getChannelValue('red'),
    green: rgba.getChannelValue('green'),
    blue: rgba.getChannelValue('blue'),
    alpha: rgba.getChannelValue('alpha'),
  });
}

/** Format a native value for a public output format. */
export function formatColorValue(
  color: OklchColor,
  format: ColorPickerFormat,
): string {
  if (format === 'oklch') return formatOklchValue(color);

  const rgb = oklchToRgb(color);
  if (format === 'hex') return formatHexColor(rgb);

  const rgba = parseZagColor(
    `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${rgb.alpha})`,
  );
  return rgba.toString(format);
}

const gradientColor = (lightness: number, chroma: number, hue: number) =>
  `oklch(${formatNumber(lightness, 3)} ${formatNumber(chroma, 3)} ${formatNumber(hue, 1)})`;

/** CSS gradients for the OKLCH area, hue slider, and alpha slider. */
export function getOklchGradients(color: OklchColor): OklchGradients {
  const hueStops = [0, 60, 120, 180, 240, 300, 360]
    .map((hue) => gradientColor(color.lightness, color.chroma, hue))
    .join(', ');

  return {
    area: `linear-gradient(90deg in oklch, ${gradientColor(
      color.lightness,
      0,
      color.hue,
    )}, ${gradientColor(color.lightness, OKLCH_CHROMA_MAX, color.hue)})`,
    areaBackground: `linear-gradient(to top, ${gradientColor(
      0,
      0,
      color.hue,
    )}, transparent)`,
    hue: `linear-gradient(90deg in oklch, ${hueStops})`,
    alpha: `linear-gradient(90deg, transparent, ${gradientColor(
      color.lightness,
      color.chroma,
      color.hue,
    )})`,
  };
}

export function getOklchChannelRange(channel: OklchChannel): ColorChannelRange {
  return OKLCH_RANGES[channel];
}

export function setOklchChannel(
  color: OklchColor,
  channel: OklchChannel,
  value: number,
): OklchColor {
  const range = getOklchChannelRange(channel);
  const next = clamp(value, range.minValue, range.maxValue);
  const channelValue =
    channel === 'hue'
      ? next === range.maxValue
        ? range.maxValue
        : wrapHue(next)
      : next;
  return {
    ...color,
    [channel]: channelValue,
  };
}

export function incrementOklchChannel(
  color: OklchColor,
  channel: OklchChannel,
  amount: number,
): OklchColor {
  return setOklchChannel(color, channel, color[channel] + amount);
}

export function getOklchAreaPosition(color: OklchColor): OklchAreaPosition {
  return {
    x: clamp(color.chroma / OKLCH_CHROMA_MAX, 0, 1),
    y: 1 - clamp(color.lightness, 0, 1),
  };
}

export function setOklchAreaPosition(
  color: OklchColor,
  position: OklchAreaPosition,
): OklchColor {
  return {
    ...color,
    chroma: clamp(position.x, 0, 1) * OKLCH_CHROMA_MAX,
    lightness: 1 - clamp(position.y, 0, 1),
  };
}

export const oklchColorSpace = {
  id: 'oklch' as const,
  channels: ['lightness', 'chroma', 'hue', 'alpha'] as const,
  area: { x: 'chroma' as const, y: 'lightness' as const, z: 'hue' as const },
  parse: parseColorValue,
  format: formatColorValue,
  getChannelRange: getOklchChannelRange,
  setChannelValue: setOklchChannel,
  incrementChannel: incrementOklchChannel,
  getAreaPosition: getOklchAreaPosition,
  setAreaPosition: setOklchAreaPosition,
  getGradients: getOklchGradients,
};

export type OklchColorSpace = typeof oklchColorSpace;
