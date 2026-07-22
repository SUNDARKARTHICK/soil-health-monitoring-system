from typing import Optional

from pydantic import BaseModel, Field


class SoilInputRequest(BaseModel):
    """Field names intentionally match the frontend's SoilInput type
    (camelCase) so no field-name translation layer is needed between the two."""

    pH: float = Field(..., ge=0, le=14)
    nitrogen: float = Field(..., ge=0, le=1000)
    phosphorus: float = Field(..., ge=0, le=1000)
    potassium: float = Field(..., ge=0, le=1000)
    organicMatter: float = Field(..., ge=0, le=100)
    temperature: Optional[float] = None
    humidity: Optional[float] = Field(None, ge=0, le=100)
    rainfall: Optional[float] = Field(None, ge=0)


class ParameterAnalysisItem(BaseModel):
    parameter: str
    label: str
    value: float
    idealMin: float
    idealMax: float
    status: str


class RecommendationsResponse(BaseModel):
    natural: list[str]
    artificial: list[str]
    organic: list[str]
    suitableCrops: list[str]
    expectedYieldImprovement: str
    source: str


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float


class PredictionResponse(BaseModel):
    soilHealth: str
    confidence: float
    riskLevel: str
    explanation: str
    parameterAnalysis: list[ParameterAnalysisItem]
    recommendations: RecommendationsResponse
    featureImportance: list[FeatureImportanceItem]
    timestamp: str


class HealthCheckResponse(BaseModel):
    status: str
    modelLoaded: bool
