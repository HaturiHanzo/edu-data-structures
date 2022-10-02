import React, { Component } from 'react';
import { KDTree } from './data-structures/kd-tree/kd-tree';
import { ComparableKey, createComparableKey, randomInt } from './data-structures/utils';

import './app.css';

const simulationProps = {
  areaWidth: 100,
  areaHeight: 100,
  dotRadius: 1,
  matchingAreaX: 25,
  matchingAreaY: 25,
  matchingAreaWidth: 50,
  matchingAreaHeight: 50,
  dotsAmount: 300,
}

class Point {
  readonly key: [ComparableKey, ComparableKey];
  isMatched = false;

  constructor(readonly x: number, readonly y: number) {
    this.key = [createComparableKey(x), createComparableKey(y)];
  }
}

interface State {
  readonly points: readonly Point[];
}

export class App extends Component<{}, State> {
  constructor(props: {}, ctx: {}) {
    super(props, ctx);
    this.state = this.generateState();
  }

  render() {
    return (
      <>
        <div className={'app'}>
          <svg viewBox={`0 0 ${simulationProps.areaWidth} ${simulationProps.areaHeight}`} className={'app-svg'}>
            {this.state.points.map((point, idx) => (
              <circle
                r={simulationProps.dotRadius}
                cx={point.x}
                cy={simulationProps.areaHeight - point.y}
                fill={point.isMatched ? 'red' : 'black'}
                key={idx}
              ></circle>
            ))}
            <rect
              x={simulationProps.matchingAreaX}
              y={simulationProps.matchingAreaY}
              width={simulationProps.matchingAreaWidth}
              height={simulationProps.matchingAreaHeight}
              fill={'green'}
              fillOpacity={0.3}>
            </rect>
          </svg>
        </div>
        <div className={'app-reset'} onClick={() => this.setState(this.generateState())}>reset</div>
      </>
    );
  }

  private generateState(): State {
    const {
      dotsAmount,
      matchingAreaX,
      matchingAreaY,
      matchingAreaWidth,
      matchingAreaHeight,
      areaWidth,
      areaHeight
    } = simulationProps

    const tree = new KDTree<Point>(2);
    const points = Array.from(
      { length: dotsAmount },
      () => new Point(randomInt(0, areaWidth), randomInt(0, areaHeight))
    );
    points.forEach(p => tree.insert(p.key, p));
    tree.rangeSearch2D(
      new Point(matchingAreaX, matchingAreaY).key,
      new Point(matchingAreaX + matchingAreaWidth, matchingAreaY + matchingAreaHeight).key,
    ).forEach(point => point.isMatched = true);

    return { points };
  }
}