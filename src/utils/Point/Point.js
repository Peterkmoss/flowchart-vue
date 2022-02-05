/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { Node } from '../Node'
import { approximatelyEquals } from "../math";

class Point {
  /** @type { number }*/
  x;
  /** @type { number }*/
  y;
  /** @type { Node }*/
  node;
  /** @type { x: number, y: number }*/
  middle;
  /** @type { x: number, y: number }*/
  offsetPoint;
  /** @type { x: number, y: number }*/
  connectStart;
  /** @type { x: number, y: number }*/
  connectEnd;

  /**
    * @param { number } x
    * @param { number } y
    * @param { Node } node
    */
  constructor(x, y, node) { 
    this.x = x;
    this.y = y;
    this.node = node;
    this.middle = { x: 0, y: 0 };
    this.offsetPoint = { x, y };
    this.connectStart = this.offsetPoint;
    this.connectEnd = this.offsetPoint;
  }

  _getDirection() {
    if (
      this.connectEnd.x < this.connectStart.x 
      && approximatelyEquals(this.connectEnd.y, this.connectStart.y)) {
      return 'l';
    }
    if (
      this.connectEnd.x > this.connectStart.x 
      && approximatelyEquals(this.connectEnd.y, this.connectStart.y)) {
      return 'r';
    }
    if (
      this.connectEnd.y < this.connectStart.y 
      && approximatelyEquals(this.connectEnd.x, this.connectStart.x)) {
      return 'u';
    }
    if (
      this.connectEnd.y > this.connectStart.y 
      && approximatelyEquals(this.connectEnd.x, this.connectStart.x)) {
      return 'd';
    }
    if (
      this.connectEnd.x < this.connectStart.x 
      && this.connectEnd.y < this.connectStart.y) {
      return 'lu';
    }
    if (
      this.connectEnd.x < this.connectStart.x 
      && this.connectEnd.y > this.connectStart.y) {
      return 'ld';
    }
    if (
      this.connectEnd.x > this.connectStart.x 
      && this.connectEnd.y < this.connectStart.y) {
      return 'ru';
    }
    return 'rd';
  }

  setupConnection(toPoint) {
    this.connectStart = this.offsetPoint;
    this.connectEnd = toPoint.offsetPoint;

    this.middle = {
      x: this.x + (toPoint.x - this.x) / 2,
      y: this.y + (toPoint.y - this.y) / 2,
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) { 
    this.setupConnection(toPoint);
  }

  /**
    * Incoming connection from a LeftPoint
    * @param { Point } fromPoint
    */
  left(fromPoint) { return; }

  /**
    * Incoming connection from a RightPoint
    * @param { Point } fromPoint
    */
  right(fromPoint) { return; }

  /**
    * Incoming connection from a TopPoint
    * @param { Point } fromPoint
    */
  top(fromPoint) { return; }

  /**
    * Incoming connection from a BottomPoint
    * @param { Point } fromPoint
    */
  bottom(fromPoint) { return; }
}

export default Point
