export interface EvaluateCountryRequest {
  code: string;
  action: 'like' | 'dislike';
}
