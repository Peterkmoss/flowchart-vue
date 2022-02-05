import Point from './Point';
import { OFFSET } from '..';

export class RightPoint extends Point {
  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x + OFFSET, y: this.y };
  }
  
  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.right(acc, this);
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  bottom(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'd':
      case 'rd': {
        if (this.connectStart.x > this.fromPointBox.l) {
          acc.push({ x: this.fromPointBox.l, y: this.connectEnd.y });
          acc.push({ x: this.fromPointBox.l, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'ld': {
        if (this.pointBox.b > this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          if (this.connectStart.x < this.fromPointBox.r) {
            acc.push({ x: this.connectEnd.x, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.fromPointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectEnd.y });
            acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
          }
        }
        return;
      }
      case 'r': {
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      }
      case 'u':
      case 'ru': {
        if (this.pointBox.r > this.connectEnd.x) {
          acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
          acc.push({ x: this.pointBox.r, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      }
      case 'l':
      case 'lu': {
        if (this.pointBox.t < this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          acc.push({ x: this.connectEnd.x, y: Math.min(this.pointBox.t, this.middle.y) });
          acc.push({ x: this.connectStart.x, y: Math.min(this.pointBox.t, this.middle.y) });
        }
        return;
      }
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
      case 'lu': {
        if (this.pointBox.t < this.fromPointBox.b) {
          if (this.pointBox.l < this.connectEnd.x) {
            acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.l, y: this.pointBox.b });
            acc.push({ x: this.pointBox.r, y: this.pointBox.b });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
            acc.push({ x: this.connectStart.x, y: this.pointBox.b });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      }
      case 'ld': {
        if (this.pointBox.b > this.fromPointBox.t) {
          if (this.pointBox.l < this.connectEnd.x) {
            acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.l, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.pointBox.t });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.connectStart.x, y: this.pointBox.t });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      }
      case 'r':
      case 'rd':
      case 'u':
      case 'ru': {
        acc.push({ x: this.middle.x, y: this.connectEnd.y });
        acc.push({ x: this.middle.x, y: this.connectStart.y });
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
  right(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l': {
        acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
        acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        return;
      }
      case 'ld': {
        if (this.pointBox.b > this.connectEnd.y) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.b });
          acc.push({ x: this.connectStart.x, y: this.pointBox.b });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'lu': {
        if (this.connectEnd.y > this.pointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
          acc.push({ x: this.pointBox.r, y: this.pointBox.t });
          acc.push({ x: this.pointBox.r, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'r':
      case 'rd': {
        if (this.connectStart.y > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      }
      case 'u':
      case 'ru': {
        if (this.connectStart.y > this.fromPointBox.b) {
          if (this.connectEnd.x < this.pointBox.r) {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.b });
          acc.push({ x: this.middle.x, y: this.fromPointBox.b });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
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
      case 'l':
      case 'ld': {
        if (this.pointBox.b > this.fromPointBox.t) {
          if (this.pointBox.l < this.connectEnd.x) {
            acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.l, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.pointBox.t });
          }
          acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
          acc.push({ x: this.connectStart.x, y: this.pointBox.t });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectEnd.y });
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'u':
      case 'lu': {
        if (this.pointBox.r < this.fromPointBox.r) {
          acc.push({ x: this.fromPointBox.r, y: this.fromPointBox.t });
          acc.push({ x: this.fromPointBox.r, y: this.connectStart.y });
        } else {
          if (this.pointBox.t < this.connectEnd.y) {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
            acc.push({ x: this.pointBox.r, y: this.fromPointBox.t });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          }
        }
        return;
      }
      case 'r':
      case 'rd': {
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      }
      case 'ru': {
        if (this.pointBox.r > this.fromPointBox.l) {
          if (this.connectStart.y < this.fromPointBox.b) {
            acc.push({ x: this.fromPointBox.r, y: this.fromPointBox.t });
            acc.push({ x: this.fromPointBox.r, y: this.fromPointBox.b });
            acc.push({ x: this.connectStart.x, y: this.fromPointBox.b });
          } else {
            acc.push({ x: this.fromPointBox.r, y: this.fromPointBox.t });
            acc.push({ x: this.fromPointBox.r, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.middle.x, y: this.connectEnd.y });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
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
}
