// src/types/index.ts
export interface AIModel {
    id: string;
    provider: string;
    creator: string;
    modelName: string;
    inputCostPer1MTokens: number;
    outputCostPer1MTokens: number;
    contextWindow: number;
    features: string[];
  }