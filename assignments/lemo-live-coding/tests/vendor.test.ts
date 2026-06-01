import { getCarsForUser, CarCategory } from '../src/vendor';
import { UserNotFoundError } from '../src/errors';

describe('getCarsForUser', () => {
  it('should return all cars for a known userId', () => {
    const cars = getCarsForUser('user-1');
    expect(cars.length).toBeGreaterThan(0);
    expect(cars.every((c) => c.userId === 'user-1')).toBe(true);
  });

  it('should return only cars belonging to the requested user', () => {
    const cars = getCarsForUser('user-1');
    expect(cars.every((c) => c.userId === 'user-1')).toBe(true);
  });

  it('should return cars with all required fields', () => {
    const cars = getCarsForUser('user-1');
    for (const car of cars) {
      expect(car).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        make: expect.any(String),
        model: expect.any(String),
        year: expect.any(Number),
        category: expect.stringMatching(/^(sedan|suv|sport|exotic)$/),
        value: expect.any(Number),
      });
    }
  });

  it('should return an empty array when userId exists but has no cars', () => {
    const cars = getCarsForUser('user-empty');
    expect(cars).toEqual([]);
  });

  it('should throw UserNotFoundError when userId is not in vendor data', () => {
    expect(() => getCarsForUser('unknown-user')).toThrow(UserNotFoundError);
  });

  it('should throw with a message containing the unknown userId', () => {
    expect(() => getCarsForUser('ghost-99')).toThrow("user 'ghost-99' not found");
  });

  it('should return different cars for different users', () => {
    const user1Cars = getCarsForUser('user-1');
    const user2Cars = getCarsForUser('user-2');
    const user1Ids = new Set(user1Cars.map((c) => c.id));
    expect(user2Cars.every((c) => !user1Ids.has(c.id))).toBe(true);
  });
});
