export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface AnatomyPart {
  part: string;
  description: string;
}

export interface ComponentMeta {
  /** The `data-scope` value and `componentTokens` key. */
  scope: string;
  props: PropRow[];
  anatomy: AnatomyPart[];
}
