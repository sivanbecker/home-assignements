export enum SessionStep {
  STARTED = 'STARTED',
  PROFILED = 'PROFILED',
  QUOTED = 'QUOTED',
  BOUND = 'BOUND',
}

export interface CarOption {
  carId: string;
  make: string;
  model: string;
  year: number;
  value: number;
}

export interface Quote {
  perCar: Record<string, number>;
  total: number;
}

export interface ProfileBody {
  age: number;
  licenseYear: number;
  zipCode: string;
}

export interface Session {
  sessionId: string;
  step: SessionStep;
  createdAt: Date;
  profile?: ProfileBody;
  eligibleCars?: CarOption[];
  selectedCarIds?: string[];
  quote?: Quote;
  boundAt?: Date;
}
