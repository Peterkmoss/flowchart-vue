/* eslint-disable no-unused-vars */
import {approximatelyEquals} from '../math';

class Point {
  x;
  y;
  centerY;
  centerX;
  offsetPoint;
  connectStart;
  connectEnd;

  /**
    * @param { number } x
    * @param { number } y
    */
  constructor(x, y) { 
    this.x = x;
    this.y = y;
    this.centerY = 0;
    this.centerX = 0;
    this.offsetPoint = { x, y };
    this.connectStart = this.offsetPoint;
    this.connectEnd = this.offsetPoint;
  }

  /**
    * @param { Point } toPoint
    */
  _getDirection(toPoint) {
    // Use approximatelyEquals to fix the problem of css position presicion
    if (toPoint.x < this.x && approximatelyEquals(toPoint.y, this.y)) {
      return 'l';
    }
    if (toPoint.x > this.x && approximatelyEquals(toPoint.y, this.y)) {
      return 'r';
    }
    if (approximatelyEquals(toPoint.x, this.x) && toPoint.y < this.y) {
      return 'u';
    }
    if (approximatelyEquals(toPoint.x, this.x) && toPoint.y > this.y) {
      return 'd';
    }
    if (toPoint.x < this.x && toPoint.y < this.y) {
      return 'lu';
    }
    if (toPoint.x > this.x && toPoint.y < this.y) {
      return 'ru';
    }
    if (toPoint.x < this.x && toPoint.y > this.y) {
      return 'ld';
    }
    return 'rd';
  }

  /**
    * @param { Point } toPoint
    */
  connect(acc, toPoint) { 
    this.start = this.offsetPoint;
    this.end = toPoint.offsetPoint;

    this.centerX = this.x + (toPoint.x - this.x) / 2;
    this.centerY = this.y + (toPoint.y - this.y) / 2;

    switch (this._getDirection(toPoint)) {
      case 'd': return this.connectDown(acc, toPoint);
      case 'u': return this.connectUp(acc, toPoint);
      case 'l': return this.connectLeft(acc, toPoint);
      case 'r': return this.connectRight(acc, toPoint);
      case 'ld': return this.connectLeftDown(acc, toPoint);
      case 'lu': return this.connectLeftUp(acc, toPoint);
      case 'rd': return this.connectRightDown(acc, toPoint);
      case 'ru': return this.connectRightUp(acc, toPoint);
    }
  }

  connectDown(acc, toPoint) {}
  connectLeft(acc, toPoint) {}
  connectRight(acc, toPoint) {}
  connectUp(acc, toPoint) {}
  connectLeftUp(acc, toPoint) {}
  connectLeftDown(acc, toPoint) {}
  connectRightUp(acc, toPoint) {}
  connectRightDown(acc, toPoint) {}
}

export default Point
