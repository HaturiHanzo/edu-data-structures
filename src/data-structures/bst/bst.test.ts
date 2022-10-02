import { BST } from './bst';
import { ComparableKey, createComparableKey } from '../utils';

export const fillBSTWithRandomRange = (bst: BST<ComparableKey, number>, range: number): void => {
  const arr = Array.from({ length: range }, (_, idx) => idx);
  let currentIndex = arr.length;

  // shuffling
  while(currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }

  arr.forEach(el => bst.insert(createComparableKey(el), el));
}

describe('BST', () => {

  let bst: BST<ComparableKey, number>;
  beforeEach(() => bst = new BST())

  describe('insert', () => {

    it('empty on create', () => {
      expect(bst.size).toBe(0);
    });

    it('size increasing', () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.size).toBe(20);
    });

    it('updates existing keys via insert' , () => {
      fillBSTWithRandomRange(bst, 20);
      const someKey1 = createComparableKey(10);
      const someKey2 = createComparableKey(15);
      bst.insert(someKey1, 1000);
      bst.insert(someKey2, 1000);

      expect(bst.search(someKey1)).toBe(1000);
      expect(bst.search(someKey2)).toBe(1000);
    });
  });

  describe('search', () => {
    it('finds existing keys', () => {
      fillBSTWithRandomRange(bst, 20);
      const someKey1 = createComparableKey(10);
      const someKey2 = createComparableKey(15);

      expect(bst.search(someKey1)).toBe(10);
      expect(bst.search(someKey2)).toBe(15);
    });

    it ('doesn\'t find unknown key', () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.search(createComparableKey(100))).toBe(undefined);
    });
  });

  describe('remove', () => {
    it('key is absent after removal' , () => {
      fillBSTWithRandomRange(bst, 20);
      const removedKey = createComparableKey(5);
      bst.remove(removedKey);
      expect(bst.search(removedKey)).toBe(undefined);
    });

    it('existing keys are present after removal' , () => {
      fillBSTWithRandomRange(bst, 20);
      const removedKey = createComparableKey(5);
      bst.remove(removedKey);

      expect(bst.search(createComparableKey(7))).toBe(7);
    });

    it('size decreasing', () => {
      fillBSTWithRandomRange(bst, 7);
      expect(bst.size).toBe(7);

      bst.remove(createComparableKey(1));
      bst.remove(createComparableKey(6));
      expect(bst.size).toBe(5);

      bst.remove(createComparableKey(0));
      bst.remove(createComparableKey(2));
      bst.remove(createComparableKey(3));
      bst.remove(createComparableKey(4));
      bst.remove(createComparableKey(5));
      expect(bst.size).toBe(0);
    });

    it('size remains the same after removal of unknown key', () => {
      fillBSTWithRandomRange(bst, 7);
      bst.remove(createComparableKey(100));
      expect(bst.size).toBe(7);
    });
  });

  describe('min', () => {
    it('min is correct' , () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.min()?.value).toBe(0);
    });

    it('min is correct after removal' , () => {
      fillBSTWithRandomRange(bst, 20);
      bst.remove(createComparableKey(0));
      bst.remove(createComparableKey(1));
      bst.remove(createComparableKey(2));

      expect(bst.min()?.value).toBe(3);
    });
  });

  describe('removeMin', () => {
    it('min is changed after removal' , () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.min()?.value).toBe(0);
      bst.removeMin();
      bst.removeMin();
      bst.removeMin();
      bst.removeMin();
      bst.removeMin();
      expect(bst.min()?.value).toBe(5);
    });
  });

  describe('rank', () => {
    it('ranks first, mid & last values are correct', () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.rank(createComparableKey(0))).toBe(0);
      expect(bst.rank(createComparableKey(9))).toBe(9);
      expect(bst.rank(createComparableKey(19))).toBe(19);
    });

    it('rank is max for the biggest key', () => {
      fillBSTWithRandomRange(bst, 20);
      expect(bst.rank(createComparableKey(100))).toBe(20);
    });
  });

  describe('nth', () => {
    const bst = new BST<ComparableKey, number>();

    const keys = [8, 4, 15, 1, 5, 11, 28, 7, 12];
    keys.forEach(key => bst.insert(createComparableKey(key), key));

    it('nth less than 0 is undefined', () => {
      expect(bst.nth(-1)).toBe(undefined);
    });

    it('nth bigger than collection size is undefined', () => {
      expect(bst.nth(100)).toBe(undefined);
    });

    it('min key', () => {
      expect(bst.nth(0)?.value).toBe(1);
    });

    it('max key', () => {
      expect(bst.nth(8)?.value).toBe(28);
    });

    it('root key', () => {
      expect(bst.nth(4)?.value).toBe(8);
    });

    it('mid key', () => {
      expect(bst.nth(5)?.value).toBe(11);
    });
  });
});
