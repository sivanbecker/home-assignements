export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`user '${userId}' not found`);
    this.name = 'UserNotFoundError';
  }
}

export class CarNotFoundError extends Error {
  constructor(carId: string) {
    super(`car '${carId}' not found or does not belong to user`);
    this.name = 'CarNotFoundError';
  }
}

export class CarNotInsurableError extends Error {
  constructor(carId: string, reasons: string[]) {
    super(`car '${carId}' is not insurable: ${reasons.join(', ')}`);
    this.name = 'CarNotInsurableError';
  }
}

export class DriverTooYoungError extends Error {
  constructor() {
    super('driver must be at least 18 years old');
    this.name = 'DriverTooYoungError';
  }
}

export class EmptyCarSelectionError extends Error {
  constructor() {
    super('at least one car must be selected');
    this.name = 'EmptyCarSelectionError';
  }
}

export class QuoteError extends Error {
  readonly statusCode = 400 as const;
  constructor(message: string) {
    super(message);
    this.name = 'QuoteError';
    this.statusCode = 400;
  }
}
