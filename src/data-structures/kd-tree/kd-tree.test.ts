import { KDTree } from './kd-tree';
import { createComparableKey, ComparableKey } from '../utils';

const createTestKey = (x: number, y: number): [ComparableKey, ComparableKey] => {
  return [createComparableKey(x), createComparableKey(y)];
}

describe('2dTree', () => {
  describe('rangeSearch2d', () => {
    let tree: KDTree<number>;

    beforeEach(() => {
      tree = new KDTree(2);
      tree.insert(createTestKey(0.25, 0.25), 1);
      tree.insert(createTestKey(0.5, 0.5), 2);
      tree.insert(createTestKey(0.75, 0.75), 3);
      tree.insert(createTestKey(0.25, 0.75), 4);
      tree.insert(createTestKey(0.75, 0.25), 5);
    });

    it('empty match', () => {
      const result = tree.rangeSearch2D(createTestKey(0.1, 0.1), createTestKey(0.2, 0.2));
      expect(result.length).toBe(0);
    });

    describe('partial match', () => {
      it('left part', () => {
        const result = tree.rangeSearch2D(createTestKey(0.1, 0.1), createTestKey(0.6, 0.9));
        const expectedResults = new Set([1, 2, 4]);
        expect(result.length).toBe(expectedResults.size);
        expect(result.every(val => expectedResults.has(val))).toBe(true);
      });

      it('right part', () => {
        const result = tree.rangeSearch2D(createTestKey(0.4, 0.1), createTestKey(0.9, 0.9));
        const expectedResults = new Set([2, 3, 5]);
        expect(result.length).toBe(expectedResults.size);
        expect(result.every(val => expectedResults.has(val))).toBe(true);
      });

      it('top part', () => {
        const result = tree.rangeSearch2D(createTestKey(0.1, 0.4), createTestKey(0.9, 0.9));
        const expectedResults = new Set([2, 3, 4]);
        expect(result.length).toBe(expectedResults.size);
        expect(result.every(val => expectedResults.has(val))).toBe(true);
      });
    })

    it('all points match', () => {
      const result = tree.rangeSearch2D(createTestKey(0.1, 0.1), createTestKey(0.9, 0.9));
      const expectedResults = new Set([1, 2, 3, 4, 5]);
      expect(result.length).toBe(expectedResults.size);
      expect(result.every(val => expectedResults.has(val))).toBe(true);
    });
  });
});