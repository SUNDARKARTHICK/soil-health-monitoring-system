export type HealthLabel = "Healthy" | "Unhealthy";
export type RiskLevel = "Excellent" | "Good" | "Moderate" | "Poor";
export type ParameterStatus = "Green" | "Yellow" | "Red";

export interface SoilInput {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
}

export interface ParameterAnalysis {
  // Matches the backend's internal feature name (e.g. "organic_matter"),
  // not SoilInput's camelCase keys -- used for display/keying only, never
  // for looking back into the SoilInput object.
  parameter: string;
  label: string;
  value: number;
  idealMin: number;
  idealMax: number;
  status: ParameterStatus;
}

export interface Recommendations {
  natural: string[];
  artificial: string[];
  organic: string[];
  suitableCrops: string[];
  expectedYieldImprovement: string;
  source?: "ai" | "rule-based";
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0-1, from the trained DecisionTreeClassifier
}

export interface PredictionResult {
  soilHealth: HealthLabel;
  confidence: number; // 0-100
  riskLevel: RiskLevel;
  explanation: string;
  parameterAnalysis: ParameterAnalysis[];
  recommendations: Recommendations | null;
  featureImportance?: FeatureImportance[];
  timestamp: string;
}
