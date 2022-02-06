import Point from './Point';
import { OFFSET } from '..';

export class TmpPoint extends Point {
  constructor(x, y) {
    super(x, y, null);
    this.offsetPoint = { x: this.x, y: this.y };
  }

  setupConnection(point) {
    this.connectStart = this.offsetPoint;
    this.connectEnd = point.offsetPoint;

    this.middle = {
      x: this.x + (point.x - this.x) / 2,
      y: this.y + (point.y - this.y) / 2,
    }

    this.pointBox = {
      r: this.x,
      b: this.y,
      t: this.y,
      l: this.x,
    }

    this.fromPointBox = {
      r: point.node.x + point.node.width + OFFSET,
      b: point.node.y + point.node.height + OFFSET,
      t: point.node.y - OFFSET,
      l: point.node.x - OFFSET,
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  bottom(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'r':
      case 'd':
      case 'rd':
      case 'ld':
        acc.push({ x: this.x, y: this.connectEnd.y });
        return;
      case 'u':
      case 'lu':
      case 'ru':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  left(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'd':
      case 'u':
      case 'lu':
      case 'ld':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'r':
      case 'rd':
      case 'ru':
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  right(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'd':
      case 'u':
      case 'lu':
      case 'ld':
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      case 'r':
      case 'rd':
      case 'ru':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  top(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'r':
      case 'd':
      case 'rd':
      case 'ld':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'u':
      case 'lu':
      case 'ru':
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
    }
  }
}
