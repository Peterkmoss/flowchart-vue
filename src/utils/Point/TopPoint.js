import Point from './Point';
import { OFFSET } from '..';

export class TopPoint extends Point {
  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x, y: this.y - OFFSET };
  }

  /**
    * @param { Point[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.top(acc, this);
  }
}
