export enum ComparisonResult {
  Ascending = -1,
  Same = 0,
  Descending = 1
}

export interface Comparable<T> {
  compare(other: T): ComparisonResult;
}

export interface SymbolTableApi<K extends Comparable<K>, V> {
  readonly size: number;

  insert(key: K, value: V): void;
  search(key: K): V | undefined;
  min(): K | undefined;

  removeMin(): void;
  remove(key: K): void;

  rank(key: K): number;
  nth(index: number): K | undefined;
}

export interface ComparableKey extends Comparable<ComparableKey> {
  readonly value: number;
}

export const createComparableKey = (value: number): ComparableKey => {
  return {
    value: value,
    compare(other) {
      return this.value === other.value
        ? ComparisonResult.Same
        : (this.value > other.value ? ComparisonResult.Descending : ComparisonResult.Ascending);
    }
  }
}

export const randomInt = (min: number, max: number): number => {
  return min + Math.floor(Math.random() * (max - min));
}
