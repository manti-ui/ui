import { Button, Input, Kbd } from '@manti-ui/react';

const SearchIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export default function InputLeftRight() {
  return (
    <div className="input-pair-grid">
      <Input
        label="Price"
        left="$"
        right="USD"
        inputMode="decimal"
        placeholder="0.00"
      />
      <Input
        label="Discount code"
        placeholder="MANTI20"
        right={
          <Button size="sm" variant="tertiary">
            Apply
          </Button>
        }
      />
      <Input
        aria-label="Search invoices"
        placeholder="Search invoices…"
        left={SearchIcon}
        right={
          <span className="kbd-item">
            <Kbd>⌘</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </span>
        }
      />
    </div>
  );
}
