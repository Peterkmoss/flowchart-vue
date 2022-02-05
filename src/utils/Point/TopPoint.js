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

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  bottom(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return
      case 'lu':
      case 'ru':
      case 'u':
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      case 'ld':
        if (this.pointBox.l < this.fromPointBox.r) {
          if (this.connectStart.y > this.fromPointBox.t) {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.fromPointBox.t });
            acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
          } else {
            acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.middle.x, y: this.connectEnd.y });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        }
        return;
      case 'r':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'rd':
        if (this.pointBox.r > this.fromPointBox.l) {
          acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.l, y: this.connectStart.y });
        } else {
          acc.push({ x: this.middle.x, y: this.connectEnd.y });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        }
        return;
      case 'd':
        acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
        acc.push({ x: this.pointBox.l, y: this.connectStart.y });
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
      case 'ld':
        if (this.pointBox.t > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
        } else {
          if (this.pointBox.l < this.connectEnd.x) {
            acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.l, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
          }
        }
        return;
      case 'lu':
        if (this.pointBox.t < this.fromPointBox.b) {
        acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
        acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      case 'r':
      case 'ru':
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      case 'd':
      case 'rd':
        if (this.pointBox.r > this.connectEnd.x) {
          acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.l, y: this.connectStart.y });
        } else {
          acc.push({ x: Math.max(this.pointBox.r, this.middle.x), y: this.connectEnd.y });
          acc.push({ x: Math.max(this.pointBox.r, this.middle.x), y: this.connectStart.y });
        }
        return;
      case 'u':
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
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      case 'ld':
        if (this.pointBox.l < this.connectEnd.x) {
          if (this.pointBox.b > this.connectEnd.y) {
            acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
          } else {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'lu':
      case 'u':
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      case 'r':
      case 'ru':
        if (this.pointBox.t < this.fromPointBox.b) {
          if (this.connectStart.x > this.fromPointBox.l) {
            acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
            acc.push({ x: this.fromPointBox.l, y: this.fromPointBox.t });
            acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
            acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'rd':
        if (this.pointBox.t > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.connectStart.x, y: this.fromPointBox.t });
        } else {
          if (this.pointBox.r > this.connectEnd.x) {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
          }
        }
        return;
      case 'd':
        acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
        acc.push({ x: this.pointBox.r, y: this.connectStart.y });
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
      case 'r':
      case 'l':
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      case 'ld':
        if (this.pointBox.l < this.connectEnd.x) {
          acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.l, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'd':
        acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
        acc.push({ x: this.pointBox.l, y: this.connectStart.y });
        return;
      case 'rd':
        if (this.pointBox.r > this.connectEnd.x) {
          acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.r, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      case 'lu':
        if (this.connectStart.x < this.fromPointBox.r) {
          acc.push({ x: this.fromPointBox.r, y: this.connectEnd.y });
          acc.push({ x: this.fromPointBox.r, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      case 'u':
        acc.push({ x: this.fromPointBox.r, y: this.connectEnd.y });
        acc.push({ x: this.fromPointBox.r, y: this.connectStart.y });
        return;
      case 'ru':
        if (this.connectStart.x > this.fromPointBox.l) {
          acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.fromPointBox.l, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
    }
  }
}
