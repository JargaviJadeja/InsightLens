export interface UploadedFileState {
  file?: File;
  name: string;
  size: number;
  type: string;
  base64?: string;
  previewUrl?: string;
  isPreset?: boolean;
}

export interface EntityItem {
  name: string;
  type: string;
  description: string;
  relevance: "high" | "medium" | "low";
}

export interface ClaimItem {
  id: string;
  claim: string;
  importance: "high" | "medium" | "low";
  context: string;
  category: string;
  verifiable: boolean;
}

export interface IssueItem {
  id: string;
  title: string;
  type: "ambiguity" | "unsupported" | "contradiction" | "suspicious" | "outdated";
  description: string;
  severity: "high" | "medium" | "low";
  excerpt?: string;
  recommendation: string;
}

export interface InvestigationQuestion {
  id: string;
  question: string;
  rationale: string;
  suggestedSearchQuery: string;
  focusArea: string;
}

export interface ChallengeClaim {
  id: string;
  claim: string;
  reason: string;
  challengeCategory:
    | "outdated"
    | "difficult_to_verify"
    | "unsupported"
    | "contradictory"
    | "unusually_specific"
    | "potentially_misleading";
  initialStatus: "Needs Verification" | "Potentially Supported" | "Potential Conflict";
  suggestedQuery: string;
  documentExcerpt?: string;
}

export interface AnalysisResult {
  executiveSummary: string;
  contentType: string;
  keyFacts: string[];
  keyEntities: EntityItem[];
  mainClaims: ClaimItem[];
  potentialIssues: IssueItem[];
  investigationQuestions: InvestigationQuestion[];
  challengeClaims: ChallengeClaim[];
  rawTextExcerpt?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface VerificationResult {
  claimId?: string;
  originalClaim: string;
  status: "Verified" | "Potentially Supported" | "Needs Verification" | "Potential Conflict" | "Inconclusive";
  confidence: "High" | "Medium" | "Low";
  summary: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  searchQueries: string[];
  sources: GroundingSource[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  searchQueries?: string[];
}
