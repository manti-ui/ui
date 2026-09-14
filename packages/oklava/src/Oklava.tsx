import { useEffect, useState } from 'react';
import { Button, FloatingPanel, ScrollArea } from '@manti-ui/react';

import { ExportDialog } from './ExportDialog';
import { ThemePanel, type ColorScheme } from './ThemePanel';
import { DEFAULT_STORAGE_KEY, readHostFocusRingWidth } from './theme/apply';
import { randomTheme } from './theme/config';
import { initTheme, useOklavaTheme } from './theme/store';
import { ensureStyles, setHostFocusRingWidth } from './styles';

/**
 * The Oklava devtools panel.
 *
 * Drop it into an app built with `@manti-ui/react` and every token knob becomes
 * live: the panel writes an unlayered `<style>` that beats `@layer manti.tokens`,
 * which is the same escape hatch a consumer would use by hand. Nothing here is
 * devtool-only, so what the app looks like with the panel open is what it looks
 * like once the CSS is pasted in.
 *
 * It is meant for development. Guard it so it never reaches a production
 * bundle:
 *
 * ```tsx
 * {import.meta.env.DEV && <Oklava />}
 * ```
 *
 * The package is side-effect free and single-entry, so that branch tree-shakes
 * the whole panel away.
 */

/**
 * Where the panel opens: docked to the right edge, like a rail, stopping just
 * above its own launcher.
 *
 * Size and position are inline styles written by the machine, so neither can
 * live in the stylesheet. Both are only a starting point, since the panel stays
 * draggable and resizable; a devtool that opens over the middle of the app is
 * covering the thing it is there to preview.
 *
 * `clientWidth`/`clientHeight` rather than `innerWidth`/`innerHeight`: they
 * exclude a classic scrollbar, which would otherwise push the panel under it.
 */
const PANEL_WIDTH = 352;
const EDGE_GAP = 16;
const MIN_SIZE = { width: 288, height: 240 };

/**
 * How tall the launcher will be, asked of the layout engine rather than assumed.
 *
 * The panel has to reserve this space before it opens, and the launcher is not
 * in the DOM yet at that point, so a probe resolves the same control-height
 * token the button sizes itself from. That keeps the reservation correct when a
 * host app has retuned the control scale, or when the density knob moves it.
 */
function launcherHeight(): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:absolute;visibility:hidden;height:var(--manti-control-height-lg)';
  document.body.appendChild(probe);
  const height = probe.offsetHeight;
  probe.remove();
  return height;
}

function dockedLayout() {
  const root = document.documentElement;
  const width = Math.min(PANEL_WIDTH, root.clientWidth - EDGE_GAP * 2);
  // Top gap, then the panel, then a gap, then the launcher on its own bottom
  // gap. Covering the launcher would hide the only way to close and reopen the
  // panel from the page.
  const height = root.clientHeight - launcherHeight() - EDGE_GAP * 3;
  return {
    size: { width, height: Math.max(height, MIN_SIZE.height) },
    position: { x: root.clientWidth - width - EDGE_GAP, y: EDGE_GAP },
  };
}

/**
 * The Mantı mark, traced from `manti-favicon.svg` so the package ships no
 * asset of its own.
 *
 * Both of the logo's paths are kept: the white body and the dark line art over
 * it. That pairing IS the logo, and a brand mark is not themeable, so these two
 * colors are literals on purpose rather than tokens.
 *
 * The viewBox is the glyph's own bounding box, squared, rather than the source
 * file's: that file pads the mark for a favicon, and inside an icon-only button
 * the padding is the button's job, not the artwork's.
 */
