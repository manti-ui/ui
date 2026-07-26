const ExternalLinkIcon = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownloadIcon = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function AiPageHeader() {
  return (
    <div className="docs-ai-page-header">
      <h1>Working with AI</h1>

      <div className="docs-ai-page-actions">
        <a
          href="/llms.txt"
          target="_blank"
          rel="noreferrer"
          className="docs-ai-action docs-ai-llms-link"
        >
          <span>llms.txt</span>
          {ExternalLinkIcon}
        </a>

        <a
          href="/llms.txt"
          download="llms.txt"
          aria-label="Download llms.txt"
          title="Download llms.txt"
          className="docs-ai-action docs-ai-download"
          data-scope="button"
          data-part="root"
          data-variant="tertiary"
          data-size="sm"
          data-icon-only="true"
        >
          <span data-scope="button" data-part="label">
            {DownloadIcon}
          </span>
        </a>
      </div>
    </div>
  );
}
