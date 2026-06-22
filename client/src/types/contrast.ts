export interface PassFailStatus {
  pass: boolean;
  threshold: number;
}

export interface ContrastResult {
  ratio: number;
  normalAA: PassFailStatus;
  normalAAA: PassFailStatus;
  largeAA: PassFailStatus;
  largeAAA: PassFailStatus;
}