const MantiMark = (
  <svg width="30" height="30" viewBox="212 187 842 842" aria-hidden="true">
    <path
      d="M 619.173 230.055 C 610.966 231.145, 609.303 231.704, 584.978 241.549 C 560.699 251.376, 545.522 256.136, 530.500 258.637 C 515.778 261.088, 480.173 261.029, 447 258.498 C 326.501 249.305, 276.648 271.700, 260.494 342.280 C 253.098 374.595, 253.171 419.215, 260.736 491 C 264.036 522.320, 264.377 528.265, 264.436 555.500 C 264.516 593.198, 263.153 601.568, 250.040 643.858 C 232.860 699.264, 233.710 748.004, 253.626 849.500 C 267.418 919.789, 277.572 940.913, 305.980 958.422 C 326.509 971.074, 354.499 977, 393.737 977 C 426.428 977, 449.114 974.133, 496.500 964.014 C 565.434 949.293, 580.199 947.500, 632.500 947.500 C 683.842 947.500, 706.664 949.999, 774 962.996 C 842.698 976.255, 869.582 979.279, 898.948 977.049 C 976.332 971.172, 1000.957 935.021, 1020.497 798.609 C 1026.518 756.579, 1027.397 745.496, 1027.446 711 C 1027.507 668.492, 1024.294 649.223, 1011.519 615.500 C 997.342 578.075, 994.208 566.880, 991.920 545.500 C 990.373 531.046, 991.240 506.117, 994.389 474.500 C 1003.122 386.828, 999.289 336.684, 981.361 304.049 C 965.475 275.132, 934.758 260.281, 883.987 256.971 C 866.423 255.826, 853.763 256.151, 815.500 258.729 C 781.319 261.033, 740.786 261.021, 726.168 258.704 C 710.144 256.163, 693.765 251.207, 669.299 241.496 C 640.619 230.112, 632.574 228.275, 619.173 230.055"
      fill="#ffffff"
    />
    <path
      d="M 617.500 203.640 C 607.256 205.259, 595.485 208.977, 577.242 216.359 C 529.369 235.730, 518.136 237.139, 450.500 232.255 C 418.406 229.938, 371.548 229.978, 355.500 232.336 C 288.613 242.163, 251.551 272.529, 236.587 329.763 C 226.928 366.710, 226.412 413.425, 234.776 494 C 238.042 525.472, 238.463 532.563, 238.480 556.500 C 238.504 588.690, 237.828 592.962, 226.984 629.177 C 214.546 670.712, 211.871 686.734, 211.818 720 C 211.757 758.341, 216.407 795.932, 229.011 859 C 239.487 911.425, 247.638 934.629, 262.438 954.161 C 296.303 998.857, 367.388 1013.788, 466.227 996.966 C 472.977 995.818, 491.100 992.170, 506.500 988.861 C 565.632 976.153, 587.436 973.500, 632.500 973.527 C 680.283 973.556, 702.899 976.131, 772 989.405 C 834.667 1001.444, 850.728 1003.452, 884 1003.407 C 902.455 1003.382, 910.967 1002.951, 918.500 1001.660 C 996.830 988.235, 1026.224 942.664, 1045.991 804 C 1052.717 756.820, 1053.494 747.149, 1053.466 711 C 1053.425 659.909, 1049.764 641.438, 1028.987 587.500 C 1016.013 553.821, 1014.756 535.190, 1021.130 471 C 1024.863 433.399, 1025.881 376.305, 1023.162 357 C 1014.291 294.018, 993.337 261.857, 949.500 243.945 C 917.275 230.778, 881.897 227.842, 811.500 232.493 C 739.254 237.266, 724.650 235.480, 675.800 215.893 C 649.382 205.300, 631.191 201.477, 617.500 203.640 M 619.173 230.055 C 610.966 231.145, 609.303 231.704, 584.978 241.549 C 560.699 251.376, 545.522 256.136, 530.500 258.637 C 515.778 261.088, 480.173 261.029, 447 258.498 C 326.501 249.305, 276.648 271.700, 260.494 342.280 C 253.098 374.595, 253.171 419.215, 260.736 491 C 264.036 522.320, 264.377 528.265, 264.436 555.500 C 264.516 593.198, 263.153 601.568, 250.040 643.858 C 232.860 699.264, 233.710 748.004, 253.626 849.500 C 267.418 919.789, 277.572 940.913, 305.980 958.422 C 326.509 971.074, 354.499 977, 393.737 977 C 426.428 977, 449.114 974.133, 496.500 964.014 C 565.434 949.293, 580.199 947.500, 632.500 947.500 C 683.842 947.500, 706.664 949.999, 774 962.996 C 842.698 976.255, 869.582 979.279, 898.948 977.049 C 976.332 971.172, 1000.957 935.021, 1020.497 798.609 C 1026.518 756.579, 1027.397 745.496, 1027.446 711 C 1027.507 668.492, 1024.294 649.223, 1011.519 615.500 C 997.342 578.075, 994.208 566.880, 991.920 545.500 C 990.373 531.046, 991.240 506.117, 994.389 474.500 C 1003.122 386.828, 999.289 336.684, 981.361 304.049 C 965.475 275.132, 934.758 260.281, 883.987 256.971 C 866.423 255.826, 853.763 256.151, 815.500 258.729 C 781.319 261.033, 740.786 261.021, 726.168 258.704 C 710.144 256.163, 693.765 251.207, 669.299 241.496 C 640.619 230.112, 632.574 228.275, 619.173 230.055 M 608.109 260.636 C 604.905 262.880, 603.552 266.096, 594.339 293.362 C 577.890 342.039, 564.100 371.624, 540.403 409.075 C 506.041 463.380, 449.524 521.259, 374.500 578.975 C 359.128 590.801, 347.917 598.929, 298.149 634.334 C 270.819 653.776, 265.857 658.857, 270.077 663.077 C 271.773 664.773, 272.905 665.059, 275.844 664.535 C 290.747 661.875, 352.367 621.821, 401 583.180 C 504.955 500.585, 565.687 424.951, 598.881 336.745 C 615.130 293.568, 620.145 252.206, 608.109 260.636 M 632.872 261.128 C 628.645 265.355, 632.190 290.892, 640.700 317.500 C 669.381 407.190, 735.008 487.937, 843.331 566.817 C 903.733 610.802, 982.717 654.968, 992.045 649.976 C 994.944 648.425, 995.467 645.108, 993.283 642.130 C 990.777 638.713, 976.012 628.864, 947.480 611.577 C 858.869 557.889, 801.150 513.985, 755.966 465.903 C 701.466 407.906, 675.207 363.865, 650.491 289 C 643.056 266.480, 640.954 261.581, 638.062 260.033 C 635.472 258.647, 635.321 258.679, 632.872 261.128 M 324.571 305.571 C 320.928 309.215, 323.558 312.640, 344.196 331.133 C 384.182 366.962, 400.365 382.559, 432.546 416.287 C 451.907 436.578, 458.839 443, 461.379 443 C 462.917 443, 465 439.412, 465 436.762 C 465 425.454, 430.171 381.441, 399.052 353.425 C 375.400 332.132, 351.609 314.600, 336.528 307.351 C 328.701 303.589, 326.832 303.311, 324.571 305.571 M 914.783 310.270 C 881.376 327.460, 834.817 367.646, 805.031 405 C 788.626 425.573, 783.179 436.179, 787.037 440.037 C 791.110 444.110, 790.590 444.517, 826 409.549 C 859.190 376.775, 868.129 368.521, 903.417 338.065 C 925.056 319.391, 931.981 312.546, 931.996 309.821 C 932.005 308.157, 928.603 306, 925.969 306 C 924.381 306, 919.347 307.922, 914.783 310.270 M 753.500 569.719 C 737.005 573.733, 688.943 587.433, 686.641 588.778 C 678.138 593.744, 678.761 601.818, 688.008 606.504 C 693.408 609.240, 694.051 610.219, 698.521 622.500 C 701.159 629.747, 710.651 638.980, 718.500 641.932 C 727.768 645.419, 740.206 644.637, 748.826 640.025 C 764.370 631.708, 770.938 615.431, 766.532 596.140 C 764.913 589.052, 764.901 588.074, 766.366 583.140 C 769.162 573.725, 763.085 567.386, 753.500 569.719 M 481.286 601.393 C 453.741 610.377, 444.957 646.483, 465.468 666.417 C 488.039 688.354, 524.973 675.696, 530.031 644.289 C 532.652 628.014, 523.967 611.047, 509.324 603.839 C 501.599 600.036, 488.857 598.924, 481.286 601.393 M 980.244 674.952 C 919.815 707.031, 816.461 812.827, 768.629 891.567 C 761.313 903.610, 759.756 908.614, 762.478 911.335 C 766.058 914.915, 771.160 909.772, 804.473 869 C 865.973 793.731, 906.037 753.090, 967.434 703.690 C 990.896 684.813, 995.647 680.583, 997.577 676.852 C 999.340 673.443, 999.341 673.484, 997.429 671.571 C 994.717 668.860, 989.957 669.796, 980.244 674.952 M 706.137 683.073 C 704.838 683.593, 700.447 686.696, 696.379 689.969 C 664.975 715.231, 618.952 728.054, 585 721 C 570.247 717.935, 565.816 718.605, 561.088 724.615 C 558.562 727.826, 558.292 734.730, 560.523 739.044 C 567.506 752.548, 618.842 753.859, 656.579 741.497 C 688.606 731.006, 722.379 709.157, 724.563 697.517 C 726.493 687.229, 716.101 679.083, 706.137 683.073 M 266.571 685.571 C 262.173 689.970, 265.554 693.650, 300.500 722.487 C 336.978 752.588, 362.567 776.032, 413.792 826.282 C 489.615 900.661, 508.555 916.279, 511.538 906.881 C 513.126 901.876, 485.098 871.245, 417.331 803.926 C 359.099 746.079, 327.268 717.853, 298.500 698.555 C 278.581 685.192, 270.313 681.830, 266.571 685.571 M 354.500 823.688 C 332.672 835.015, 293.440 897.297, 302.454 906.312 C 306.399 910.257, 308.335 908.489, 327.605 883.335 C 336.347 871.923, 348.853 856.042, 355.396 848.043 C 370.102 830.065, 371.764 826.764, 368 823 C 365.282 820.282, 360.603 820.521, 354.500 823.688 M 882.571 822.571 C 878.755 826.388, 880.691 830.018, 895.725 847.230 C 901.730 854.105, 914.385 869.204, 923.846 880.783 C 946.409 908.395, 948.657 910.343, 952.979 906.021 C 955.671 903.329, 954.941 899.985, 948.829 887 C 931.057 849.246, 892.951 812.192, 882.571 822.571"
      fill="#0a0a0a"
      fillRule="evenodd"
    />
  </svg>
);

