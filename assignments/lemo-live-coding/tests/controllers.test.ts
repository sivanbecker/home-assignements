import { getLemo, postLemo } from '../src/controllers';

describe('controllers', () => {
  describe('getLemo', () => {
    it('should return undefined', () => {
      expect(getLemo()).toBeUndefined();
    });
  });

  describe('postLemo', () => {
    it('should return received true with the submitted name and value', () => {
      const result = postLemo({ name: 'example', value: 'demo' });
      expect(result).toEqual({ received: true, name: 'example', value: 'demo' });
    });

    it('should echo back empty string name and value as-is', () => {
      const result = postLemo({ name: '', value: '' });
      expect(result).toEqual({ received: true, name: '', value: '' });
    });

    it('should echo back whitespace name and value as-is', () => {
      const result = postLemo({ name: '  ', value: '  ' });
      expect(result).toEqual({ received: true, name: '  ', value: '  ' });
    });
  });
});
