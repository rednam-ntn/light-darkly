export interface Project {
  key: string;
  name: string;
  tags: string[];
  environments?: {
    items: Environment[];
    totalCount: number;
  };
  _links?: Record<string, { href: string }>;
}

export interface ProjectsResponse {
  items: Project[];
  totalCount: number;
}

export interface Environment {
  key: string;
  name: string;
  color: string;
  confirmChanges: boolean;
  _links?: Record<string, { href: string }>;
}

export interface EnvironmentsResponse {
  items: Environment[];
  totalCount: number;
}

export interface Variation {
  _id: string;
  value: unknown;
  name?: string;
  description?: string;
}

export interface Clause {
  _id?: string;
  attribute: string;
  op: string;
  values: unknown[];
  negate: boolean;
  contextKind?: string;
}

export interface WeightedVariation {
  variation: number;
  weight: number;
}

export interface Rollout {
  variations: WeightedVariation[];
  bucketBy?: string;
  contextKind?: string;
}

export interface Fallthrough {
  variation?: number;
  rollout?: Rollout;
}

export interface Target {
  values: string[];
  variation: number;
  contextKind?: string;
}

export interface TargetingRule {
  _id: string;
  description?: string;
  clauses: Clause[];
  variation?: number;
  rollout?: Rollout;
  ref?: string;
  trackEvents?: boolean;
}

export interface Prerequisite {
  key: string;
  variation: number;
}

export interface FlagEnvironmentConfig {
  on: boolean;
  archived: boolean;
  targets?: Target[];
  contextTargets?: Target[];
  rules?: TargetingRule[];
  fallthrough: Fallthrough;
  offVariation?: number;
  prerequisites?: Prerequisite[];
  lastModified?: number;
  salt?: string;
  version?: number;
  _summary?: {
    variations: Record<
      string,
      { rules: number; nullRules: number; targets: number; isFallthrough?: boolean; isOff?: boolean }
    >;
  };
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  kind: "boolean" | "multivariate";
  creationDate: number;
  archived: boolean;
  deprecated: boolean;
  temporary: boolean;
  tags: string[];
  variations: Variation[];
  environments: Record<string, FlagEnvironmentConfig>;
  _links?: Record<string, { href: string }>;
}

export interface FlagsResponse {
  items: FeatureFlag[];
  totalCount: number;
  _links?: Record<string, { href: string }>;
}