export interface OklavaProps {
  /** Open the panel on first mount. */
  defaultOpen?: boolean;
  /**
   * Where the theme is remembered between reloads. `false` keeps the panel
   * ephemeral, which is what a shared demo usually wants.
   */
  storageKey?: string | false;
  /**
   * Light/dark value. Omit and Oklava reads `data-theme` on `<html>`, the
   * convention Manti's own surfaces use; with neither, the Appearance control
   * is not rendered, because a devtool should not invent a light/dark mechanism
   * for an app that already has one.
   */
  colorScheme?: ColorScheme;
  /** Called when the Appearance control changes. */
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Path the agent prompt tells an agent to write. */
  themeFile?: string;
  /** Offer the Google Fonts catalogue. Loads a ~90KB chunk on first open. */
  googleFonts?: boolean;
  /** Extra class on the panel content. */
  className?: string;
}

/** Read and write `data-theme` on `<html>` when the host passes no scheme. */
function useDocumentColorScheme(enabled: boolean) {
  const [scheme, setScheme] = useState<ColorScheme | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const read = () => {
      const value = root.dataset.theme;
      setScheme(value === 'light' || value === 'dark' ? value : undefined);
    };
    read();
    // The host owns the attribute, so follow it rather than caching a snapshot.
    const observer = new MutationObserver(read);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [enabled]);

  return {
    scheme,
    setScheme: (next: ColorScheme) => {
      document.documentElement.dataset.theme = next;
      setScheme(next);
    },
  };
}

