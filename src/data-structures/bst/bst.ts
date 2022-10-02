import { Comparable, ComparisonResult, SymbolTableApi } from '../utils';

class Node<K extends Comparable<K>, V> {
  size = 1;
  leftNode: Node<K, V> | undefined = undefined;
  rightNode: Node<K, V> | undefined = undefined;

  constructor(
    readonly key: K,
    public value: V,
  ) {
  }
}

export class BST<K extends Comparable<K>, V> implements SymbolTableApi<K, V> {
  private _root: Node<K, V> | undefined;

  constructor() {
  }

  get size(): number {
    return this._root?.size ?? 0;
  }

  insert(key: K, value: V): void {
    if (this._root === undefined) {
      this._root = new Node(key, value);
      return;
    }

    this.insertNodeTo(this._root, key, value);
  }

  private insertNodeTo(nodeRef: Node<K, V>, newKey: K, newVal: V): void {
    const nodesComparisonResult = nodeRef.key.compare(newKey);

    if (nodesComparisonResult === ComparisonResult.Same) {
      nodeRef.value = newVal;
      return;
    }

    if (nodesComparisonResult === ComparisonResult.Descending) {
      nodeRef.leftNode !== undefined
        ? this.insertNodeTo(nodeRef.leftNode, newKey, newVal)
        : nodeRef.leftNode = new Node(newKey, newVal);
    } else {
      nodeRef.rightNode !== undefined
        ? this.insertNodeTo(nodeRef.rightNode, newKey, newVal)
        : nodeRef.rightNode = new Node(newKey, newVal);
    }

    nodeRef.size = 1 + (nodeRef.leftNode?.size ?? 0) + (nodeRef.rightNode?.size ?? 0);
  }

  remove(key: K): void {
    this._root = this.removeFor(this._root, key);
  }

  min(): K | undefined {
    return this.minFor(this._root)?.key;
  }

  private minFor(node: Node<K, V> | undefined): Node<K, V> | undefined {
    let currentNode = node;

    while (currentNode !== undefined) {
      if (currentNode.leftNode === undefined) {
        return currentNode;
      }

      currentNode = currentNode.leftNode;
    }

    return undefined;
  }

  removeMin(): void {
    this._root = this.removeMinFor(this._root);
  }

  private removeMinFor(node: Node<K, V> | undefined): Node<K, V> | undefined {
    if (node?.leftNode === undefined) {
      return node?.rightNode;
    }

    node.leftNode = this.removeMinFor(node.leftNode);
    node.size = 1 + (node?.leftNode?.size ?? 0) + (node?.leftNode?.size ?? 0);

    return node;
  }

  // Hibbard deletion
  private removeFor(nodeRef: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
    let currentNode = nodeRef;
    if (currentNode === undefined) {
      return undefined;
    }

    const nodesComparisonResult = currentNode.key.compare(key);

    if (nodesComparisonResult === ComparisonResult.Descending) {
      currentNode.leftNode = this.removeFor(currentNode.leftNode, key);
    } else if (nodesComparisonResult === ComparisonResult.Ascending) {
      currentNode.rightNode = this.removeFor(currentNode.rightNode, key);
    } else {
      if (currentNode.rightNode === undefined) {
        return currentNode.leftNode;
      }

      if (currentNode.leftNode === undefined) {
        return currentNode.rightNode;
      }

      let tmpNode = currentNode;
      currentNode = this.minFor(tmpNode.rightNode);
      
      // current node must be present based on checks above
      currentNode!.rightNode = this.removeMinFor(tmpNode.rightNode);
      currentNode!.leftNode = tmpNode.leftNode;
    }

    // current node must be present based on checks above
    currentNode!.size = 1 + (currentNode?.leftNode?.size ?? 0) + (currentNode?.rightNode?.size ?? 0);

    return currentNode;
  }

  search(key: K): V | undefined {
    let currentNode = this._root;

    while(currentNode !== undefined) {
      const nodesComparisonResult = currentNode.key.compare(key);

      if (nodesComparisonResult === ComparisonResult.Same) {
        return currentNode.value;
      }

      currentNode = nodesComparisonResult === ComparisonResult.Descending ? currentNode.leftNode : currentNode.rightNode;
    }

    return undefined;
  }

  rank(key: K): number {
    return this.rankFor(this._root, key);
  }
  
  private rankFor(nodeRef: Node<K, V> | undefined, key: K): number {
    if (nodeRef === undefined) {
      return 0;
    }

    const nodesComparisonResult = nodeRef.key.compare(key);

    if (nodesComparisonResult === ComparisonResult.Same) {
      return nodeRef.leftNode?.size ?? 0;
    }

    return nodesComparisonResult === ComparisonResult.Descending
      ? this.rankFor(nodeRef.leftNode, key)
      : 1 + (nodeRef.leftNode?.size ?? 0) + this.rankFor(nodeRef.rightNode, key);
  }

  nth(requestedIndex: number): K | undefined {
    if (requestedIndex >= this.size || requestedIndex < 0) {
      return undefined;
    }

    let currentNode = this._root;
    let currentSearchIndex = requestedIndex;

    while(currentNode !== undefined) {
      const leftBranchSize = currentNode.leftNode?.size ?? 0;
      // +1 we omit to add current node
      if (leftBranchSize === currentSearchIndex) {
        return currentNode.key;
      }

      if (leftBranchSize > currentSearchIndex) {
        currentNode = currentNode.leftNode;
        continue;
      }

      currentSearchIndex -= leftBranchSize + 1;
      currentNode = currentNode.rightNode;
    }

    return undefined;
  }
}