import { Comparable, ComparisonResult } from '../utils';

export type KDTreeKey = readonly Comparable<unknown>[];

class Node<V> {
  size = 1;
  leftNode: Node<V> | undefined = undefined;
  rightNode: Node<V> | undefined = undefined;

  constructor(
    readonly key: KDTreeKey,
    public value: V,
  ) {
  }
}

export class KDTree<V> {
  private _root: Node<V> | undefined;

  constructor(readonly dimensions: number) {}

  get size(): number {
    return this._root?.size ?? 0;
  }

  insert(key: KDTreeKey, value: V): void {
    if (this._root === undefined) {
      this._root = new Node(key, value);
      return;
    }

    this.insertNodeTo(this._root, key, value, 0);
  }

  rangeSearch2D(bottomLeftKey: KDTreeKey, topRightKey: KDTreeKey): readonly V[] {
    if (bottomLeftKey[0].compare(topRightKey[0]) >= 0  || bottomLeftKey[1].compare(topRightKey[1]) >= 0) {
      throw new Error('#rangeSearch2D: incorrect range received');
    }

    if (this.dimensions > 2)  {
      throw new Error('#rangeSearch2D: not available for n-dimension tree');
    }

    const result: V[] = [];

    this.rangeSearch2DFor(bottomLeftKey, topRightKey, result, this._root, 0);

    return result;
  }

  private insertNodeTo(nodeRef: Node<V>, newKey: KDTreeKey, newVal: V, n: number): void {
    const level = n % this.dimensions;

    const keysAreEqual = nodeRef.key.every(
      (key, index) => key.compare(newKey[index]) === ComparisonResult.Same
    )

    if (keysAreEqual) {
      nodeRef.value = newVal;
      return;
    }

    const comparisonResult = nodeRef.key[level].compare(newKey[level]);

    if (comparisonResult === ComparisonResult.Descending) {
      nodeRef.leftNode !== undefined
        ? this.insertNodeTo(nodeRef.leftNode, newKey, newVal, n + 1)
        : nodeRef.leftNode = new Node(newKey, newVal);
    } else {
      nodeRef.rightNode !== undefined
        ? this.insertNodeTo(nodeRef.rightNode, newKey, newVal, n + 1)
        : nodeRef.rightNode = new Node(newKey, newVal);
    }

    nodeRef.size = 1 + (nodeRef.leftNode?.size ?? 0) + (nodeRef.rightNode?.size ?? 0);
  }

  private rangeSearch2DFor(
    bottomLeftKey: KDTreeKey,
    topRightKey: KDTreeKey,
    matched: V[],
    nodeRef: Node<V> | undefined,
    n: number,
  ): void {
    if (!nodeRef) {
      return;
    }

    const inRect = isInRect(bottomLeftKey, topRightKey, nodeRef.key);

    if (inRect) {
      matched.push(nodeRef.value);
    }

    const testAxis = n % this.dimensions;

    if (inRange(bottomLeftKey[testAxis], topRightKey[testAxis], nodeRef.key[testAxis])) {
      this.rangeSearch2DFor(bottomLeftKey, topRightKey, matched, nodeRef.leftNode, n + 1);
      this.rangeSearch2DFor(bottomLeftKey, topRightKey, matched, nodeRef.rightNode, n + 1);
    } else {
      const closestNode = nodeRef.key[testAxis].compare(bottomLeftKey[testAxis]) === ComparisonResult.Descending
        ? nodeRef.leftNode
        : nodeRef.rightNode;

      this.rangeSearch2DFor(bottomLeftKey, topRightKey, matched, closestNode, n + 1);
    }
  }
}

function inRange(min: Comparable<unknown>, max: Comparable<unknown>, point: Comparable<unknown>): boolean {
  return point.compare(min) === ComparisonResult.Descending && point.compare(max) === ComparisonResult.Ascending;
}

function isInRect(bottomLeftKey: KDTreeKey, topRightKey: KDTreeKey, testPoint: KDTreeKey): boolean {
  const xIsMatched = inRange(bottomLeftKey[0], topRightKey[0], testPoint[0]);
  const yIsMatched = inRange(bottomLeftKey[1], topRightKey[1], testPoint[1]);

  return xIsMatched && yIsMatched;
}