import Point from './Point';
import { OFFSET } from '..';

export class RightPoint extends Point {
  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x + OFFSET, y: this.y };
  }
  
  /**
    * @param { Point[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.right(acc, this);
  }
}
