import Point from './Point';
import { OFFSET } from '..';

export class LeftPoint extends Point {
  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x - OFFSET, y: this.y };
  }

  /**
    * @param { Point[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.left(acc, this);
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
      case 'ld':
        if (this.pointBox.l < this.fromPointBox.r) {
          if (this.connectStart.y > this.fromPointBox.t) {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.fromPointBox.t });
            acc.push({ x: this.pointBox.l, y: this.fromPointBox.t });
          } else {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: Math.max(this.fromPointBox.r, this.middle.x), y: this.connectEnd.y });
          acc.push({ x: Math.max(this.fromPointBox.r, this.middle.x), y: this.connectStart.y });
        }
        return;
      case 'lu':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'r':
      case 'ru':
        if (this.pointBox.t < this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'rd':
        if (this.pointBox.b > this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          if (this.connectStart.x > this.fromPointBox.l) {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
          }
        }
        return;
      case 'd':
      case 'u':
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
        acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
        acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
        return;
      case 'lu':
        if (this.connectStart.y < this.fromPointBox.b) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.b });
          acc.push({ x: this.connectStart.x, y: this.fromPointBox.b });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'ld':
        if (this.connectStart.y > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'r':
      case 'ru':
        if (this.pointBox.t < this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
          acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'rd':
        if (this.pointBox.b > this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'u':
      case 'd':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
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
      case 'lu':
      case 'ld': {
        acc.push({ x: this.middle.x, y: this.connectEnd.y });
        acc.push({ x: this.middle.x, y: this.connectStart.y });
        return;
      }
      case 'r':
      case 'rd': {
        if (this.pointBox.r > this.connectEnd.x) {
          acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.r, y: this.pointBox.t });
          acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        } else {
          if (this.pointBox.b < this.fromPointBox.t) {
            acc.push({ x: this.connectEnd.x, y: this.middle.y });
            acc.push({ x: this.connectStart.x, y: this.middle.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.connectStart.x, y: this.pointBox.t });
          }
        }
        return;
      }
      case 'u':
      case 'ru': {
        if (this.pointBox.r > this.connectEnd.x) {
          acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.r, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          if (this.pointBox.t > this.fromPointBox.b) {
            acc.push({ x: this.connectEnd.x, y: this.middle.y });
            acc.push({ x: this.connectStart.x, y: this.middle.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
            acc.push({ x: this.connectStart.x, y: this.pointBox.b });
          }
        }
        return;
      }
      case 'd': {
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      }
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
      case 'lu':
        if (this.pointBox.l < this.fromPointBox.r) {
          acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'l':
        acc.push({ x: this.middle.x, y: this.connectEnd.y });
        acc.push({ x: this.middle.x, y: this.connectStart.y });
        return;
      case 'ld':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'u':
      case 'd':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'r':
        acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
        acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        return;
      case 'rd':
        if (this.pointBox.b > this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
          acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectEnd.y });
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'ru':
        if (this.pointBox.t < this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
          acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        } else {
          if (this.connectStart.x > this.fromPointBox.l) {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectEnd.y });
            acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
          }
        }
        return;
    }
  }
}
