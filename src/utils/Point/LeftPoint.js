import Point from './Point';
import { OFFSET } from '..';

export class LeftPoint extends Point {
  #vertical;

  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x - OFFSET, y: this.y };
    this.#vertical = () => ({ x: this.connectStart.x, y: this.connectEnd.y });
  }

  /**
    * @param { Point[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.left(acc, this);
  }

  connectDown() {
    return [ this.#vertical() ];
  }

  connectLeft() {
    return [ this.#vertical() ];
  }

  connectLeftUp() {
    return [ this.#vertical() ];
  }

  connectLeftDown() {
    return [ this.#vertical() ];
  }

  connectRightDown() {
    return [ this.#vertical() ];
  }

  connectRightUp() {
    return [ this.#vertical() ];
  }
}