export function Oklava({
  defaultOpen = false,
  storageKey = DEFAULT_STORAGE_KEY,
  colorScheme,
  onColorSchemeChange,
  themeFile,
  googleFonts = true,
  className,
}: OklavaProps) {
  // Mount-gated: the panel is a browser surface, and rendering nothing on the
  // server keeps a Next.js hydration pass clean.
  const [layout, setLayout] = useState<ReturnType<typeof dockedLayout> | null>(
    null,
  );
  const [exportOpen, setExportOpen] = useState(false);
  const auto = useDocumentColorScheme(
    layout !== null && colorScheme === undefined,
  );
  const { set, reset, isDefault } = useOklavaTheme();

  useEffect(() => {
    ensureStyles();
    // Read the host's focus ring before the store paints an override over it.
    setHostFocusRingWidth(readHostFocusRingWidth());
    initTheme(storageKey);
    setLayout(dockedLayout());
  }, [storageKey]);

  if (!layout) return null;

  const scheme = colorScheme ?? auto.scheme;
  const setScheme = onColorSchemeChange ?? auto.setScheme;

  return (
    <>
      <FloatingPanel
        title="Oklava"
        defaultOpen={defaultOpen}
        defaultSize={layout.size}
        defaultPosition={layout.position}
        minSize={MIN_SIZE}
        className={['oklava-panel', className].filter(Boolean).join(' ')}
        trigger={
          <Button
            className="oklava-launcher"
            variant="secondary"
            size="lg"
            iconOnly
            aria-label="Open the Oklava theme panel"
          >
            {MantiMark}
          </Button>
        }
      >
        <div className="oklava-body">
          <ScrollArea className="oklava-scroll" type="always">
            <ThemePanel
              colorScheme={scheme}
              onColorSchemeChange={setScheme}
              googleFonts={googleFonts}
              footer={
                <div className="oklava-footer">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => set(randomTheme())}
                  >
                    Surprise me
                  </Button>
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={reset}
                    disabled={isDefault}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setExportOpen(true)}
                  >
                    Take it
                  </Button>
                </div>
              }
            />
          </ScrollArea>
        </div>
      </FloatingPanel>
      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        themeFile={themeFile}
      />
    </>
  );
}
