// Quantum state utilities for visualization

export interface QubitState {
  alpha: { real: number; imag: number };
  beta: { real: number; imag: number };
}

export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
  theta: number;
  phi: number;
}

// Standard basis states
export const STATE_ZERO: QubitState = {
  alpha: { real: 1, imag: 0 },
  beta: { real: 0, imag: 0 },
};

export const STATE_ONE: QubitState = {
  alpha: { real: 0, imag: 0 },
  beta: { real: 1, imag: 0 },
};

export const STATE_PLUS: QubitState = {
  alpha: { real: 1 / Math.sqrt(2), imag: 0 },
  beta: { real: 1 / Math.sqrt(2), imag: 0 },
};

export const STATE_MINUS: QubitState = {
  alpha: { real: 1 / Math.sqrt(2), imag: 0 },
  beta: { real: -1 / Math.sqrt(2), imag: 0 },
};

// Bell states for two-qubit entanglement
export type BellState = 'Φ+' | 'Φ-' | 'Ψ+' | 'Ψ-';

export const BELL_STATES: Record<BellState, string> = {
  'Φ+': '(|00⟩ + |11⟩) / √2',
  'Φ-': '(|00⟩ - |11⟩) / √2',
  'Ψ+': '(|01⟩ + |10⟩) / √2',
  'Ψ-': '(|01⟩ - |10⟩) / √2',
};

// Convert qubit state to Bloch sphere coordinates
export function stateToBloch(state: QubitState): BlochCoordinates {
  const { alpha, beta } = state;
  
  // Calculate probabilities
  const prob0 = alpha.real * alpha.real + alpha.imag * alpha.imag;
  const prob1 = beta.real * beta.real + beta.imag * beta.imag;
  
  // Theta is determined by the probabilities
  const theta = 2 * Math.acos(Math.sqrt(prob0));
  
  // Phi is the relative phase
  let phi = 0;
  if (prob1 > 0.0001) {
    const alphaPhase = Math.atan2(alpha.imag, alpha.real);
    const betaPhase = Math.atan2(beta.imag, beta.real);
    phi = betaPhase - alphaPhase;
  }
  
  // Convert to Cartesian coordinates on the Bloch sphere
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  
  return { x, y, z, theta, phi };
}

// Apply Hadamard gate
export function hadamard(state: QubitState): QubitState {
  const sqrt2Inv = 1 / Math.sqrt(2);
  return {
    alpha: {
      real: sqrt2Inv * (state.alpha.real + state.beta.real),
      imag: sqrt2Inv * (state.alpha.imag + state.beta.imag),
    },
    beta: {
      real: sqrt2Inv * (state.alpha.real - state.beta.real),
      imag: sqrt2Inv * (state.alpha.imag - state.beta.imag),
    },
  };
}

// Simulate Bell state measurement
export function measureBellState(bellState: BellState): [0 | 1, 0 | 1] {
  const random = Math.random();
  
  switch (bellState) {
    case 'Φ+':
    case 'Φ-':
      // |00⟩ or |11⟩ with equal probability
      return random < 0.5 ? [0, 0] : [1, 1];
    case 'Ψ+':
    case 'Ψ-':
      // |01⟩ or |10⟩ with equal probability
      return random < 0.5 ? [0, 1] : [1, 0];
  }
}

// Measure a single qubit
export function measureQubit(state: QubitState): 0 | 1 {
  const prob0 = state.alpha.real ** 2 + state.alpha.imag ** 2;
  return Math.random() < prob0 ? 0 : 1;
}

// Calculate correlation coefficient from measurements
export function calculateCorrelation(measurements: [number, number][]): number {
  if (measurements.length === 0) return 0;
  
  const n = measurements.length;
  let sumA = 0, sumB = 0, sumAB = 0, sumA2 = 0, sumB2 = 0;
  
  for (const [a, b] of measurements) {
    sumA += a;
    sumB += b;
    sumAB += a * b;
    sumA2 += a * a;
    sumB2 += b * b;
  }
  
  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt((n * sumA2 - sumA ** 2) * (n * sumB2 - sumB ** 2));
  
  return denominator === 0 ? 0 : numerator / denominator;
}
